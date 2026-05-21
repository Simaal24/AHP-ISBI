function ProgressBar({ progress }) {
  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width:`${Math.max(0, progress * 100)}%` }} />
      </div>
    </div>
  );
}

function BackButton({ onClick, visible }) {
  return (
    <button className={`back-btn ${visible ? 'visible' : ''}`}
      onClick={onClick} aria-label="Go back" disabled={!visible}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
      </svg>
      <span className="back-btn-label">Back</span>
    </button>
  );
}

function SurveyApp() {
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState('forward');
  const [animKey, setAnimKey] = React.useState(0);
  const [formData, setFormData] = React.useState({
    name:'', email:'', state:'', city:'',
    education:'', relationship:'', experience:'', familiarity:''
  });
  const [comparisons, setComparisons] = React.useState({});

  const [pairOrder] = React.useState(() =>
    shuffleArray(Array.from({ length: PAIRS.length }, (_, i) => i))
  );
  const [pairSwaps] = React.useState(() =>
    Array.from({ length: PAIRS.length }, () => Math.random() < 0.5)
  );

  const stepRef = React.useRef(step);
  React.useEffect(() => { stepRef.current = step; }, [step]);

  const TOTAL_STEPS = 26;
  const AHP_START = 9;
  const MIDWAY_STEP = 16;   // after first 7 comparisons
  const AHP_END = 24;

  const progress = step <= 0 ? 0 : step >= TOTAL_STEPS - 1 ? 1 :
    (step - 1) / (TOTAL_STEPS - 3);

  const navigate = React.useCallback((newStep) => {
    const curStep = stepRef.current;
    setDir(newStep > curStep ? 'forward' : 'backward');
    setAnimKey(k => k + 1);
    setStep(newStep);
  }, []);

  const goNext = React.useCallback(() => {
    const cur = stepRef.current;
    if (cur >= TOTAL_STEPS - 1) return;
    navigate(cur + 1);
  }, [navigate]);

  const goBack = React.useCallback(() => {
    const cur = stepRef.current;
    if (cur > 0 && cur < TOTAL_STEPS - 1) navigate(cur - 1);
  }, [navigate]);

  const updateField = (field) => (val) =>
    setFormData(prev => ({ ...prev, [field]: val }));

  const makeComparisonHandler = React.useCallback((pairIdx, swapped) => (visualVal) => {
    const canonicalVal = swapped ? -visualVal : visualVal;
    setComparisons(prev => ({ ...prev, [pairIdx]: canonicalVal }));
    setTimeout(() => {
      const cur = stepRef.current;
      navigate(Math.min(cur + 1, TOTAL_STEPS - 1));
    }, 420);
  }, [navigate]);

  React.useEffect(() => {
    const onKey = (e) => {
      const cur = stepRef.current;
      if (e.key === 'Escape' && cur > 0 && cur < TOTAL_STEPS - 1) goBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goBack]);

  const animClass = dir === 'forward' ? 'anim-slide-up' : 'anim-slide-down';

  const renderStep = () => {
    const totalInfo = 7;
    switch (step) {
      case 0:
        return <WelcomeScreen onBegin={goNext} />;
      case 1:
        return <NameEmailStep name={formData.name} email={formData.email}
          onChangeName={updateField('name')} onChangeEmail={updateField('email')}
          onNext={goNext} stepNum={1} totalSteps={totalInfo} />;
      case 2:
        return <DropdownStep label="Which state or territory are you in?"
          options={INDIAN_STATES} value={formData.state}
          onChange={updateField('state')} onNext={goNext}
          placeholder="Type to search…" stepNum={2} totalSteps={totalInfo} />;
      case 3:
        const cityOptions = CITIES_BY_STATE[formData.state] || [];
        return <DropdownStep label="What city do you live in?"
          options={cityOptions} value={formData.city}
          onChange={updateField('city')} onNext={goNext}
          placeholder="Type to search…" stepNum={3} totalSteps={totalInfo} />;
      case 4:
        return <CardSelectStep
          label="Highest level of education completed?"
          options={EDUCATION_LEVELS} value={formData.education}
          onChange={updateField('education')} onNext={goNext}
          stepNum={4} totalSteps={totalInfo} />;
      case 5:
        return <CardSelectStep
          label="What best describes your role?"
          options={RELATIONSHIP_OPTIONS.map(r => r.label)}
          value={formData.relationship}
          onChange={updateField('relationship')} onNext={goNext}
          stepNum={5} totalSteps={totalInfo} />;
      case 6:
        return <CardSelectStep
          label="Years of professional experience?"
          sublabel="In real estate, construction, sustainability, or related fields"
          options={EXPERIENCE_RANGES} value={formData.experience}
          onChange={updateField('experience')} onNext={goNext}
          stepNum={6} totalSteps={totalInfo} />;
      case 7:
        return <CardSelectStep
          label="How familiar are you with sustainability practices in Indian residential construction?"
          options={FAMILIARITY_LEVELS} value={formData.familiarity}
          onChange={updateField('familiarity')} onNext={goNext}
          stepNum={7} totalSteps={totalInfo} />;
      case 8:
        return <ExplanationScreen relationship={formData.relationship} onNext={goNext} />;
      case MIDWAY_STEP:
        return <MidwayScreen comparisons={comparisons} onNext={goNext} />;
      case TOTAL_STEPS - 1:
        return <ResultsScreen comparisons={comparisons} formData={formData} />;
      default:
        if ((step >= AHP_START && step < MIDWAY_STEP) || (step > MIDWAY_STEP && step <= AHP_END)) {
          // displayIdx accounts for the midway screen inserted after comparison 6
          const displayIdx = step < MIDWAY_STEP ? step - AHP_START : step - AHP_START - 1;
          const pairIdx = pairOrder[displayIdx];
          const [iA, iB] = PAIRS[pairIdx];
          const swapped = pairSwaps[displayIdx];
          const catA = swapped ? CATEGORIES[iB] : CATEGORIES[iA];
          const catB = swapped ? CATEGORIES[iA] : CATEGORIES[iB];
          const canonical = comparisons[pairIdx] ?? null;
          const displayVal = canonical != null ? (swapped ? -canonical : canonical) : null;

          return (
            <AHPComparison
              catA={catA} catB={catB}
              pairIndex={displayIdx} totalPairs={PAIRS.length}
              value={displayVal}
              onChange={makeComparisonHandler(pairIdx, swapped)}
            />
          );
        }
        return null;
    }
  };

  const showBack = step > 0 && step < TOTAL_STEPS - 1;
  const showProgress = step > 0 && step < TOTAL_STEPS - 1;

  return (
    <div className="survey-root">
      {showProgress && <ProgressBar progress={progress} />}
      <BackButton onClick={goBack} visible={showBack} />
      <div key={animKey} className={`step-container ${animClass}`}>
        {renderStep()}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SurveyApp />);
