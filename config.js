URL = 'https://mall.yataisannong.com';
DIR_IMG = 'widget://assets/image/';

requirejs.config({
    baseUrl: '../../',
    paths: {
        vue: 'assets/js/vue.min',
        jquery: 'assets/js/jquery-3.5.1.min',
        doT: 'assets/js/doT.min',
        md5: 'assets/js/md5.min',
        anime: 'assets/js/anime.min',
        swiper: 'assets/js/swiper/swiper-bundle.min',
    },
    map: {
        '*': {
            'css': 'assets/js/require/css.min'
        }
    },
    shim: {
        swiper: ['css!assets/js/swiper/swiper-bundle.min.css']
    }
});

function ready(defs, callback) {
    apiready = function() {
        requirejs(defs, callback);
    }
};

/** REM **/
(function(w) {
    var wdpr = window.devicePixelRatio || 1,
        dpr = Math.floor(100 / wdpr) / 100,
        content = 'maximum-scale=' + dpr + ',minimum-scale=' + dpr + ',initial-scale=1,user-scalable=0,width=device-width';
    document.querySelector('meta[name=viewport]').setAttribute('content', content);
    document.documentElement.style.fontSize = Math.floor((window.screen.width || 375) * wdpr / w * 100) + "px";
})(375);
