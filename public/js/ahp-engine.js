function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function computeAHP(comparisons) {
  var n = CATEGORIES.length;
  var RI_TABLE = { 1:0, 2:0, 3:0.58, 4:0.90, 5:1.12, 6:1.24, 7:1.32, 8:1.41, 9:1.45, 10:1.49 };
  var RI = RI_TABLE[n];
  var SAATY = [9, 7, 5, 3, 1, 3, 5, 7, 9];

  var matrix = [];
  for (var i = 0; i < n; i++) {
    matrix[i] = [];
    for (var j = 0; j < n; j++) matrix[i][j] = 1;
  }

  var answeredCount = 0;
  var allEqual = true;

  PAIRS.forEach(function(pair, pairIdx) {
    var pi = pair[0], pj = pair[1];
    var pos = comparisons[pairIdx];
    if (pos == null) return;
    answeredCount++;
    if (pos !== 0) allEqual = false;

    var saatyVal = SAATY[pos + 4];

    if (pos < 0) {
      matrix[pi][pj] = saatyVal;
      matrix[pj][pi] = 1 / saatyVal;
    } else if (pos > 0) {
      matrix[pi][pj] = 1 / saatyVal;
      matrix[pj][pi] = saatyVal;
    }
  });

  var colSums = [];
  for (var j = 0; j < n; j++) {
    colSums[j] = 0;
    for (var i = 0; i < n; i++) colSums[j] += matrix[i][j];
  }

  var norm = matrix.map(function(row) {
    return row.map(function(v, j) { return v / colSums[j]; });
  });
  var weights = norm.map(function(row) {
    return row.reduce(function(s, v) { return s + v; }, 0) / n;
  });

  var Aw = matrix.map(function(row) {
    return row.reduce(function(s, v, j) { return s + v * weights[j]; }, 0);
  });
  var lambdaMax = Aw.reduce(function(s, v, i) {
    return s + (weights[i] > 1e-10 ? v / weights[i] : n);
  }, 0) / n;

  var CI = (lambdaMax - n) / (n - 1);
  var CR = RI > 0 ? CI / RI : 0;

  var ranked = weights
    .map(function(w, i) { return { index: i, weight: w }; })
    .sort(function(a, b) { return b.weight - a.weight; });

  return { matrix: matrix, weights: weights, lambdaMax: lambdaMax, CI: CI, CR: CR, ranked: ranked, allEqual: allEqual, answeredCount: answeredCount };
}
