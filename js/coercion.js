// | *value*          | *2number* | *2string*         | *2boolean* |
// | FALSE            | 0         | "false"           | FALSE      |
// | TRUE             | 1         | "true"            | TRUE       |
// | 0                | 0         | "0"               | FALSE      |
// | 1                | 1         | "1"               | TRUE       |
// | "0"              | 0         | "0"               | TRUE       |
// | "1"              | 1         | "1"               | TRUE       |
// | NaN              | NaN       | "NaN"             | FALSE      |
// | Infinity         | Infinity  | "Infinity"        | TRUE       |
// | -Infinity        | -Infinity | "-Infinity"       | TRUE       |
// | ""               | 0         | ""                | FALSE      |
// | "20"             | 20        | "20"              | TRUE       |
// | "twenty"         | NaN       | "twenty"          | TRUE       |
// | [ ]              | 0         | ""                | TRUE       |
// | [20]             | 20        | "20"              | TRUE       |
// | [10,20]          | NaN       | "10,20"           | TRUE       |
// | ["twenty"]       | NaN       | "twenty"          | TRUE       |
// | ["ten","twenty"] | NaN       | "ten,twenty"      | TRUE       |
// | function(){}     | NaN       | "function(){}"    | TRUE       |
// | { }              | NaN       | "[object Object]" | TRUE       |
// | null             | 0         | "null"            | FALSE      |
// | undefined        | NaN       | "undefined"       | FALSE      |


var ToPrimitive = function (obj, preferredType) {
    var APIs = {
        typeOf: function (obj) {
            return Object.prototype.toString.call(obj).slice(8, -1);
        },
        isPrimitive: function (obj) {
            var _this = this,
                types = ['Null', 'Undefined', 'String', 'Boolean', 'Number'];
            return types.indexOf(_this.typeOf(obj)) !== -1;
        }
    };
    // 如果 obj 本身已经是原始对象，则直接返回
    if (APIs.isPrimitive(obj)) {
        return obj;
    }

    // 对于 Date 类型，会优先使用其 toString 方法；否则优先使用 valueOf 方法
    preferredType = (preferredType === 'String' || APIs.typeOf(obj) === 'Date') ? 'String' : 'Number';
    if (preferredType === 'Number') {
        if (APIs.isPrimitive(obj.valueOf())) {
            return obj.valueOf()
        };
        if (APIs.isPrimitive(obj.toString())) {
            return obj.toString()
        };
    } else {
        if (APIs.isPrimitive(obj.toString())) {
            return obj.toString()
        };
        if (APIs.isPrimitive(obj.valueOf())) {
            return obj.valueOf()
        };
    }
    throw new TypeError('TypeError');
};


function isReallyNaN(x) {
    // isNaN()不靠谱，利用NaN是唯一一个自己严格不等于自己来检查
    return x !== x;
}

// == , <, >, !=, ===, !==, >=, <= 原则就是先转数字原型
[] == ![] // true ... []->0, ![]->!true->false->0
NaN !== NaN // true ... 只要有NaN，等号的就是false， NaN === NaN

// true->1
1 == true // true 
2 == true // false
"2" == true // flase

// 两侧都是null/undefined，则是true，其余均false
null > 0 // false 
null < 0 // false
null == 0 // false
null >= 0 // true

// 加法
true + 1 // 2 ... true -> 1
undefined + 1 // NaN ... undefined->NaN, NaN + 1 = NaN

let obj = {};

{} + 1 // "1"，这里的 {} 被当成了代码块
{ 1 + 1 } + 1 // "1"

obj + 1 // "[object Object]1"
{} + {}; // Chrome 上显示 "[object Object][object Object]"，Firefox 显示 "NaN"

[] + {}; // "[object Object]"
[] + a // "[object Object]"
+ [] // 等价于 + "" => 0
{} + [] // "0"
a + [] // "[object Object]"

[2,3] + [1,2] // '2,31,2'
[2] + 1 // '21'
[2] + (-1) // "2-1"
[2,3] + 1 // 2,31

// 减法或其他操作，无法进行字符串连接，因此在错误的字符串格式下返回 NaN
[2] - 1 // 1
[2,3] - 1 // NaN
{} - 1 // -1

// 粗略的讲：比较符号（及-,/,*,%）更爱数字；加号更爱字符串
// 但不管怎样，obj都喜欢先valueOf，再toString