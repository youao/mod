define(['anime', 'doT', 'jquery'], function(anime, doT, $) {
    var tempFn = doT.template("<h1>Here is a sample template {{=it.foo}}</h1>");
    var resultText = tempFn({
        foo: 'with doT'
    });
    return {
        open: function() {
            $('body').append(resultText);
        }
    }
})
