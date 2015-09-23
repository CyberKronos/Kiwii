var SCOPE_DIGEST_CYCLE_RATE = 100;
var digestTimer;

var kiwiiTest = {
  ASYNC_TIMEOUT: 10000,
  SCOPE_DIGEST_CYCLE_RATE: SCOPE_DIGEST_CYCLE_RATE,
  simulateDigestCycle: function (rootScope) {
    if (digestTimer) clearInterval(digestTimer);
    setInterval(rootScope.$digest, SCOPE_DIGEST_CYCLE_RATE);
  }
};