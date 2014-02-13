var app = app || {};

(function($){

    app.AppView = Backbone.View.extend({
        template : '#mainTpl',
        initialize: function() {
            this.$el.append(_.template($(this.template).html()));
            $('body').append(this.el);
            this.render();
        },

        render : function() {
            var self = this;
            app.experienceModel = new app.Experience();
            var mapView = new app.MapView({model:app.experienceModel});
            mapView.render();

            mapView.on('load:first', function() {

                var geo = mapView.coords.geo.split(',');
                mapView.map = new google.maps.Map(document.getElementById("map-canvas"));
                mapView.map.setCenter(new google.maps.LatLng(geo[0], geo[1]));
                mapView.map.setZoom(10);
                mapView.map.setOptions(mapView.options);
                mapView.setMarkers();

                self.$el.find("#loading").fadeOut();
                self.$el.find("#search").fadeIn();
                self.map = mapView.map;
            });
        }      
    });
})(jQuery);
