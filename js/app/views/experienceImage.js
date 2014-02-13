var app = app || {};

(function($){

    app.ExperienceImageView = Backbone.View.extend({
        template: "#largeImgMarkup",

        defaults: {
            url: null
        },

        events: {
            'click .close-btn' : 'close'
        },

        initialize: function(opts) {
            this.$el.empty(); // Remove any dom elements and event listeners

            this.url = opts.url;
            this.caption = opts.caption;
        },

        render: function() {
            this.tpl = _.template($(this.template).html());
            var html = this.tpl({
                img_original : this.url,
                caption : this.caption
            });
            this.$el.empty().append(html);

            this.$close = this.$el.find('.close-btn');
            this.$close.show();
            this.resize();
        },

        close: function() {
            // Remove the image
            $('#search').fadeIn('fast');
            this.$el.find('img').animate({'opacity' : 0}, {duration: 800});
            this.$el.fadeOut();
            this.$el.empty(); // Remove any dom elements and event listeners
            this.url = null;
        },

        resize: function() {
            if (!this.url) {
                return;
            }

            var fullSize = false;
            if (arguments.length > 0 && arguments[0] == 'full') {
                fullSize = true;
            }
            
            var wh = $(window).height();
            if (fullSize) {
                // The explore panel is closed, make the image full height
                this.$el.css('height', wh);
                this.$el.find('img').animate({'height' : wh}, {duration: 800});
            } else {
                this.$el.css('height', wh - $('#explore-panel').height());
                // Resize the image to the height of window minus height of the explore-panel
                this.$el.find('img').animate({'height' : wh - $('#explore-panel').height()}, {duration: 800});
            }
        }
    });
})(jQuery);