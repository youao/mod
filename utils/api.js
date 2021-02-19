(function(window) {

    /**
     * app fns
     */
    u.openWin = function(ops) {
        ops = u.extend({
            pageParam: {},
            bgColor: '#fff',
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            slidBackEnabled: true,
            slidBackType: 'edge',
            animation: {
                type: 'movein',
                subType: 'from_right',
                duration: 300
            },
            delay: 300,
            allowEdit: 'true',
            overScrollMode: 'scrolls',
        }, ops, 1);
        ops.act = ops.act || ops.mod;
        ops.name = ops.mod + '_' + ops.act;
        ops.random && (ops.name += '_' + ops.random);
        ops.url = 'widget://html/' + ops.mod + '/' + ops.act + '.html';
        api.openWin(ops);
    };

    window.$api = u;

})(window);

function fnSwipeAndBounces(id) {
    if (api.systemType !== 'android') {
        return;
    }
    var el = document.querySelector(id);
    if (el) {
        el.addEventListener('touchstart', function(ev) {
            api.setFrameAttr({
                bounces: false
            });
        }, false);
        el.addEventListener('touchend', function(ev) {
            api.setFrameAttr({
                bounces: true
            });
        }, false);
    }
}

function SwipeBanner(opts) {
    this.data = [];
    this.el = document.querySelector(opts.el);
    var that = this;

    this.init = function(data) {
        var size = (data || []).length;
        var html = barretTpl(opts.tpl, data);
        html = '<div class="swiper-wrapper">' + html + '</div>';
        if (!opts.hide_pagination && size) {
            html += '<div class="swiper-pagination"></div>';
        }
        loadScript.go('/script/swiper_min.js', function() {
            that.el.innerHTML = html;
            var swipe_opts_dft = {
                loop: size > 0,
                pagination: !opts.hide_pagination && size > 0 ? {
                    el: opts.el + ' .swiper-pagination',
                } : {},
            };
            var swipe_opts = opts.swipe_opts ? $api.extend(swipe_opts_dft, opts.swipe_opts) : swipe_opts_dft;
            that.swiper = new Swiper(opts.el, swipe_opts);
            if (opts.bounce) {
                setTimeout(function() {
                    fnSwipeAndBounces(opts.el);
                }, 1000)
            }
        }, '/css/swiper_min.css');
    };

    this.update = function(data) {
        var slides = barretTpl(opts.tpl, data);
        var el_wrapper = this.el.querySelector('.swiper-wrapper');
        el_wrapper.innerHTML = slides;
        this.swiper.update();
    };

    !this.data.length && this.init(opts.data);
}

function InfiniteList(opts) {
    this.url = opts.url;
    this.page = 1;
    this.loading = false;
    this.finished = false;
    this.tpl = opts.tpl;
    this.el = $(opts.el);
    var data_key = opts.data_key || 'result|list';
    var that = this;

    this.reload = function() {
        this.page = 1;
        this.el.empty();
        this.loading = false;
        this.finished = false;
        this.go(opts.callback);
    }

    this.go = function(callback) {
        if (this.loading || this.finished) {
            return;
        }
        var url = this.url + '&page=' + this.page;
        this.loading = true;
        getAjax(url, function(res) {
            that.loading = false;
            if (typeof callback == 'function') {
                callback(res);
            } else {
                var data = [];
                if (data_key.indexOf('|') > -1) {
                    var keys = data_key.split('|');
                    data = res;
                    for (var i = 0; i < keys.length; i++) {
                        data = data[keys[i]];
                    }
                } else {
                    data = res[data_key];
                }
                if (data.length > 0) {
                    that.page++;
                    that.el.append(barretTpl(that.tpl, data));
                    api.parseTapmode();
                    loadLazyImg();
                } else {
                    that.finished = true;
                    if (that.page == 1) {
                        that.el.html(emptyData(opts.emptyText || '暂无记录'));
                    }
                }
            }
        }, (opts.loadingText || '加载中...'), (opts.cacheTime || 300));
    }

    this.go(opts.callback);
    infinite(function() {
        this.go(opts.callback);
    });
    return this;
}
