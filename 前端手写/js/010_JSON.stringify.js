// JSON.stringify(value[, replacer [, space]])
// 参考 002_深拷贝里的例子
// 单独转化时，undefined、函数、symbol--undefined；对象里被忽略；数组里''
// 需要递归
const _010_JSON_stringify = {
    stringify (obj, map = new WeakMap()) {
        const type = typeof obj
        switch (type) {
            case 'undefined':
            case 'function':
            case 'symbol': // 单独转化时为undefined
                return undefined
            case 'number': // number转化
                if (isNaN(obj)||!isFinite(obj)) { // 如果非数字或无穷大就是 'null'
                    return 'null'
                } else {
                    return obj.valueOf() // 否则返回原始值
                }
            case 'bigint': // bigint会报错
                throw new TypeError('Do not know how to serialize a BigInt')
            case 'boolean': // 返回原始值
                return obj.valueOf()
            case 'string':
                return `"${obj.valueOf()}"`  
            case 'object':
                if (obj.toJSON) { // 对象有 toJSON 就先用 toJSON 转化成 b, 再用 b 去序列化
                    obj = obj.toJSON()
                    return this.stringify(obj, map)
                } else {
                    if (map.get(obj)) { // 循环引用要报错 即 a.target = a 这种
                        throw new TypeError('Converting circular structure to JSON')
                    }
                    map.set(obj, true)

                    const objType = Object.prototype.toString.call(obj)
                    const keys = Object.keys(obj) // 所有可枚举的key
                    const values = Object.values(obj) //所有可枚举的value
                    if (objType === '[object Array]') { // 数组
                        const arr = []
                        for (let i = 0; i < keys.length; i++) {
                            // 数组里undefined、function、symbol都转为null
                            if (/undefined|function|symbol/.test(typeof values[i])) {
                                arr.push(null)
                            } else {
                                // 递归得到数组里成员的JSON放入数组
                                arr.push(`${this.stringify(values[i], map)}`)
                            }
                        }
                        return `[${arr.join(',')}]`
                    } else { // 对象以及其他特殊对象Map/Set等--只转化可枚举的属性
                        const arr = []
                        for (let i = 0; i < keys.length; i++) {
                            // 对象里undefined、function、symbol都直接忽略
                            if (/undefined|function|symbol/.test(typeof values[i])) {
                            } else {
                                // 递归得到对象里属性的JSON，组成 '"key":JSON串' 这种形式放入数组
                                arr.push(`"${keys[i]}":${this.stringify(values[i], map)}`)
                            }
                        }
                        return `{${arr.join(',')}}`
                    }
                }
            
        }
    },
    parse (str) {
        return (new Function(`return ${str}`))()
    },
    init () {
        const a = {
            name: '测试stringify',
            bool: false,
            num: 10,
            numInf: 1/0,
            fn() {console.log(123)},
            key: Symbol('key'),
            undef: undefined,
            obj: {
                time: new Date(),
                arr: ['你好', { tip: '我是对象' }, [1, 2, 3]],
                map: new Map([['aaa', { name: 'aaa', value: 1 }]]),
                set: new Set([1,2,3,4]),
                err: new TypeError('这是一个error'),
                regexp: new RegExp('ab+c', 'i'),
            }
        }
        const my = this.stringify(a)
        const origin = JSON.stringify(a)
        console.log(a, 'my===JSON???',my === origin)
        console.log('my=', my)
        console.log('JSON=',origin)
        console.log('JSON.parse(my)', JSON.parse(my))
        console.log('myParse', this.parse(my))
    }
}