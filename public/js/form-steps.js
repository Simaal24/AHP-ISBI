function WelcomeScreen({ onBegin }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', minHeight:'100dvh', padding:'2rem 1.5rem', textAlign:'center' }}>
      <img src="logo.png" alt="SmarterDharma" style={{ height: 56, marginBottom: '2rem', objectFit:'contain' }} />
      <h1 style={{ fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:700, color:'var(--green-900)',
        lineHeight:1.2, marginBottom:'0.75rem', letterSpacing:'-0.02em' }}>
        Indian Sustainable Building Index
      </h1>
      <p style={{ fontSize:'clamp(1rem,2.2vw,1.2rem)', color:'var(--gray-600)', maxWidth:520,
        lineHeight:1.6, marginBottom:'2.5rem' }}>
        Help us understand what matters most when evaluating sustainability
        in Indian residential real estate. This takes about 5–8 minutes.
      </p>
      <button className="btn-primary" onClick={onBegin} style={{ fontSize:'1.1rem', padding:'1rem 3rem' }}>
        Begin
      </button>
      <p style={{ fontSize:'0.8rem', color:'var(--gray-400)', marginTop:'1.5rem', maxWidth:400 }}>
        Your responses are confidential and used solely for academic research.
      </p>
    </div>
  );
}

