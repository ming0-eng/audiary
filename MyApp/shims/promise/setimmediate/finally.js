'use strict';

if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
  Promise.prototype.finally = function finallyPolyfill(onFinally) {
    const P = this.constructor || Promise;
    return this.then(
      value => P.resolve(onFinally && onFinally()).then(() => value),
      reason => P.resolve(onFinally && onFinally()).then(() => {
        throw reason;
      }),
    );
  };
}
