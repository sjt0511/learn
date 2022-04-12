/**
 * Promise 相关
 */
const _011_promise = {
    init () {
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

    }
}