var app = app || {};

(function($){
    app.ExploreView = Backbone.View.extend({
        template : '#exploreContentTpl',

        events: {
            'click .explore-btn.closed' : 'openPanel',
            'click .explore-btn.open' : 'closePanel',
            'click .img-container img' : 'clickImg'
        },

        initialize : function() {
            this.experience = this.options.experience;
            this.medias = this.options.experience.medias;
            this.className = this.options.experience.id;
            this.currentExperienceImageView = null;
        },

        render : function() {
            // this.$el.append(_.template($(this.template).html()));

            var tpl = _.template($(this.template).html());

            this.$explore = this.$el.find("#explore");
            this.$largeImg = this.$el.parent().parent();
            this.$el.append(tpl({className: this.className}));

            this.$exploreBtn = this.$('.explore-btn');
            this.$explorePanel = this.$('#explore-panel');

            this.loadPhotos();
        },

        loadPhotos : function() {
            var self = this;
            this.$el.find('.img-container').empty();
            _.each(this.medias, function(k) {
                if (k.type === 'photo') {
                    var cacheImg = rootImageDomain + '/experiences/' + self.className + '/medias/' + k.id + "?width=260&height=200";
                    var imagePreviewView = new app.ImagePreviewView({
                        imageId : k.id,
                        experienceId : self.className,
                        relativeSrc : k.src,
                        absoluteSrc : cacheImg,
                        caption : k.caption
                    });
                    self.$el.find('.img-container').append(imagePreviewView.el);
                    imagePreviewView.render();
                }
            });

            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'load_photos', 'eventLabel': this.experience.get('name') });
        },

        openPanel : function() {
            var self = this;
            this.showPhotos();


            this.$exploreBtn.animate({bottom: '240px'}, {duration: 800, queue: false});
            this.$exploreBtn.addClass('open').removeClass('closed');

            this.$explorePanel.animate({bottom: "0px", opacity: 1}, {duration: 800, queue: false});
            this.$explorePanel.addClass('open').removeClass('closed');

            this.$exploreBtn.fadeIn();


            if (this.currentExperienceImageView) {
                this.currentExperienceImageView.resize();
            }

            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'open', 'eventLabel': this.experience.get('name') });

        },

        closePanel : function() {
            var self = this;

            this.$exploreBtn.removeClass('open').addClass('closed');
            this.$exploreBtn.animate({bottom: "25px"}, {duration: 500, queue: false});

            this.$explorePanel.removeClass('open').addClass('closed');
            this.$explorePanel.animate({bottom: "-215px", opacity: 0}, {duration: 500, queue: false});

            if (this.currentExperienceImageView) {
                this.currentExperienceImageView.resize('full');
            }

            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'close', 'eventLabel': this.experience.get('name') });
        },

        showPhotos : function() {
            var totalWidth = 0;
            var images = this.$el.find('.img-container img');
            _.each(images, function(k) {
                totalWidth += k.clientWidth + 1;
            });

            if (totalWidth > this.$explore.width()) {
                $("#explore-panel .explore-panel-container .img-container").width(totalWidth * 1.5);
            }

            ga('send', { 'hitType': 'event', 'eventCategory': 'panel', 'eventAction': 'show_photos', 'eventLabel': this.experience.get('name') });
        },

        clickImg : function(e) {
            var elem = this.$el.find('#' + e.currentTarget.id);
            $('#search').fadeOut('fast');
            this.currentExperienceImageView = new app.ExperienceImageView({
                url : elem.attr('data-original-url'),
                caption : elem.attr('title')
            });
            this.$largeImg.find('#large-img').empty().append(this.currentExperienceImageView.el);
            this.currentExperienceImageView.render();
        }
    });
})(jQuery);
