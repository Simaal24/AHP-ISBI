function CatCard({ cat, side, small }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: small ? 8 : 10 }}>
      <div style={{ width: small ? 10 : 14, height: small ? 10 : 14, borderRadius:'50%',
        background: cat.color, flexShrink:0, opacity:0.85 }} />
      <div>
        <div style={{ fontWeight:600, fontSize: small ? '0.85rem' : 'clamp(0.95rem,2vw,1.1rem)',
          color:'var(--gray-900)', lineHeight:1.3 }}>{cat.name}</div>
        {!small && <div style={{ fontSize:'0.8rem', color:'var(--gray-500)', lineHeight:1.4,
          marginTop:2 }}>{cat.desc}</div>}
      </div>
    </div>
  );
}

function ComparisonHeader({ catA, catB, pairIndex, totalPairs }) {
  return (
    <div style={{ marginBottom:'1.5rem', width:'100%' }}>
      <span className="step-counter" style={{ marginBottom:8, display:'block' }}>
        Comparison {pairIndex + 1} of {totalPairs}
      </span>
      <h2 style={{ fontSize:'clamp(1.1rem,2.8vw,1.4rem)', fontWeight:600, color:'var(--gray-800)',
        lineHeight:1.4, marginBottom:0 }}>
        Which is more important when evaluating sustainability in Indian residential real estate?
      </h2>
    </div>
  );
}

function BipolarScale({ catA, catB, pairIndex, totalPairs, value, onChange }) {
  const positions = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const saaty = [9, 7, 5, 3, 1, 3, 5, 7, 9];
  const labels = ["Extreme","V. Strong","Strong","Moderate","Equal","Moderate","Strong","V. Strong","Extreme"];

  return (
    <div className="field-layout">
      <ComparisonHeader catA={catA} catB={catB} pairIndex={pairIndex} totalPairs={totalPairs} />
      <div className="bipolar-container">
        <div className="bipolar-cats">
          <CatCard cat={catA} side="left" />
          <div style={{ fontSize:'0.85rem', color:'var(--gray-400)', fontWeight:500 }}>vs</div>
          <CatCard cat={catB} side="right" />
        </div>

        <div className="bipolar-direction">
          <span style={{ color: catA.color, fontWeight:500, fontSize:'0.75rem' }}>← {catA.name.split(' ')[0]}</span>
          <span style={{ color: catB.color, fontWeight:500, fontSize:'0.75rem' }}>{catB.name.split(' ')[0]} →</span>
        </div>

        <div className="bipolar-scale">
          {positions.map((pos, i) => {
            const isCenter = pos === 0;
            const isLeft = pos < 0;
            const isSelected = value === pos;
            const accentColor = isCenter ? 'var(--green-600)' : (isLeft ? catA.color : catB.color);

            return (
              <button key={pos} className={`bipolar-btn ${isSelected ? 'selected' : ''} ${isCenter ? 'center' : ''}`}
                style={{
                  '--accent': accentColor,
                  background: isSelected ? accentColor : 'var(--gray-50)',
                  color: isSelected ? '#fff' : 'var(--gray-700)',
                  borderColor: isSelected ? accentColor : 'var(--gray-200)',
                }}
                onClick={() => onChange(pos)}>
                <span className="bipolar-num">{saaty[i]}</span>
                <span className="bipolar-label">{labels[i]}</span>
              </button>
            );
          })}
        </div>

        {value !== null && (
          <div className="bipolar-result" style={{ opacity:1 }}>
            {value === 0 ? "Both are equally important" :
              value < 0
                ? `${catA.name} is ${labels[positions.indexOf(value)].toLowerCase()} more important`
                : `${catB.name} is ${labels[positions.indexOf(value)].toLowerCase()} more important`}
          </div>
        )}
      </div>
    </div>
  );
}

