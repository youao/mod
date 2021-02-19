define(['anime', 'doT', 'jquery'], function(anime, doT, $) {
    var tpl = `<div id="loading_view_{{=it.id}}" class="loading-view fmix-center-v">
        <div class="loading-icon">
            <img src="{{=it.icon}}" />
        </div>
        <div class="fmix-center">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    </div>`;
    var tplFn = doT.template(tpl);
    return {
        id: 0,
        open: function(icon) {
            var id = new Date().getTime();
            this.id = id;
            icon = icon || '../../assets/image/logo.png';
            $('body').append(tplFn({
                icon: icon,
                id: id
            }));
            anime({
                targets: '.loading-view .loading-dot',
                backgroundColor: 'rgba(0,0,0,0.6)',
                easing: 'linear',
                // direction: 'alternate',
                loop: true,
                delay: anime.stagger(300)
            });
        },
        close: function() {
            var selector = '#loading_view_' + this.id;
            anime({
                targets: selector,
                opacity: 0,
                easing: 'linear',
                duration: 300
            });
            setTimeout(function() {
                $(selector).remove();
            }, 300)
        }
    }
})
