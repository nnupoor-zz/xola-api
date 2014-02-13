var app = app || {};

(function($){
    app.ImagePreviewView = Backbone.View.extend({
        template : '#imagePreviewTpl',

        initialize : function(opts) {
            this.imageId = opts.imageId;
            this.caption = opts.caption;
            this.relativeSrc = opts.relativeSrc;
            this.src = opts.absoluteSrc;
            this.experienceId = opts.experienceId;
        },

        render : function() {
            var tpl = _.template($(this.template).html());
            var params = {
                exp_id : this.experienceId,
                img_id : this.imageId,
                original_url : this.relativeSrc,
                panel_img : this.src,
                caption : this.caption || ''
            }
            this.$el.append(tpl(params));
        }
    });
})(jQuery);