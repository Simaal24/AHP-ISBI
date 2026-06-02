function ProgressBar({ infoProgress, ahpProgress, onAHP }) {
  return (
    <div className="progress-bar-wrap">
      <div style={{ display:'flex', gap:4, height:'100%' }}>
        <div style={{ flex:1 }}>
          <div className="progress-bar-track" style={{ height:'100%' }}>
            <div className="progress-bar-fill" style={{ width:`${infoProgress * 100}%` }} />
          </div>
        </div>
        <div style={{ flex:2.5 }}>
          <div className="progress-bar-track" style={{ height:'100%',
            opacity: onAHP ? 1 : 0.35, transition:'opacity 0.4s' }}>
            <div className="progress-bar-fill" style={{ width:`${ahpProgress * 100}%` }} />
          </div>
        </div>
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

  const relationshipRef = React.useRef(formData.relationship);
  React.useEffect(() => { relationshipRef.current = formData.relationship; }, [formData.relationship]);

  const TOTAL_STEPS = 24;
  const AHP_START = 7;
  const MIDWAY_STEP = 14;   // after first 7 comparisons
  const AHP_END = 22;

  // Info bar: fills as they complete the 6 info screens (steps 1–6), stays full after
  const infoProgress = step <= 0 ? 0 : step >= AHP_START ? 1 : step / (AHP_START - 1);
  // AHP bar: fills based on comparisons answered (0–15), regardless of step
  const ahpProgress = Object.keys(comparisons).length / PAIRS.length;
  const onAHP = step >= AHP_START;

  const isAHPStep = (s) => (s >= AHP_START && s < MIDWAY_STEP) || (s > MIDWAY_STEP && s <= AHP_END);

  const navigate = React.useCallback((newStep) => {
    const curStep = stepRef.current;
    setDir(newStep > curStep ? 'forward' : 'backward');
    // AHP→AHP: don't remount the step container — GradientSlider animates its own content
    if (!(isAHPStep(curStep) && isAHPStep(newStep))) {
      setAnimKey(k => k + 1);
    }
    setStep(newStep);
  }, []);

  const goNext = React.useCallback(() => {
    const cur = stepRef.current;
    if (cur >= TOTAL_STEPS - 1) return;
    navigate(cur + 1);
  }, [navigate]);

  const goBack = React.useCallback(() => {
    const cur = stepRef.current;
    if (cur > 0 && cur < TOTAL_STEPS - 1) {
      // Citizens skipped step 4 (experience) going forward — skip it going back too
      const isCitizen = RELATIONSHIP_OPTIONS.find(r => r.label === relationshipRef.current)?.citizen ?? true;
      navigate(cur === 5 && isCitizen ? 3 : cur - 1);
    }
  }, [navigate]);

  const updateField = (field) => (val) =>
    setFormData(prev => ({ ...prev, [field]: val }));

  // City selection also auto-derives state from the reverse lookup
  const handleCityChange = (city) => {
    const state = STATE_BY_CITY[city] || '';
    setFormData(prev => ({ ...prev, city, state }));
  };

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
    const isCitizenRole = RELATIONSHIP_OPTIONS.find(r => r.label === formData.relationship)?.citizen ?? true;
    switch (step) {
      case 0:
        return <WelcomeScreen onBegin={goNext} />;
      case 1:
        return <AboutYouStep
          name={formData.name} email={formData.email} city={formData.city}
          onChangeName={updateField('name')} onChangeEmail={updateField('email')}
          onChangeCity={handleCityChange} onNext={goNext} />;
      case 2:
        return <CardSelectStep
          label="Highest level of education completed?"
          options={EDUCATION_LEVELS} value={formData.education}
          onChange={updateField('education')} onNext={goNext}
          stepNum={1} totalSteps={4} />;
      case 3:
        return <CardSelectStep
          label="What best describes your relationship to real estate?"
          options={RELATIONSHIP_OPTIONS.map(r => r.label)}
          value={formData.relationship}
          onChange={updateField('relationship')}
          onNext={(selectedRole) => {
            const isCitizen = RELATIONSHIP_OPTIONS.find(r => r.label === selectedRole)?.citizen ?? true;
            navigate(isCitizen ? 5 : 4);
          }}
          stepNum={2} totalSteps={4} />;
      case 4:
        return <CardSelectStep
          label="Years of professional experience?"
          sublabel="In real estate, construction, sustainability, or related fields"
          options={EXPERIENCE_RANGES} value={formData.experience}
          onChange={updateField('experience')} onNext={goNext}
          stepNum={3} totalSteps={4} />;
      case 5:
        return <CardSelectStep
          label={isCitizenRole
            ? "How much does sustainability factor into your home decisions?"
            : "How familiar are you with sustainable or green building practices?"}
          options={isCitizenRole ? FAMILIARITY_LEVELS_CITIZEN : FAMILIARITY_LEVELS}
          value={formData.familiarity}
          onChange={updateField('familiarity')} onNext={goNext}
          stepNum={isCitizenRole ? 3 : 4} totalSteps={isCitizenRole ? 3 : 4} />;
      case 6:
        return <ExplanationScreen relationship={formData.relationship} onNext={goNext} />;
      case MIDWAY_STEP:
        return <MidwayScreen comparisons={comparisons} onNext={goNext} />;
      case TOTAL_STEPS - 1:
        return <ResultsScreen comparisons={comparisons} formData={formData} />;
      default:
        if ((step >= AHP_START && step < MIDWAY_STEP) || (step > MIDWAY_STEP && step <= AHP_END)) {
          // displayIdx accounts for the midway screen inserted after comparison 7
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
      {showProgress && <ProgressBar infoProgress={infoProgress} ahpProgress={ahpProgress} onAHP={onAHP} />}
      <BackButton onClick={goBack} visible={showBack} />
      <div key={animKey} className={`step-container ${animClass}`}>
        {renderStep()}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SurveyApp />);
