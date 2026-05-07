function ResultsScreen({ comparisons, formData }) {
  const results = computeAHP(comparisons);
  const { weights, CR, ranked, allEqual } = results;
  const [animate, setAnimate] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setAnimate(true), 300);

    const SAATY = [9,7,5,3,1,3,5,7,9];
    const pairResults = PAIRS.map(([i, j], idx) => {
      const v = comparisons[idx] ?? 0;
      return {
        categoryA: CATEGORIES[i].name,
        categoryB: CATEGORIES[j].name,
        preferred: v < 0 ? CATEGORIES[i].name : v > 0 ? CATEGORIES[j].name : "Equal",
        saatyValue: SAATY[v + 4],
      };
    });
    const weightMap = {};
    CATEGORIES.forEach((cat, i) => {
      weightMap[cat.name] = Math.round(results.weights[i] * 10000) / 10000;
    });
    fetch('/api/response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        respondent: formData,
        comparisons: pairResults,
        derivedWeights: weightMap,
        consistencyRatio: Math.round(results.CR * 10000) / 10000,
        lambdaMax: Math.round(results.lambdaMax * 10000) / 10000,
      }),
    }).catch(() => {});
  }, []);

  const highest = ranked[0];
  const lowest = ranked[ranked.length - 1];
  const ratio = lowest.weight > 0.001 ? (highest.weight / lowest.weight).toFixed(1) : '∞';

  let crColor, crBg, crLabel, crMessage, crTier;
  if (allEqual) {
    crTier = 'neutral'; crColor = '#6B7280'; crBg = 'var(--gray-50)';
    crLabel = 'All categories rated equal';
    crMessage = "You indicated that every category is equally important. The weights are uniform — no single dimension stands out in your assessment.";
  } else if (CR < 0.05) {
    crTier = 'excellent'; crColor = '#059669'; crBg = '#F0FDF4';
    crLabel = 'Highly consistent';
    crMessage = "Your preferences form a very clear, logical pattern. Each comparison aligns well with every other — your priorities are sharply defined.";
  } else if (CR < 0.10) {
    crTier = 'good'; crColor = '#059669'; crBg = '#F0FDF4';
    crLabel = 'Consistent';
    crMessage = "Your judgments are logically sound. Minor variations between comparisons are normal and expected — your overall priorities come through clearly.";
  } else if (CR < 0.20) {
    crTier = 'caution'; crColor = '#D97706'; crBg = '#FFFBEB';
    crLabel = 'Some inconsistency detected';
    crMessage = "A few of your comparisons may conflict with each other — for instance, ranking A over B and B over C but then C over A. The weights are still usable but interpret them with some caution.";
  } else if (CR < 0.50) {
    crTier = 'warning'; crColor = '#DC2626'; crBg = '#FEF2F2';
    crLabel = 'Significant inconsistency';
    crMessage = "Your responses contain enough contradictions that the derived weights may not accurately reflect your true priorities. This sometimes happens when the comparisons feel abstract or time pressure leads to quick answers.";
  } else {
    crTier = 'critical'; crColor = '#DC2626'; crBg = '#FEF2F2';
    crLabel = 'Responses not meaningful';
    crMessage = "The responses don't form a coherent pattern — they appear closer to random than to a consistent set of priorities. The computed weights should not be relied upon. This can happen when the task feels unclear or answers are given without deliberation.";
  }

  const isUsable = CR < 0.20 && !allEqual;

  return (
    <div className="results-screen">
      <div className="results-inner">
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <img src="logo.png" alt="SmarterDharma" style={{ height:32, marginBottom:'1rem', opacity:0.8 }} />
          <h2 style={{ fontSize:'clamp(1.4rem,3.5vw,2rem)', fontWeight:700,
            color:'var(--green-900)', lineHeight:1.25, marginBottom:'0.5rem' }}>
            Your Sustainability Profile
          </h2>
          <p style={{ fontSize:'clamp(0.9rem,2vw,1.05rem)', color:'var(--gray-500)', lineHeight:1.5 }}>
            Here's how you weighted the six sustainability dimensions.
          </p>
        </div>

        <div className="results-chart">
          {ranked.map((item, rank) => {
            const cat = CATEGORIES[item.index];
            const pct = (item.weight * 100).toFixed(1);
            const maxW = ranked[0].weight;
            const barW = maxW > 0 ? (item.weight / maxW) * 100 : 0;
            return (
              <div key={cat.id} className="rbar-row"
                style={{ animationDelay: `${rank * 100 + 300}ms` }}>
                <div className="rbar-meta">
                  <div className="rbar-dot" style={{ background: cat.color }} />
                  <span className="rbar-name">{cat.name}</span>
                  <span className="rbar-pct">{pct}%</span>
                </div>
                <div className="rbar-track">
                  <div className="rbar-fill" style={{
                    width: animate ? `${barW}%` : '0%',
                    background: cat.color,
                    transitionDelay: `${rank * 100 + 300}ms`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {!allEqual && isUsable && (
          <div className="results-insight">
            <div className="results-insight-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--green-800)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p>
              You weighted <strong style={{ color: CATEGORIES[highest.index].color }}>
              {CATEGORIES[highest.index].name}</strong> highest at <strong>{(highest.weight * 100).toFixed(1)}%</strong>{' '}
              — that's <strong>{ratio}×</strong> the weight of{' '}
              <strong style={{ color: CATEGORIES[lowest.index].color }}>
              {CATEGORIES[lowest.index].name}</strong> ({(lowest.weight * 100).toFixed(1)}%).
            </p>
          </div>
        )}

        <div className="results-cr" style={{ '--cr-color': crColor, background: crBg }}>
          <div className="results-cr-head">
            <div className="results-cr-badge" style={{ background: crColor }}>
              {crTier === 'excellent' || crTier === 'good' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : crTier === 'neutral' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="8" x2="12" y2="13" /><circle cx="12" cy="17" r="0.5" fill="#fff" /></svg>
              )}
            </div>
            <div>
              <span className="results-cr-label" style={{ color: crColor }}>{crLabel}</span>
              {!allEqual && (
                <span className="results-cr-val">Consistency Ratio = {CR.toFixed(3)}</span>
              )}
            </div>
          </div>
          <p className="results-cr-msg">{crMessage}</p>
          {!allEqual && CR >= 0.10 && (
            <p className="results-cr-note">
              A Consistency Ratio below 0.10 is considered acceptable in AHP methodology.
              Yours is {CR.toFixed(2)}, which is above this threshold.
            </p>
          )}
        </div>

        <p style={{ fontSize:'0.78rem', color:'var(--gray-400)', textAlign:'center',
          marginTop:'2rem', maxWidth:420, marginInline:'auto', lineHeight:1.6 }}>
          Thank you for contributing to the Indian Sustainable Building Index.
          Your input helps build a more transparent sustainability scoring system
          for Indian residential real estate.
        </p>
      </div>
    </div>
  );
}
