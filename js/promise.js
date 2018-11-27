function myPromise(rsv, rjt){
    var timeOut = Math.random() * 2;
    console.log('set timtout to:' + timeOut + ' seconds.');

    setTimeout(function(){
        if(timeOut < 1){
            console.log('call rsv() ...');
            rsv('200 OK');
        }else{
            console.log('call rjt() ...');
            rjt('timeout in '+ timeOut + ' seconds.');
        }
    }, timeOut * 1000);
}

new Promise(myPromise).then(function(result){
    console.log('success: ' + result);
}).catch(function(reason){
    console.log('failed: ' + reason);
});



// ------- skr -----------
function get(url){
    // Return a new promise.
    return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);
    
        req.onload = function() {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req.response);
            }else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
            }
        };
    
        // Handle network errors
        req.onerror = function() {
            reject(Error("Network Error"));
        };
    
        // Make the request
        req.send();
    });
}
function getJSON(url){
    return get(url).then(JSON.parse);
}
function addHtmlToPage(context){
    // add some html context to dom
}
function addTextToPage(text){
    // add text to dom
}


// version 1, load chapter one by one and show one by one
// it's ok, reader can read one by one as the first loaded
getJSON('story.json').then(function(story) {
    addHtmlToPage(story.heading);

    return story.chapterUrls.reduce(function(sequence, chapterUrl) {
        // Once the last chapter's promise is done…
        return sequence.then(function() {
            // …fetch the next chapter
            return getJSON(chapterUrl);
        }).then(function(chapter) {
            // and add it to the page
            addHtmlToPage(chapter.html);
        });
    }, Promise.resolve());

}).then(function() {
    // And we're all done!
    addTextToPage("All done");
}).catch(function(err) {
    // Catch any error that happened along the way
    addTextToPage("Argh, broken: " + err.message);
}).then(function() {
    // Always hide the spinner
    document.querySelector('.spinner').style.display = 'none';
});


// version 2, load chapters together and show them in order when all done
// faster but not pretty good cause the reader need wait all chapters loaded
getJSON('story.json').then(function(story) {
    addHtmlToPage(story.heading);

    // Take an array of promises and wait on them all
    return Promise.all(
        // Map our array of chapter urls to
        // an array of chapter json promises
        story.chapterUrls.map(getJSON)
    );

}).then(function(chapters) {
    // Now we have the chapters jsons in order! Loop through…
    chapters.forEach(function(chapter) {
        // …and add to the page
        addHtmlToPage(chapter.html);
    });
    addTextToPage("All done");
}).catch(function(err) {
    // catch any error that happened so far
    addTextToPage("Argh, broken: " + err.message);
}).then(function() {
    document.querySelector('.spinner').style.display = 'none';
});


// version 3, load chapters together and show the ahead ones when them loaded
// if the later one loaded first it will wait it's ahead ones loaded. onces they loaded show them all
// faster and best! 
getJSON('story.json').then(function(story) {
    addHtmlToPage(story.heading);

    // Map our array of chapter urls to
    // an array of chapter json promises.
    // This makes sure they all download parallel.
    return story.chapterUrls.map(getJSON)
    .reduce(function(sequence, chapterPromise) {
        // Use reduce to chain the promises together,
        // adding content to the page for each chapter
        return sequence.then(function() {
            // Wait for everything in the sequence so far,
            // then wait for this chapter to arrive.
            return chapterPromise;
        }).then(function(chapter) {
            addHtmlToPage(chapter.html);
        });
    }, Promise.resolve());

}).then(function() {
    addTextToPage("All done");
}).catch(function(err) {
    // catch any error that happened along the way
    addTextToPage("Argh, broken: " + err.message);
}).then(function() {
    document.querySelector('.spinner').style.display = 'none';
});



// version 4, ???
function spawn(generatorFunc) {
    function continuer(verb, arg) {
        var result;
        try {
            result = generator[verb](arg);
        } catch (err) {
            return Promise.reject(err);
        }
        if (result.done) {
            return result.value;
        } else {
            return Promise.cast(result.value).then(onFulfilled, onRejected);
        }
    }
    var generator = generatorFunc();
    var onFulfilled = continuer.bind(continuer, "next");
    var onRejected = continuer.bind(continuer, "throw");
    return onFulfilled();
}

spawn(function *() {
    try {
        // 'yield' effectively does an async wait,
        // returning the result of the promise
        let story = yield getJSON('story.json');
        addHtmlToPage(story.heading);

        // Map our array of chapter urls to
        // an array of chapter json promises.
        // This makes sure they all download parallel.
        let chapterPromises = story.chapterUrls.map(getJSON);

        for (let chapterPromise of chapterPromises) {
            // Wait for each chapter to be ready, then add it to the page
            let chapter = yield chapterPromise;
            addHtmlToPage(chapter.html);
        }

        addTextToPage("All done");
    }
    catch (err) {
        // try/catch just works, rejected promises are thrown here
        addTextToPage("Argh, broken: " + err.message);
    }
    document.querySelector('.spinner').style.display = 'none';
});