// 1 简单版 JSON序列化&反序列化
// 局限性
//   1.无法实现对函数 、RegExp, Date, Set, Map等特殊对象的克隆
//   2.会抛弃对象的constructor,所有的构造函数会指向Object
//   3.对象有循环引用,会报错
function clone1(obj) {
    // JSON.stringify
    return JSON.parse(JSON.stringify(obj))
}
function clone1_json_stringify() { // JSON序列化
    // 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中
    // 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化,调用 toJSON 方法后的返回值会被序列化
    JSON.stringify(new Date(2006, 0, 2, 15, 4, 5))
    //  '"2006-01-02T07:04:05.000Z"'  Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理

    JSON.stringify({});                        // '{}'
    JSON.stringify(true);                      // 'true'
    JSON.stringify("foo");                     // '"foo"'
    JSON.stringify([1, "false", false]);       // '[1,"false",false]'
    JSON.stringify({ x: 5, y: 6 });            // "{"x":5,"y":6}"

    JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);
    // '[1,"false",false]' 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值

    JSON.stringify({ x: undefined, y: Object, z: Symbol("") });
    // '{}' undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）
    JSON.stringify([undefined, Object, Symbol("")]);
    // '[null,null,null]' undefined、任意的函数以及 symbol 值，在序列化过程中被转换成 null（出现在数组中时）
    JSON.stringify(undefined)
    JSON.stringify(function () { })
    // undefined undefined    函数、undefined被单独转换时，会返回 undefined
    JSON.stringify(null)
    JSON.stringify(NaN)
    JSON.String(Infinity)
    // 'null' 'null' 'null'   NaN 和 Infinity 格式的数值及 null 都会被当做 null

    JSON.stringify({ [Symbol("foo")]: "foo" });
    // '{}' 所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们

    JSON.stringify({ [Symbol.for("foo")]: "foo" }, [Symbol.for("foo")]);
    // '{}' 所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们;
    // 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；
    // 如果该参数为 null 或者未提供，则对象所有的属性都会被序列化

    JSON.stringify(
        { [Symbol.for("foo")]: "foo" },
        function (k, v) {
            if (typeof k === "symbol") {
                return "a symbol";
            }
        }
    );
    // undefined replacer 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；

    JSON.stringify(
        Object.create(
            null,
            {
                x: { value: 'x', enumerable: false },
                y: { value: 'y', enumerable: true }
            }
        )
    );
    // "{"y":"y"}" 不可枚举的属性默认会被忽略
}
function clone1_json_parse() { // JSON反序列化,解析JSON字符串，构造由字符串描述的JavaScript值或对象
    JSON.parse('{}');              // {}
    JSON.parse('true');            // true
    JSON.parse('"foo"');           // "foo"
    JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
    JSON.parse('null');            // null
}

// 2 面试版
// 调用深拷贝方法，若属性为值类型，则直接返回；若属性为引用类型，则递归遍历
function clone2(obj) {
    // 如果是 值类型 或 null，则直接return
    // typeof => 'undefined'|'number'|'bigint'|'boolean'|'string'|'symbol'|'object'|'function'
    if (typeof obj !== 'object' || obj === null) {
        // 这里对于值类型、函数都直接进行了返回 
        return obj
    }

    // 定义结果对象
    // let copy = {}
    // if (obj.constructor === Array) {
    //     copy = []
    // }
    const copy = Array.isArray(obj) ? [] : {}

    // 遍历对象的key-- for in循环太慢了
    // for (let key in obj) {
    //     // 如果key是对象的自有属性
    //     if (obj.hasOwnProperty(key)) {
    //         // 递归调用深拷贝方法
    //         copy[key] = deepClone(obj[key])
    //     }
    // }
    const keys = Object.keys(obj)
    // 用while最快
    let index = -1
    const len = keys.length
    while (++index < len) {
        copy[keys[index]] = deepClone(obj[keys[index]])
    }
    // for of
    for (let key of keys) {
        copy[key] = deepClone(obj[key])
    }
    return copy
}

