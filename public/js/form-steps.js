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
        Let's Begin
      </button>
      <p style={{ fontSize:'0.8rem', color:'var(--gray-400)', marginTop:'1.5rem', maxWidth:400 }}>
        Your responses are confidential and used solely for academic research.
      </p>
    </div>
  );
}

function FieldLayout({ label, sublabel, hint, children }) {
  return (
    <div className="field-layout">
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

function DemoSlider() {
  const catA = { name: 'Public Transport', shortDesc: 'Buses, metro & shared rides', color: '#16a34a' };
  const catB = { name: 'Private Vehicle',  shortDesc: 'Cars, bikes & personal transport', color: '#7c3aed' };
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const [val, setVal]           = React.useState(0);
  const valRef = React.useRef(0);
  React.useEffect(() => { valRef.current = val; }, [val]);

  const snap   = [-4,-3,-2,-1,0,1,2,3,4];
  const saaty  = [9,7,5,3,1,3,5,7,9];
  const ticks  = [32,26,20,14,8,14,20,26,32];
  const pct    = (p) => ((p + 4) / 8) * 100;

  const hit = (clientX) => {
    if (!trackRef.current) return;
    const r = trackRef.current.getBoundingClientRect();
    const raw = (Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)) / 100) * 8 - 4;
    setVal(snap.reduce((a, b) => Math.abs(raw - a) < Math.abs(raw - b) ? a : b));
  };

  const startDrag = (e) => { e.preventDefault(); setDragging(true); hit(e.touches ? e.touches[0].clientX : e.clientX); };
  const startRef  = React.useRef(startDrag);
  React.useEffect(() => { startRef.current = startDrag; });
  React.useEffect(() => {
    const el = trackRef.current; if (!el) return;
    const h  = (e) => startRef.current(e);
    el.addEventListener('touchstart', h, { passive: false });
    return () => el.removeEventListener('touchstart', h);
  }, []);
  React.useEffect(() => {
    if (!dragging) return;
    const mv = (e) => hit(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => setDragging(false);
    window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', mv, { passive: true }); window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', mv); window.removeEventListener('touchend', up);
    };
  }, [dragging]);

  const idx   = snap.indexOf(val);
  const tPct  = pct(val);
  const left  = val < 0;
  const color = val === 0 ? 'var(--green-500)' : (left ? catA.color : catB.color);

  return (
    <div style={{ width:'100%' }}>
      <div className="slider-cats">
        <div style={{ display:'flex', alignItems:'center', gap:6, flex:'1 1 0' }}>
          <div style={{ width:9, height:9, borderRadius:'50%', background:catA.color, flexShrink:0 }} />
          <span style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--gray-900)' }}>{catA.shortDesc}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, flex:'1 1 0', flexDirection:'row-reverse', textAlign:'right' }}>
          <div style={{ width:9, height:9, borderRadius:'50%', background:catB.color, flexShrink:0 }} />
          <span style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--gray-900)' }}>{catB.shortDesc}</span>
        </div>
      </div>
      <div className="slider-track-wrap" ref={trackRef} onMouseDown={startDrag}>
        <div className="slider-track">
          <div className="slider-fill" style={{
            left: val <= 0 ? `${tPct}%` : '50%',
            width: `${Math.abs(tPct - 50)}%`,
            background: color, opacity: 0.25,
          }} />
          {snap.map((p, i) => (
            <div key={p} className="slider-tick" style={{ left:`${pct(p)}%` }}>
              <div className="slider-tick-mark" style={{
                height:`${ticks[i]}px`, width: p===0 ? '3px':'2px',
                background: p===0 ? 'var(--gray-400)':'var(--gray-300)',
              }} />
              <span className="slider-tick-label">{saaty[i]}</span>
            </div>
          ))}
          <div className={`slider-thumb nudge${dragging ? ' active':''}`}
            style={{ left:`${tPct}%`, background:color }}>
            <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#fff' }}>{saaty[idx]}</span>
          </div>
        </div>
      </div>
      <div className="slider-direction">
        <span style={{ color:catA.color, fontSize:'0.75rem', fontWeight:500 }}>← {catA.name.split(' ')[0]}</span>
        <span style={{ color:catB.color, fontSize:'0.75rem', fontWeight:500 }}>{catB.name.split(' ')[0]} →</span>
      </div>
      <div className="slider-result" style={{ color: val===0 ? 'var(--gray-500)' : color }}>
        {val === 0
          ? 'Both are equally important'
          : <span><strong>{left ? catA.name : catB.name}</strong>{' is '}<strong style={{ fontSize:'1.05em' }}>~{saaty[idx]}×</strong>{' more important'}</span>}
      </div>
    </div>
  );
}

function ExplanationScreen({ relationship, onNext }) {
  const isCitizen = RELATIONSHIP_OPTIONS.find(r => r.label === relationship)?.citizen ?? true;

  return (
    <div className="field-layout" style={{ textAlign:'left' }}>
      <div style={{ background:'var(--green-50)', borderRadius:16, padding:'clamp(1.5rem,4vw,2.5rem)',
        maxWidth:600, width:'100%', border:'1px solid var(--green-100)' }}>

        <h2 style={{ fontSize:'clamp(1.3rem,3vw,1.75rem)', fontWeight:700, color:'var(--green-900)',
          marginBottom:'1.25rem', lineHeight:1.3 }}>
          How the next section works
        </h2>

        <p style={{ fontSize:'clamp(0.95rem,2vw,1.05rem)', color:'var(--gray-700)', lineHeight:1.7,
          marginBottom:'1.25rem' }}>
          {isCitizen
            ? <>
                <strong>Tell us what you care about.</strong> This helps us study priorities for greener homes and cities.
              </>
            : <>
                Compare sustainability categories side by side. From your professional experience, pick which matters more for a truly sustainable project.
              </>}
        </p>

        <div style={{ background:'#fff', border:'1px solid var(--green-100)', borderRadius:12,
          padding:'1.25rem 1rem 1rem', marginBottom:'1rem' }}>
          <p style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--gray-500)',
            textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.75rem' }}>
            Try it
          </p>
          <DemoSlider />
          <p style={{ fontSize:'0.82rem', color:'var(--gray-500)', marginTop:'1rem', marginBottom:0, lineHeight:1.6 }}>
            <strong style={{ color:'var(--gray-700)' }}>Middle is perfectly valid</strong> — it means both matter equally.
            Drag further only when you <strong style={{ color:'var(--gray-700)' }}>genuinely feel</strong> one outweighs the other.
          </p>
        </div>

        <button className="btn-primary" onClick={onNext}
          style={{ marginTop:'2rem', fontSize:'1.05rem', padding:'0.9rem 2.5rem' }}>
          Start
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
