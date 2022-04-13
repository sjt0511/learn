/**
 * Promise 相关
 */
// 实现promise
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

/* 3 完整版 */
//  可以把 Promise 看成一个状态机。初始是 pending 状态，可以通过函数 resolve和 reject ，将状态转变为 resolved或者 rejected 状态，状态一旦改变就不能再次变化。
//  then 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例。因为 Promise 规范规定除了 pending 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 then 调用就失去意义了。
//  对于 then来说，本质上可以把它看成是 flatMap
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  // 用于保存 then 中的回调，只有当 promise
  // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED;
        _this.value = value;
        _this.resolvedCallbacks.forEach(cb => cb());
      }
    })
  };

  _this.reject = function (reason) {
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED;
        _this.value = reason;
        _this.rejectedCallbacks.forEach(cb => cb());
      }
    })
  }
  // 用于解决以下问题
  // new Promise(() => throw Error('error))
  try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2;
  // 规范 2.2.onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r};

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
      // 所以用了 setTimeout 包裹下
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function () {
        // 考虑到可能会有报错，所以使用 try/catch 包裹
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  // 规范 2.3.2
  // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function (value) {
        // 再次调用该函数是为了确认 x resolve 的
        // 参数是什么类型，如果是基本类型就再次 resolve
        // 把值传给下个 then
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  // 规范 2.3.3.3.3
  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false;
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === "function") {
        // 规范 2.3.3.3
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 规范 2.3.3.3.1
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        // 规范 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x);
  }
}

/* 1 简单版 */
// TODO:发现作为对象属性的方法不能作为构造函数
function MyPromise1 (constructor) {
    const self = this
    // 初始化一些状态信息
    self.status = 'pending' // 状态
    self.value = undefined // resolved的值
    self.reason = undefined // rejected的err
    // 定义resolve和reject函数：这两个函数用作改变status状态
    function resolve(value) {
        if (self.status === 'pending') {
            self.value = value
            self.status = 'resolved'
        }
    }
    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason
            self.status = 'rejected'
        }
    }
    // 捕获异常；这样promise就能.catch
    try {
        // 可能在这里reject
        constructor(resolve, reject)
    } catch (err) {
        reject(err)
    }
}
// 状态resolved就onFullfilled、状态rejected就onRejected
// 这里没做到返回一个Promise.then返回的仍应该是promise，而且要是全新的promise，因为promise状态一旦落定
MyPromise1.prototype.then = function (onFullfilled,onRejected) {
    const self = this
    if (self.status === 'resolved') {
        onFullfilled(self.value)
    } else {
        onRejected(self.reason)
    }
}

/* class版 */
 

const _011_promise = {
    init () {
    },
    init2 () {
        // Promise.resolve(param) 将传入的param变成一个Promise实例
        // 传参为一个 Promise, 则直接返回它。
        // 传参为一个 thenable 对象，返回的 Promise 会跟随这个对象，采用它的最终状态作为自己的状态。
        // 其他情况，直接返回以该值为成功状态的promise对象。
        Promise.resolve = (param) => {
            if (param instanceof Promise) return param
            return new Promise((resolve, reject)=> {
                if (param && param.then && typeof param.then === 'function') {
                    // param 状态变为成功会调用resolve，将新 Promise 的状态变为成功，反之亦然
                    param.then(resolve, reject)
                } else {
                    resolve(param) // 将Promise对象的状态由'pending'变为'resolved'
                }
            })
        }

        // Promise.rejected(reason)
        Promise.reject = function (reason) {
            return new Promise(reject => {
                reject(reason) // 将Promise对象的状态由'pending'变为'rejected'
            })
        }

        // Promise.prototype.finally() => 要支持链式调用，所以返回的还是一个Promise实例
        // 无论当前 Promise 是成功还是失败，调用finally之后都会执行 finally 中传入的函数，并且将值原封不动的往下传。
        Promise.prototype.finally = function (callback) {
            // 当.finally所在promise实例状态变为resolved是会调用 .then()
            this.then(value => { // promise实例resolve的值
                // 创建一个promise实例，调用callback，把then所在的promise的值原封不动返回
                return Promise.resolve(callback()).then(() => {
                    return value
                }) // 前一个回调函数完成以后，会将返回结果作为参数，传入后一个回调函数
            }).catch(err => {
                return Promise.resolve(callback()).then(() => {
                    throw err // 把异常抛出去
                })
            })
        }

        // 传入参数为一个空的可迭代对象，则直接进行resolve。
        // 如果参数中有一个promise失败，那么Promise.all返回的promise对象失败。
        // 在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组
        Promise.all = function (promises) {
            return new Promise((resolve, reject) => {
                let result = []
                const len = promises.length
                if (!len) {
                    resolve(result)
                } else {
                    let num = 0
                    for (let i = 0; i < len; i++) {
                        Promise.resolve(promises[i]).then(value => {
                            result[i] = value
                            num++
                            // 相当于所有的promise实例对象都resolved了这个.all才调用resolve回调改变自己的状态为resolved
                            if (num === len) resolve(result)
                        }).catch(err => {
                            reject(err)
                        })
                    }
                }
            })
        }

        Promise.allSettled = function (iterable) {
            // Promise 新建后立即执行
            // then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行
            return new Promise((resolve, reject) => {
                function addElementToResult(i, elem) {
                    result[i] = elem;
                    elementCount++;
                    if (elementCount === result.length) {
                      resolve(result);
                    }
                }
                let i = 0
                for (const promise of iterable) {
                    const currentIndex = i
                    Promise.resolve(promise).then(value => {
                        addElementToResult(currentIndex, {
                            status: 'fufilled',
                            value
                        })
                    }).catch(reason => {
                        addElementToResult(currentIndex, {
                            status: 'rejected',
                            reason
                        })
                    })
                    i++
                }
                if (i === 0) {
                    resolve([])
                    return
                }

                let elementCount = 0
                const result = new Array(i)
            })
        }

    },
}