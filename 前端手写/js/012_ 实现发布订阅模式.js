/**
 * 发布订阅模式
 * 一种对象间一对多的依赖关系，但一个对象的状态发生改变时，所依赖它的对象都将得到状态改变的通知
 */

// 创建一个对象(缓存列表)
// on 用来把回调函数fn都加到缓存列表中
// emit 根据key值去执行对应缓存列表中的函数
// off 可以根据key值取消订阅
// once 单次监听器，单次监听器最多只触发一次，触发后立即解除监听器

class EventEmitter {
  constuctor () {
    // 事件对象，存放订阅的名字和事件
    this._events = {}
  }

  // 订阅某事件 - 把回调函数加入该事件的回调函数列表
  on (eventName, callback) {
    if (!this._events) {
      this._events = {}
    }
    this._events[eventName] = [...this._events[eventName], callback]
  }
  // 关闭某事件订阅
  off (eventName) {
    
  }
  // 触发事件
  emit () {}
  // 单次监听
  once () {}
}