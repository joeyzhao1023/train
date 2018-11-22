var Counter = (function(){
    var privateCounter = 0;
    function changeBy(val){
        privateCounter += val;
    }
    return {
        increment: function(){
            changeBy(1);
        },
        decrement: function(){
            changeBy(-1);
        },
        value: function(){
            return privateCounter;
        }
    }
})();

// cannot use privateCounter and changeBy from Counter, 
// only increment, decrement and value function can use


var makeCounter = function(init){
    var privateCounter = init || 0;
    function changeBy(val){
        privateCounter += val;
    }
    return {
        increment: function(){
            changeBy(1);
        },
        decrement: function(){
            changeBy(-1);
        },
        value: function(){
            return privateCounter;
        }
    }
}
var counter1 = makeCounter();
var counter2 = makeCounter();


// 利用闭包的有点，做面向对象；继承的对象可以共享
function MyObject(name, message) {
    this.name = name.toString();
    this.message = message.toString();
}
MyObject.prototype.getName = function() {
    return this.name;
};
MyObject.prototype.getMessage = function() {
    return this.message;
};


// --------skr----------
// closures in Node.js