function FieldLayout({ label, sublabel, hint, stepNum, totalSteps, children }) {
  return (
    <div className="field-layout">
      <div style={{ marginBottom:'0.5rem' }}>
        <span className="step-counter">{stepNum} of {totalSteps}</span>
      </div>
      <h2 className="field-label">{label}</h2>
      {sublabel && <p className="field-sublabel">{sublabel}</p>}
      <div style={{ marginTop:'1.5rem', width:'100%', maxWidth:520 }}>
        {children}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function AboutYouStep({ name, email, city, onChangeName, onChangeEmail, onChangeCity, onNext }) {
  const nameRef = React.useRef(null);
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [citySearch, setCitySearch] = React.useState(city || '');
  const [cityOpen, setCityOpen] = React.useState(false);
  React.useEffect(() => { setTimeout(() => nameRef.current?.focus(), 400); }, []);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canProceed = name.trim().length > 0 && validEmail && city.trim().length > 0;
  const showEmailError = emailTouched && email.trim().length > 0 && !validEmail;
  const handleKey = (e) => { if (e.key === 'Enter' && canProceed) onNext(); };

  const mainCities = ALL_CITIES.filter(c => c !== 'Other');
  const filteredCities = mainCities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
  const displayCities = [...filteredCities, 'Other'];

  const selectCity = (opt) => {
    onChangeCity(opt);
    setCitySearch(opt);
    setCityOpen(false);
  };

  const labelStyle = { fontSize:'0.8rem', fontWeight:600, color:'var(--gray-500)',
    textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6, display:'block' };

  return (
    <div className="field-layout">
      <h2 className="field-label">A little about you</h2>
      <div style={{ marginTop:'1.5rem', width:'100%', maxWidth:520,
        display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        <div>
          <label style={labelStyle}>Full name</label>
          <input ref={nameRef} type="text" className="text-input" value={name}
            onChange={e => onChangeName(e.target.value)} onKeyDown={handleKey}
            placeholder="Your name…" />
        </div>
        <div>
          <label style={labelStyle}>Email address</label>
          <input type="email" className="text-input" value={email}
            onChange={e => { onChangeEmail(e.target.value); setEmailTouched(true); }}
            onKeyDown={handleKey} placeholder="you@example.com"
            style={showEmailError ? { borderBottomColor:'#DC2626' } : {}} />
          {showEmailError && (
            <p style={{ color:'#DC2626', fontSize:'0.8rem', marginTop:'0.4rem' }}>
              Please enter a valid email address.
            </p>
          )}
        </div>
        <div style={{ position:'relative' }}>
          <label style={labelStyle}>City</label>
          <input className="text-input" value={citySearch}
            placeholder="Type to search…"
            onChange={e => { setCitySearch(e.target.value); setCityOpen(true); onChangeCity(''); }}
            onFocus={() => setCityOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && filteredCities.length === 1) selectCity(filteredCities[0]);
              if (e.key === 'Escape') setCityOpen(false);
            }}
          />
          {cityOpen && displayCities.length > 0 && (
            <div className="dropdown-list">
              {displayCities.map(opt => (
                <button key={opt}
                  className={`dropdown-item ${opt === city ? 'selected' : ''}`}
                  onMouseDown={e => { e.preventDefault(); selectCity(opt); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="field-hint" style={{ marginTop:'1.25rem' }}>Press Enter ↵ to continue</p>
      <button className="btn-continue" onClick={onNext} disabled={!canProceed}
        style={{ marginTop:'0.75rem' }}>
        Continue
        <span style={{ fontSize:'0.75rem', opacity:0.6, marginLeft:8 }}>↵</span>
      </button>
    </div>
  );
}

function CardSelectStep({ label, sublabel, options, value, onChange, onNext,
  stepNum, totalSteps }) {
  const select = (opt) => {
    onChange(opt);
    setTimeout(() => onNext(opt), 350);
  };
  const items = options.map(o => typeof o === 'string' ? { label: o } : o);

  return (
    <FieldLayout label={label} sublabel={sublabel} stepNum={stepNum} totalSteps={totalSteps}>
      <div className="card-select-grid">
        {items.map((item, i) => (
          <button key={item.label}
            className={`card-select-item ${value === item.label ? 'selected' : ''}`}
            onClick={() => select(item.label)}>
            <span className="card-select-letter">{String.fromCharCode(65 + i)}</span>
            <span className="card-select-text">{item.label}</span>
          </button>
        ))}
      </div>
    </FieldLayout>
  );
}

function ExplanationScreen({ relationship, onNext }) {
  const isCitizen = RELATIONSHIP_OPTIONS.find(r => r.label === relationship)?.citizen ?? true;

  return (
    <div className="field-layout" style={{ textAlign:'left' }}>
      <div style={{ background:'var(--green-50)', borderRadius:16, padding:'clamp(1.5rem,4vw,2.5rem)',
        maxWidth:600, width:'100%', border:'1px solid var(--green-100)' }}>
        <h2 style={{ fontSize:'clamp(1.3rem,3vw,1.75rem)', fontWeight:700, color:'var(--green-900)',
          marginBottom:'1rem', lineHeight:1.3 }}>
          How the next section works
        </h2>
        <div style={{ fontSize:'clamp(0.95rem,2vw,1.05rem)', color:'var(--gray-700)', lineHeight:1.7 }}>
          <p style={{ marginBottom:'0.85rem' }}>
            You'll compare pairs of sustainability categories — like
            <strong> Energy & Climate</strong> vs <strong>Water Management</strong>.
            {isCitizen
              ? ' For each, think about a home you\'d live in year-round and pick whichever matters more to your comfort, health, and well-being.'
              : ' Drawing on your professional experience across projects and climates in India, pick which matters more when judging how sustainable a residential project truly is.'}
          </p>
          <div style={{ padding:'0.85rem 1rem', background:'#FEF3C7',
            border:'1px solid #FDE68A', borderRadius:10, lineHeight:1.7 }}>
            <p style={{ fontSize:'clamp(0.88rem,1.9vw,0.97rem)', color:'#78350F',
              fontWeight:700, marginBottom:'0.4rem' }}>
              ⚠ Every notch on the slider is a real multiplier.
            </p>
            <p style={{ fontSize:'clamp(0.83rem,1.7vw,0.92rem)', color:'#92400E',
              marginBottom:'0.4rem' }}>
              Sliding to <strong>3×</strong> means one category is three times
              more important. <strong>5×</strong> is five times. The
              edge — <strong>9×</strong> — means nine times more important.
            </p>
            <p style={{ fontSize:'clamp(0.83rem,1.7vw,0.92rem)', color:'#92400E' }}>
              Equal is perfectly valid — only move away from center when
              you genuinely believe that gap exists.
              {!isCitizen && ' 15 comparisons, about 3 minutes.'}
            </p>
          </div>
        </div>
        <button className="btn-primary" onClick={onNext}
          style={{ marginTop:'2rem', fontSize:'1.05rem', padding:'0.9rem 2.5rem' }}>
          Start comparisons
        </button>
      </div>
    </div>
  );
}

function MidwayScreen({ doneCount, totalPairs, onNext }) {
  const done = doneCount;
  const total = totalPairs;
  const remaining = total - done;

  const [animate, setAnimate] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setAnimate(true), 100); }, []);

  return (
    <div className="midway-screen">
      <div className="midway-inner">

        {/* Left — heading + cta */}
        <div className="midway-left">
          <h2 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:700,
            color:'var(--green-900)', lineHeight:1.25, marginBottom:'0.75rem' }}>
            Halfway through
          </h2>
          <p style={{ fontSize:'0.9rem', color:'var(--gray-500)', lineHeight:1.65,
            marginBottom:'2rem' }}>
            {done} of {total} comparisons done.
            The final {remaining} will complete the picture.
          </p>
          <button className="btn-primary" onClick={onNext}
            style={{ fontSize:'1rem', padding:'0.9rem 2rem' }}>
            Keep going →
          </button>
        </div>

        {/* Right — progress dot map */}
        <div className="midway-right" style={{ display:'flex', alignItems:'center' }}>
          <div>
            <div className="midway-dots">
              {Array.from({ length: total }, (_, i) => (
                <div key={i}
                  className={`midway-dot ${i < done ? 'midway-dot-done' : ''}`}
                  style={animate && i < done
                    ? { animation: `dotPop 0.35s ease-out ${i * 0.04}s both` }
                    : {}}
                />
              ))}
            </div>
            <div className="midway-dot-legend">
              <span>{done} done</span>
              <span>{remaining} to go</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
