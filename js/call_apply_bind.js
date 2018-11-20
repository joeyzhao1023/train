// my call()
// eval()
Function.prototype.myEvalCall = function(context){
    context.fn = this;
    var args = [];
    for(var i=1, l=arguments.length; i<l; i++){
        args.push('arguments['+i+']');
    }
    eval('context.fn(' + args + ')');
    delete context.fn;
}

// ES6
Function.prototype.myES6Call = function(context){
    context.fn = this;
    context.fn(...Array.from(this.arguments).slice(1));
    delete context.fn;
}

// ES6 better
Function.prototype.myES6PCall = function(context, ...parameter){
    context.fn = this;
    context.fn(...parameter);
    delete context.fn;
}

// ES6 ultimate
Function.prototype.myES6UCall = function(context, ...parameter){
    if(typeof context === 'object'){
        context = context || window;
    }else{
        context = Object.create(null);
    }
    let fn = Symbol();
    context[fn] = this;
    context[fn](...parameter);
    delete context[fn];
}

// call test
var person = {
    name: 'Joey'
}
function sayHello(age, gender){
    console.log(this.name, age, gender);
}
sayHello.myEvalCall(person, 25, 'M');
sayHello.myES6Call(person, 25, 'M');
sayHello.myES6PCall(person, 25, 'M');
sayHello.myES6UCall(person, 25, 'M');


// -----------skr--------------
// my apply()
// ES6 ultimate
Function.prototype.myES6UApply = function(context, parameter){
    if(typeof context === 'object'){
        context = context || window;
    }else{
        context = Object.create(null);
    }
    let fn = Symbol();
    context[fn] = this;
    context[fn](...parameter);
    delete context[fn];
}

// apply test
// var person = {
//     name: 'Joey'
// }
// function sayHello(age, gender){
//     console.log(this.name, age, gender);
// }
sayHello.myES6UApply(person, [25, 'M']);


// -----------skr--------------
// my bind()
Function.prototype.myBind = function(context){
    var me = this;
    return function(){
        return me.call(context);
    }
}

Function.prototype.myPBind = function(context, ...innerParameter){
    let me = this;
    return function(){
        return me.call(context, ...innerParameter);
    }
}

Function.prototype.myUBind = function(context, ...innerParameter){
    let me = this;
    return function(...finallyParameter){
        return me.call(context, ...innerParameter, ...finallyParameter);
    }
}

// bind test
// var person = {
//     name: 'Joey'
// }
// function sayHello(age, gender){
//     console.log(this.name, age, gender);
// }
let personSayHelloP = sayHello.myPBind(person, 25, 'M');
personSayHelloP();

let personSayHelloU = sayHello.myUBind(person, 25);
personSayHelloU('M');


// -----------skr--------------