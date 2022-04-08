// 模拟Object.create
// 创建一个新对象-->new，__proto__指向proto
const _008_Object_create = {
    myCreate (proto) {
        function Func () {}
        Func.prototype = proto
        return new Func()
    }
}