function TwoStepScale({ catA, catB, pairIndex, totalPairs, value, onChange }) {
  const [phase, setPhase] = React.useState('direction');
  const [direction, setDirection] = React.useState(null);
  const [animClass, setAnimClass] = React.useState('');

  React.useEffect(() => {
    setPhase('direction');
    setDirection(null);
    setAnimClass('');
  }, [catA.id, catB.id]);

  const chooseDirection = (dir) => {
    if (dir === 0) {
      onChange(0);
      return;
    }
    setDirection(dir);
    setAnimClass('phase-exit');
    setTimeout(() => {
      setPhase('magnitude');
      setAnimClass('phase-enter');
      setTimeout(() => setAnimClass(''), 350);
    }, 250);
  };

  const chooseMagnitude = (mag) => {
    const posMap = { 3: 1, 5: 2, 7: 3, 9: 4 };
    const pos = posMap[mag] * direction;
    onChange(pos);
  };

  const goBackToDirection = () => {
    setAnimClass('phase-exit-back');
    setTimeout(() => {
      setPhase('direction');
      setDirection(null);
      setAnimClass('phase-enter-back');
      setTimeout(() => setAnimClass(''), 350);
    }, 250);
  };

  const preferredCat = direction === -1 ? catA : catB;

  return (
    <div className="field-layout">
      <ComparisonHeader catA={catA} catB={catB} pairIndex={pairIndex} totalPairs={totalPairs} />
      <div className={`twostep-container ${animClass}`}>
        {phase === 'direction' ? (
          <div className="twostep-cards">
            <button className="twostep-card" onClick={() => chooseDirection(-1)}
              style={{ '--card-accent': catA.color }}>
              <div className="twostep-card-dot" style={{ background: catA.color }} />
              <div className="twostep-card-name">{catA.name}</div>
              <div className="twostep-card-desc">{catA.desc}</div>
            </button>
            <button className="twostep-equal" onClick={() => chooseDirection(0)}>
              Equal importance
            </button>
            <button className="twostep-card" onClick={() => chooseDirection(1)}
              style={{ '--card-accent': catB.color }}>
              <div className="twostep-card-dot" style={{ background: catB.color }} />
              <div className="twostep-card-name">{catB.name}</div>
              <div className="twostep-card-desc">{catB.desc}</div>
            </button>
          </div>
        ) : (
          <div className="twostep-magnitude">
            <button className="twostep-back-link" onClick={goBackToDirection}>
              ← Change selection
            </button>
            <p className="twostep-mag-label">
              How much more important is <strong style={{ color: preferredCat.color }}>{preferredCat.name}</strong>?
            </p>
            <div className="twostep-mag-list">
              {[3,5,7,9].map(mag => (
                <button key={mag} className="twostep-mag-btn" onClick={() => chooseMagnitude(mag)}
                  style={{ '--card-accent': preferredCat.color }}>
                  <span className="twostep-mag-num">{mag}</span>
                  <span className="twostep-mag-text">{INTENSITY_LABELS[mag].long}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GradientSlider({ catA, catB, pairIndex, totalPairs, value, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value ?? 0);

  React.useEffect(() => { setLocalVal(value ?? 0); }, [catA.id, catB.id, value]);

  const posToPercent = (p) => ((p + 4) / 8) * 100;
  const snapPositions = [-4,-3,-2,-1,0,1,2,3,4];
  const saaty = [9,7,5,3,1,3,5,7,9];
  const labels = ["Extreme","V. Strong","Strong","Moderate","Equal","Moderate","Strong","V. Strong","Extreme"];

  const handleInteraction = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const raw = (pct / 100) * 8 - 4;
    const snapped = snapPositions.reduce((a, b) => Math.abs(raw - a) < Math.abs(raw - b) ? a : b);
    setLocalVal(snapped);
  };

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    handleInteraction(clientX);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      handleInteraction(clientX);
    };
    const onEnd = () => { setDragging(false); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [dragging, localVal]);

  const currentIdx = snapPositions.indexOf(localVal);
  const thumbPct = posToPercent(localVal);
  const isLeft = localVal < 0;
  const gradientColor = localVal === 0 ? 'var(--green-500)' : (isLeft ? catA.color : catB.color);

  return (
    <div className="field-layout">
      <ComparisonHeader catA={catA} catB={catB} pairIndex={pairIndex} totalPairs={totalPairs} />
      <div className="slider-container">
        <div className="slider-cats">
          <CatCard cat={catA} side="left" small />
          <CatCard cat={catB} side="right" small />
        </div>
        <div className="slider-track-wrap" ref={trackRef}
          onMouseDown={startDrag} onTouchStart={startDrag}>
          <div className="slider-track">
            <div className="slider-fill" style={{
              left: localVal <= 0 ? `${thumbPct}%` : '50%',
              width: `${Math.abs(thumbPct - 50)}%`,
              background: gradientColor,
              opacity: 0.25,
            }} />
            {snapPositions.map((p, i) => (
              <div key={p} className="slider-tick" style={{ left: `${posToPercent(p)}%` }}>
                <div className={`slider-tick-mark ${p === 0 ? 'center' : ''}`} />
                <span className="slider-tick-label">{saaty[i]}</span>
              </div>
            ))}
            <div className={`slider-thumb ${dragging ? 'active' : ''}`}
              style={{ left: `${thumbPct}%`, background: gradientColor }}>
              <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#fff' }}>
                {saaty[currentIdx]}
              </span>
            </div>
          </div>
        </div>
        <div className="slider-direction">
          <span style={{ color:catA.color, fontSize:'0.75rem', fontWeight:500 }}>← {catA.name.split(' & ')[0]}</span>
          <span style={{ color:catB.color, fontSize:'0.75rem', fontWeight:500 }}>{catB.name.split(' & ')[0]} →</span>
        </div>
        <div className="slider-result">
          {localVal === 0 ? "Both are equally important" :
            isLeft
              ? `${catA.name}: ${labels[currentIdx].toLowerCase()} importance`
              : `${catB.name}: ${labels[currentIdx].toLowerCase()} importance`}
        </div>
        <button className="btn-continue" onClick={() => onChange(localVal)}
          style={{ marginTop:'1.25rem', alignSelf:'center' }}>
          Confirm
        </button>
      </div>
    </div>
  );
}

function AHPComparison({ scaleStyle, catA, catB, pairIndex, totalPairs, value, onChange }) {
  switch (scaleStyle) {
    case 'twostep':
      return <TwoStepScale catA={catA} catB={catB} pairIndex={pairIndex}
        totalPairs={totalPairs} value={value} onChange={onChange} />;
    case 'slider':
      return <GradientSlider catA={catA} catB={catB} pairIndex={pairIndex}
        totalPairs={totalPairs} value={value} onChange={onChange} />;
    default:
      return <BipolarScale catA={catA} catB={catB} pairIndex={pairIndex}
        totalPairs={totalPairs} value={value} onChange={onChange} />;
  }
}
