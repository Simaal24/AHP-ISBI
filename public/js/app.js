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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
      </svg>
    </button>
  );
}

function SurveyApp() {
  const scaleStyle = 'slider';

  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState('forward');
  const [animKey, setAnimKey] = React.useState(0);
  const [formData, setFormData] = React.useState({
    name:'', email:'', state:'', city:'',
    experience:'', relationship:'', organization:''
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

  const TOTAL_STEPS = 25;
  const AHP_START = 9;
  const AHP_END = 23;

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
        return <TextInputStep label="What's your full name?"
          value={formData.name} onChange={updateField('name')} onNext={goNext}
          placeholder="Type your name…" stepNum={1} totalSteps={totalInfo} />;
      case 2:
        return <TextInputStep label="What's your email address?"
          sublabel="We'll only use this to follow up if needed."
          value={formData.email} onChange={updateField('email')} onNext={goNext}
          placeholder="you@example.com" type="email"
          stepNum={2} totalSteps={totalInfo} />;
      case 3:
        return <DropdownStep label="Which state or territory are you in?"
          options={INDIAN_STATES} value={formData.state}
          onChange={updateField('state')} onNext={goNext}
          placeholder="Type to search…" stepNum={3} totalSteps={totalInfo} />;
      case 4:
        const cityOptions = CITIES_BY_STATE[formData.state] || [];
        return <DropdownStep label="What city do you live in?"
          options={cityOptions} value={formData.city}
          onChange={updateField('city')} onNext={goNext}
          placeholder="Type to search…" stepNum={4} totalSteps={totalInfo} />;
      case 5:
        return <CardSelectStep
          label="How many years of experience do you have?"
          sublabel="In real estate, construction, sustainability, or related fields"
          options={EXPERIENCE_RANGES} value={formData.experience}
          onChange={updateField('experience')} onNext={goNext}
          stepNum={5} totalSteps={totalInfo} />;
      case 6:
        return <CardSelectStep
          label="What best describes your relationship to real estate in India?"
          options={RELATIONSHIP_OPTIONS.map(r => r.label)}
          value={formData.relationship}
          onChange={updateField('relationship')} onNext={goNext}
          stepNum={6} totalSteps={totalInfo} />;
      case 7:
        return <TextInputStep label="What's your organization or affiliation?"
          value={formData.organization} onChange={updateField('organization')}
          onNext={goNext} placeholder="e.g. company, university…"
          optional stepNum={7} totalSteps={totalInfo} />;
      case 8:
        return <ExplanationScreen relationship={formData.relationship} onNext={goNext} />;
      case TOTAL_STEPS - 1:
        return <ResultsScreen comparisons={comparisons} formData={formData} />;
      default:
        if (step >= AHP_START && step <= AHP_END) {
          const displayIdx = step - AHP_START;
          const pairIdx = pairOrder[displayIdx];
          const [iA, iB] = PAIRS[pairIdx];
          const swapped = pairSwaps[displayIdx];
          const catA = swapped ? CATEGORIES[iB] : CATEGORIES[iA];
          const catB = swapped ? CATEGORIES[iA] : CATEGORIES[iB];
          const canonical = comparisons[pairIdx] ?? null;
          const displayVal = canonical != null ? (swapped ? -canonical : canonical) : null;

          return (
            <AHPComparison
              scaleStyle={scaleStyle}
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
