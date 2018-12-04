// es5 寄生组合继承 （分离组合继承） 最主流的方式
var Book = function (title) {
    Object.defineProperty(this, 'title', {
        writable: false,
        value: title
    });
};
Book.prototype.getTitle = function () {
    return this.title;
};

var EBook = function (link) {
    Object.defineProperty(this, 'link', {
        writable: false,
        value: link
    });
};
EBook.prototype = Object.create(Book.prototype, {
    download: {
        writable: false,
        value: function () {
            console.log('Start...');
        }
    }
});
// 一定要修正 constructor
EBook.prototype.constructor = EBook;

// testing
var jsorz = new EBook('mybook');
console.log(jsorz instanceof Book);
console.log(jsorz instanceof EBook);
console.log(jsorz.constructor === EBook);
console.log(jsorz.hasOwnProperty('getTitle') === false);
console.log(Object.getPrototypeOf(jsorz) === EBook.prototype);
console.log(Object.getPrototypeOf(jsorz).constructor === EBook);


// ------skr-------
// es6 新的关键字
class Book {
    constructor(props) {
        this._title = props.title;
    }
    get title() {
        return this._title;
    }
    static staticMethod() {}
    toString() {
        return `Book_${ this._title }`;
    }
}

class EBook extends Book {
    constructor(props) {
        super(props);
        this._link = props.link;
    }
    set link(val) {
        this._link = val;
    }
    toString() {
        return `Book_${ this._link }`;
    }
}

// es6 --> es5 
// class等关键字只是语法糖，实际还是会编译成es5的写法
var Book = function () {
    function Book(props) {
        _classCallCheck(this, Book);
        this._title = props.title;
    }
    _createClass(Book, [{
        key: "toString",
        // 省略...
    }, {
        key: "title",
        // 省略...
    }], [{
        key: "staticMethod",
        // 省略...
    }]);
    return Book;
}();

var EBook = function (_Book) {
    function EBook(props) {
        // 省略...
    }
    _inherits(EBook, _Book);
    _createClass(EBook, [{
        key: "toString",
        // 省略...
    }, {
        key: "link",
        // 省略...
    }]);
    return EBook;
}(Book);

//   es6继承的不足
//   不支持静态属性（除函数）。
//   class中不能定义私有变量和函数。class中定义的所有函数都会被放倒原型当中，都会被子类继承，而属性都会作为实例属性挂到this上。如果子类想定义一个私有的方法或定义一个private 变量，便不能直接在class花括号内定义，这真的很不方便！
//   总结一下，和es5相比，es6在语言层面上提供了面向对象的部分支持，虽然大多数时候只是一个语法糖，但使用起来更方便，语意化更强、更直观，同时也给javascript继承提供一个标准的方式。还有很重要的一点就是－es6支持原生对象继承。



// ------skr-------
// 多继承 考虑用interface的思路实现，检查继承类中是否所有函数都重写过
// D -> B&C -> A   (Diamond Problem)


// C -> A&B
const mixinClass = (base, ...mixins) => {
    const mixinProps = (target, source) => {
        Object.getOwnPropertyNames(source).forEach(prop => {
            if (/^constructor$/.test(prop)) {
                return;
            }
            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
        })
    };

    let Ctor;
    if (base && typeof base === 'function') {
        Ctor = class extends base {
            constructor(...props) {
                super(...props);
            }
        };
        mixins.forEach(source => {
            mixinProps(Ctor.prototype, source.prototype);
        });
    } else {
        Ctor = class {};
    }
    return Ctor;
};

class A {
    methodA() {}
}
class B {
    methodB() {}
}
class C extends mixinClass(A, B) {
    methodA() {
        console.log('methodA in C');
    }
    methodC() {}
}

let c = new C();
c instanceof C // true
c instanceof A // true
c instanceof B // false


// 模拟多继承
// C -> A&B ( A -> X&Y | B -> Y ) -> O
const mixinProps = (target, source) => {
    Object.getOwnPropertyNames(source).forEach(prop => {
        if (/^(?:constructor|isInstanceOf)$/.test(prop)) {
            return;
        }
        Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
    })
};

const mroMerge = (list) => {
    if (!list || !list.length) {
        return [];
    }
    for (let items of list) {
        let item = items[0];
        let valid = true;
        for (let items2 of list) {
            if (items2.indexOf(item) > 0) {
                valid = false;
                break;
            }
        }

        if (valid) {
            let nextList = [];
            for (let items3 of list) {
                let _index = items3.indexOf(item);
                if (_index > -1) {
                    items3.splice(_index, 1);
                }
                items3.length && nextList.push(items3);
            }
            return [item, ...mroMerge(nextList)];
        }
    }
    throw new Error('Unable to merge MRO');
};

const c3mro = (ctor, bases) => {
    if (!bases || !bases.length) {
        return [ctor];
    }
    let list = bases.map(b => b._meta.bases.slice());
    list = list.concat([bases]);
    let res = mroMerge(list);
    return [ctor, ...res];
};

const createClass = (parents, props) => {
    const isMulti = parents && Array.isArray(parents);
    const superCls = isMulti ? parents[0] : parents;
    const mixins = isMulti ? parents.slice(1) : [];

    const Ctor = function (...args) {
        // TODO: call each parent's constructor
        if (props.constructor) {
            props.constructor.apply(this, args);
        }
    };

    // save c3mro into _meta
    let bases = [superCls, ...mixins].filter(item => !!item);
    Ctor._meta = {
        bases: c3mro(Ctor, bases)
    };

    // inherit first parent through proto chain
    if (superCls && typeof superCls === 'function') {
        Ctor.prototype = Object.create(superCls.prototype);
        Ctor.prototype.constructor = Ctor;
    }

    // mix other parents into prototype according to [Method Resolution Order]
    // NOTE: Ctor._meta.bases[0] always stands for the Ctor itself
    if (Ctor._meta.bases.length > 1) {
        let providers = Ctor._meta.bases.slice(1).reverse();
        providers.forEach(provider => {
            // TODO: prototype of superCls is already inherited by __proto__ chain
            (provider !== superCls) && mixinProps(Ctor.prototype, provider.prototype);
        });
    }
    mixinProps(Ctor.prototype, props);

    Ctor.prototype.isInstanceOf = function (cls) {
        let bases = this.constructor._meta.bases;
        return bases.some(item => item === cls) || (this instanceof cls);
    }
    return Ctor;
};

// test
const O = createClass(null, {});
const X = createClass([O], {});
const Y = createClass([O], {
    methodY() {
        return 'Y';
    }
});
const A = createClass([X, Y], {
    testName() {
        return 'A';
    }
});
const B = createClass([Y], {
    testName() {
        return 'B';
    }
});
const C = createClass([A, B], {
    constructor() {
        this._name = 'custom C';
    }
});

let obj = new C();
console.log(obj.isInstanceOf(O)); // true
console.log(obj.isInstanceOf(X)); // true
console.log(obj.isInstanceOf(Y)); // true
console.log(obj.isInstanceOf(A)); // true
console.log(obj.isInstanceOf(B)); // true
console.log(obj.isInstanceOf(C)); // true
console.log(obj.testName());
console.log(obj.methodY());


// 但能不用继承尽量别用，js天生擅长函数式编程