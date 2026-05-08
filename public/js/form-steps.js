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

function TextInputStep({ label, sublabel, value, onChange, onNext, placeholder, type,
  optional, stepNum, totalSteps }) {
  const inputRef = React.useRef(null);
  const [touched, setTouched] = React.useState(false);
  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400); }, []);

  const isEmail = type === 'email';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const canProceed = optional ? true : (isEmail ? validEmail : value.trim().length > 0);
  const showError = isEmail && touched && value.trim().length > 0 && !validEmail;

  const handleKey = (e) => { if (e.key === 'Enter' && canProceed) onNext(); };

  return (
    <FieldLayout label={label} sublabel={sublabel} stepNum={stepNum} totalSteps={totalSteps}
      hint={optional ? "Optional — press Enter or tap Continue to skip" : "Press Enter ↵ to continue"}>
      <input ref={inputRef} type={type||'text'} className="text-input" value={value}
        onChange={e => { onChange(e.target.value); setTouched(true); }}
        onKeyDown={handleKey} placeholder={placeholder||''}
        style={showError ? { borderColor:'#DC2626' } : {}} />
      {showError && (
        <p style={{ color:'#DC2626', fontSize:'0.8rem', marginTop:'0.4rem' }}>
          Please enter a valid email address.
        </p>
      )}
      <button className="btn-continue" onClick={onNext} disabled={!canProceed}
        style={{ marginTop:'1.25rem' }}>
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

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  );

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
        {open && filtered.length > 0 && (
          <div className="dropdown-list">
            {filtered.map(opt => (
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
        <div style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', color:'var(--gray-700)', lineHeight:1.7 }}>
          {isCitizen ? (
            <>
              <p style={{ marginBottom:'1rem' }}>
                You'll be shown pairs of sustainability categories — like
                <strong> Energy & Climate</strong> versus <strong>Water Management</strong>.
              </p>
              <p style={{ marginBottom:'1rem' }}>
                For each pair, think about a home you would live in year-round, across all seasons.
                Consider which aspect would matter more to your everyday comfort, health, and long-term
                well-being — not just what feels most urgent right now.
              </p>
              <p>
                Pick which category matters more to you, then indicate how much more. There are no right
                or wrong answers — we value your genuine perspective.
              </p>
            </>
          ) : (
            <>
              <p style={{ marginBottom:'1rem' }}>
                You'll be shown pairs of sustainability categories — like
                <strong> Energy & Climate</strong> versus <strong>Water Management</strong>.
              </p>
              <p style={{ marginBottom:'1rem' }}>
                Drawing on your professional experience across varied projects, climates, and site
                conditions in India, consider which category of information matters most to you
                when deciding how sustainable a residential project truly is.
              </p>
              <p>
                Pick which category you consider more important, then indicate how much more.
                There are 15 comparisons — it takes about 3 minutes.
              </p>
            </>
          )}
        </div>
        <button className="btn-primary" onClick={onNext}
          style={{ marginTop:'2rem', fontSize:'1.05rem', padding:'0.9rem 2.5rem' }}>
          Start comparisons
        </button>
      </div>
    </div>
  );
}
