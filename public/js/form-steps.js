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

function NameEmailStep({ name, email, onChangeName, onChangeEmail, onNext, stepNum, totalSteps }) {
  const nameRef = React.useRef(null);
  const [emailTouched, setEmailTouched] = React.useState(false);
  React.useEffect(() => { setTimeout(() => nameRef.current?.focus(), 400); }, []);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canProceed = name.trim().length > 0 && validEmail;
  const showEmailError = emailTouched && email.trim().length > 0 && !validEmail;
  const handleKey = (e) => { if (e.key === 'Enter' && canProceed) onNext(); };

  return (
    <FieldLayout label="Let's start with the basics" stepNum={stepNum} totalSteps={totalSteps}
      hint="Press Enter ↵ to continue">
      <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
        <div>
          <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--gray-500)',
            textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6, display:'block' }}>
            Full name
          </label>
          <input ref={nameRef} type="text" className="text-input" value={name}
            onChange={e => onChangeName(e.target.value)} onKeyDown={handleKey}
            placeholder="Your name…" />
        </div>
        <div>
          <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--gray-500)',
            textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6, display:'block' }}>
            Email address
          </label>
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
      </div>
      <button className="btn-continue" onClick={onNext} disabled={!canProceed}
        style={{ marginTop:'1.5rem' }}>
        Continue
        <span style={{ fontSize:'0.75rem', opacity:0.6, marginLeft:8 }}>↵</span>
      </button>
    </FieldLayout>
  );
}

function DropdownStep({ label, sublabel, options, value, onChange, onNext, placeholder,
  stepNum, totalSteps }) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef(null);
  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400); }, []);

  const hasOther = options.includes('Other');
  const mainOptions = hasOther ? options.filter(o => o !== 'Other') : options;
  const filtered = mainOptions.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );
  // "Other" is always pinned at the bottom regardless of what's typed
  const displayList = hasOther ? [...filtered, 'Other'] : filtered;

  const select = (opt) => {
    onChange(opt);
    setSearch(opt);
    setOpen(false);
    setTimeout(() => onNext(), 350);
  };

  return (
    <FieldLayout label={label} sublabel={sublabel} stepNum={stepNum} totalSteps={totalSteps}>
      <div style={{ position:'relative' }}>
        <input ref={inputRef} className="text-input" value={search}
          placeholder={placeholder||'Type to search…'}
          onChange={e => { setSearch(e.target.value); setOpen(true); onChange(''); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Enter' && filtered.length === 1) select(filtered[0]);
            if (e.key === 'Escape') setOpen(false);
          }}
        />
        {open && displayList.length > 0 && (
          <div className="dropdown-list">
            {displayList.map(opt => (
              <button key={opt} className={`dropdown-item ${opt === value ? 'selected' : ''}`}
                onClick={() => select(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </FieldLayout>
  );
}

function CardSelectStep({ label, sublabel, options, value, onChange, onNext,
  stepNum, totalSteps }) {
  const select = (opt) => {
    onChange(opt);
    setTimeout(() => onNext(), 350);
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

function MidwayScreen({ comparisons, onNext }) {
  const results = computeAHP(comparisons);
  const { weights, ranked } = results;

  const [animate, setAnimate] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setAnimate(true), 150); }, []);

  const remaining = PAIRS.length - Object.keys(comparisons).length;
  const maxWeight = Math.max(...weights);

  return (
    <div className="midway-screen">
      <div className="midway-inner">

        {/* Left — heading + cta */}
        <div className="midway-left">
          <span className="step-counter" style={{ marginBottom:'0.75rem' }}>Halfway there</span>
          <h2 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:700,
            color:'var(--green-900)', lineHeight:1.25, marginBottom:'0.75rem' }}>
            A snapshot of your priorities
          </h2>
          <p style={{ fontSize:'0.9rem', color:'var(--gray-500)', lineHeight:1.65,
            marginBottom:'2rem' }}>
            These weights will shift and sharpen with the remaining {remaining} comparisons.
          </p>
          <button className="btn-primary" onClick={onNext}
            style={{ fontSize:'1rem', padding:'0.9rem 2rem' }}>
            Keep going →
          </button>
        </div>

        {/* Right — bar chart */}
        <div className="midway-right">
          {ranked.map(({ index, weight }, i) => {
            const cat = CATEGORIES[index];
            const pct = maxWeight > 0 ? (weight / maxWeight) * 100 : 100 / CATEGORIES.length;
            const delay = `${0.05 + i * 0.08}s`;
            return (
              <div key={cat.id} className="midway-bar-row"
                style={{ animation: animate ? `fadeSlideIn 0.4s ease-out ${delay} both` : 'none' }}>
                <div className="midway-bar-meta">
                  <div className="midway-bar-dot" style={{ background: cat.color }} />
                  <span className="midway-bar-name">{cat.name}</span>
                  <span className="midway-bar-pct">{Math.round(weight * 100)}%</span>
                </div>
                <div className="midway-bar-track">
                  <div className="midway-bar-fill" style={{
                    background: cat.color,
                    opacity: 0.7,
                    width: animate ? `${pct}%` : '0%',
                    transitionDelay: delay,
                  }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
