function CatCard({ cat, side, small }) {
  const isRight = side === 'right';
  return (
    <div className="cat-card" style={{ display:'flex', alignItems:'center', gap: small ? 7 : 10,
      flexDirection: small && isRight ? 'row-reverse' : 'row',
      textAlign: small && isRight ? 'right' : 'left',
      flex: small ? '1 1 0' : 'unset', minWidth:0, position:'relative' }}>
      <div style={{ width: small ? 9 : 14, height: small ? 9 : 14, borderRadius:'50%',
        background: cat.color, flexShrink:0, opacity:0.85 }} />
      <div style={{ minWidth:0 }}>
        <div style={{ fontWeight:600, fontSize: small ? '0.85rem' : 'clamp(0.95rem,2vw,1.1rem)',
          color:'var(--gray-900)', lineHeight:1.3 }}>
          {cat.shortDesc || cat.name}
        </div>
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
        Which matters more?
      </h2>
    </div>
  );
}

function GradientSlider({ catA, catB, pairIndex, totalPairs, value, onChange, isCitizen }) {
  const trackRef = React.useRef(null);
  const sliderBodyRef = React.useRef(null);
  const prevPairIndexRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value ?? 0);
  const [confirmed, setConfirmed] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const localValRef = React.useRef(localVal);

React.useEffect(() => { localValRef.current = localVal; }, [localVal]);

  React.useEffect(() => {
    const el = sliderBodyRef.current;
    if (el && prevPairIndexRef.current !== null) {
      const animClass = pairIndex > prevPairIndexRef.current ? 'ahp-slide-fwd' : 'ahp-slide-back';
      el.classList.remove('ahp-slide-fwd', 'ahp-slide-back');
      void el.offsetWidth; // force reflow so animation restarts
      el.classList.add(animClass);
    }
    prevPairIndexRef.current = pairIndex;
    setLocalVal(value ?? 0);
    setConfirmed(false);
    setTouched(value != null);
  }, [catA.id, catB.id]);

  const posToPercent = (p) => ((p + 4) / 8) * 100;
  const snapPositions = [-4,-3,-2,-1,0,1,2,3,4];
  const saaty = [9,7,5,3,1,3,5,7,9];
  const labels = ["Extreme","V. Strong","Strong","Moderate","Equal","Moderate","Strong","V. Strong","Extreme"];
  // Tick heights grow from center outward — dramatic enough to read at a glance
  const tickHeights = [32,26,20,14,8,14,20,26,32];

  const handleInteraction = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const raw = (pct / 100) * 8 - 4;
    const snapped = snapPositions.reduce((a, b) => Math.abs(raw - a) < Math.abs(raw - b) ? a : b);
    setLocalVal(snapped);
    if (!touched) setTouched(true);
  };

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    handleInteraction(clientX);
  };

  const startDragRef = React.useRef(startDrag);
  React.useEffect(() => { startDragRef.current = startDrag; });
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handler = (e) => startDragRef.current(e);
    el.addEventListener('touchstart', handler, { passive: false });
    return () => el.removeEventListener('touchstart', handler);
  }, []);

  const confirmValue = (val) => {
    setConfirmed(true);
    setTimeout(() => onChange(val), 650);
  };

  const finishDrag = () => {
    setDragging(false);
    confirmValue(localValRef.current);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      handleInteraction(clientX);
    };
    const onEnd = () => { finishDrag(); };
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
      <div className="slider-container" ref={sliderBodyRef}>
        <div className="slider-cats">
          <CatCard cat={catA} side="left" small />
          <CatCard cat={catB} side="right" small />
        </div>
        <div className="slider-track-wrap" ref={trackRef}
          onMouseDown={startDrag}>
          <div className="slider-track">
            <div className="slider-fill" style={{
              left: localVal <= 0 ? `${thumbPct}%` : '50%',
              width: `${Math.abs(thumbPct - 50)}%`,
              background: gradientColor,
              opacity: 0.25,
            }} />
            {snapPositions.map((p, i) => (
              <div key={p} className="slider-tick" style={{ left: `${posToPercent(p)}%` }}>
                <div className="slider-tick-mark" style={{
                  height: `${tickHeights[i]}px`,
                  width: p === 0 ? '3px' : '2px',
                  background: p === 0 ? 'var(--gray-400)' : 'var(--gray-300)',
                }} />
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
        <div className="slider-result" style={{ color: localVal === 0 ? 'var(--gray-500)' : gradientColor }}>
          {confirmed ? (
            <span className="slider-confirmed">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ verticalAlign:'middle', marginRight:4 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Recorded
            </span>
          ) : localVal === 0
            ? "Both are equally important"
            : <span>
                <strong>{isLeft ? catA.name : catB.name}</strong>
                {' is '}
                <strong style={{ fontSize:'1.05em' }}>~{saaty[currentIdx]}×</strong>
                {' more important'}
              </span>}
        </div>
      </div>
    </div>
  );
}

function AHPComparison({ catA, catB, pairIndex, totalPairs, value, onChange, isCitizen }) {
  return <GradientSlider catA={catA} catB={catB} pairIndex={pairIndex}
    totalPairs={totalPairs} value={value} onChange={onChange} isCitizen={isCitizen} />;
}
