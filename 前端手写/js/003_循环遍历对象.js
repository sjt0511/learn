/**
 * 循环遍历对象
 */
const funcs = {
    func_for (obj) {
        const keys = Object.keys(obj)
        const index = -1
        const len = keys.length
        while (++index < len) {
            console.log(keys[index], obj[keys[index]])
            // 操作每一项
        }
    }
}