// 3 完整版
// 需要解决的问题：
// 1、循环引用：创建一个WeakMap。记录下已经拷贝过的对象，如果说已经拷贝过，那直接返回它行了--被弱引用的对象可以在任何时候被回收，而对于强引用来说，只要这个强引用还在，那么对象无法被回收
// 2、拷贝特殊对象：可遍历对象+不可遍历对象 Object.prototype.toString.call(obj)
//    可遍历对象: '[object Map]' '[object Set]' '[object Array]' '[object Object]' '[object Arguments]'
// 3、拷贝函数：只需要处理普通函数的情况，箭头函数直接返回它本身
const clone3 = {
    canTraverse: { // 可遍历的那些类型
        '[object Map]': true,
        '[object Set]': true,
        '[object Array]': true,
        '[object Object]': true,
        '[object Arguments]': true
    },
    tags: { // 类型
        map: '[object Map]',
        set: '[object Set]',
        boolean: '[object Boolean]',
        number: '[object Number]',
        string: '[object String]',
        symbol: '[object Symbol]',
        date: '[object Date]',
        error: '[object Error]',
        regexp: '[object RegExp]',
        function: '[object Function]'
    },
    isObject(obj) { // 判断是否是对象
        return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
    },
    handleRegExp(obj) { // TODO:处理正则
        const { source, flags } = obj
        return new target.constructor(source, flags)
    },
    // 只需要处理普通函数的情况，箭头函数直接返回它本身
    // 每个普通函数都是Function的实例
    // 箭头函数不是任何类的实例，每次调用都是不一样的引用
    handleFunction(func) { // TODO:处理函数
        // 箭头函数直接返回自身
        if (!func.prototype) return func;
        const bodyReg = /(?<={)(.|\n)+(?=})/m;
        const paramReg = /(?<=\().+(?=\)\s+{)/;
        const funcString = func.toString();
        // 分别匹配 函数参数 和 函数体
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (!body) return null;
        if (param) {
            const paramArr = param[0].split(',');
            return new Function(...paramArr, body[0]);
        } else {
            return new Function(body[0]);
        }
    },
    handleNotTraverse(obj, tag) {
        switch (tag) {
            // case this.tags.boolean:
            // case this.tags.number:
            // case this.tags.string:
            // case this.tags.error:
            // case this.tags.date:
            //     return new obj.constructor(obj)
            // case this.tags.symbol: // symbol不是用new创建的
            //     // TODO: '[Object symbol]'怎么处理
            //     return new Object(Symbol.prototype.valueOf.call(obj))
            case this.tags.boolean:
                return new Object(Boolean.prototype.valueOf.call(obj));
            case this.tags.number:
                return new Object(Number.prototype.valueOf.call(obj));
            case this.tags.string:
                return new Object(String.prototype.valueOf.call(obj));
            case this.tags.symbol:
                return new Object(Symbol.prototype.valueOf.call(obj));
            // case this.tags.error: 
            // case this.tags.date:
            //   return new obj.constructor(obj);
            case this.tags.regexp:
                return this.handleRegExp(obj);
            case this.tags.function:
                return this.handleFunction(obj);
            default:
                return new obj.constructor(obj);
        }
    },
    deepClone(obj, map = new WeakMap()) {
        // 值类型直接返回--包括Symbol
        if (!this.isObject(obj)) {
            return obj
        }

        const type = Object.prototype.toString.call(obj) // 对象具体的类型
        let copy = null // 最终副本

        // 不可遍历的对象
        if (!this.canTraverse[type]) {
            return this.handleNotTraverse(obj, type)
        }

        // 可遍历对象初始化--可以保证对象的原型不丢失
        copy = new obj.constructor()

        // 解决循环引用
        if (map.get(obj)) {
            return obj
        }
        map.set(obj, true)

        // 拷贝特殊对象--如果是可遍历的对象
        if (type === this.tags.map) { // Map
            obj.forEach((item, key) => {
                copy.set(this.deepClone(key, map), this.deepClone(item, map));
            })
        } else if (type === this.tags.set) { // Set
            obj.forEach(item => {
                copy.add(this.deepClone(item, map))
            })
        } else {
            // 对象、数组
            const keys = Object.keys(obj)
            for (let key of keys) {
                copy[key] = this.deepClone(obj[key], map)
            }
        }

        return copy
    }
}