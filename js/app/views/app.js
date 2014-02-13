var app = app || {};

(function($){

    app.AppView = Backbone.View.extend({
        template : '#mainTpl',
       // el : 'body'
        // Click events for the search button to be moved
        events: {
           
        },

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
                console.log('there');
                var geo = mapView.coords.geo.split(',');
                console.log(geo);
                mapView.map = new google.maps.Map(document.getElementById("map-canvas"));
                mapView.map.setCenter(new google.maps.LatLng(geo[0], geo[1]));
                mapView.map.setZoom(10);
                mapView.map.setOptions(mapView.options);
                mapView.setMarkers();

                self.$el.find("#loading").fadeOut();
                self.$el.find("#search").fadeIn();
                self.map = mapView.map;
            });
        },


        
    });
})(jQuery);
