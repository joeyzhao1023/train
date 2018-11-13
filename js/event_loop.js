console.log('1');

setTimeout(function() {
    console.log('2');
    setTimeout(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
setTimeout(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    setTimeout(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
});


// 1
// 7
// 8
// 2
// 4
// 5
// 6
// 9
// 11
// 12
// 3
// 10


// macro-task -> micro-task -> macro-task -> micro-task ...
// macro-task: script, setTimeout, setInterval, ...
// micro-task: Promise, process.nextTick, ...