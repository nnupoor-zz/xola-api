var app = app || {};

(function($){
    app.MapView = Backbone.View.extend({
        rendered : false,
        el : '#container',
        model :  app.Experience,
        events : {
            "click #weekends":"fetchData",
            "click #later":"fetchData",
            "click #search-btn": "findCoordinates",
            "keypress #search-txt": "findCoordinates",
        },
        // markerImg : {
        //     'River Rafting' : 'waterpark',
        //     'Trekking / Hiking' : 'hiking',
        //     'Kayaking & Canoeing' : 'kayaking',
        //     'Fly Fishing' : 'fishing',
        //     'Food & Wine' : 'restaurant',
        //     "Sailing" : 'sailing',
        //     'Cycling & Mountain Biking' : 'cycling',
        //     "Deep Sea Fishing": 'deepseafishing',
        //     "Guide School": 'walkingtour',
        //     "River Tubing ": '',
        //     "Safety Training": '',
        //     "Team Building": '',
        //     "Bungee Jumping": '',
        //     "Caving / Spelunking": 'spelunking',
        //     "River Cruises": 'cruiseship',
        //     "Skydiving": 'diving',
        //     "Surfing": 'surfing',
        //     "Website Creation": '',
        //     "Lake Fishing": 'fishing',
        //     "Parachuting": 'paragliding',
        //     "Paragliding": 'paragliding',
        //     "Mountaineering": 'mountains',
        //     "Aerial Tours": 'helicopter',
        //     "Creative Classes": '',
        //     "Snowshoeing": 'snowshoeing',
        //     "Windsurfing & Kitesurfing": 'kitesurfing',
        //     "Art & Architecture": '',
        //     "Birdwatching": 'birds-2',
        //     "Hang Gliding ": 'hanggliding',
        //     "Wilderness Training": '',
        //     "Ballooning": 'hotairbaloon',
        //     "Walking Tours": 'walkingtour',
        //     "Backpacking/Camping": 'camping-2',
        //     "Culture & History": '',
        //     "Eco-Tour/Hike": '',
        //     "Marine Wildlife": '',
        //     "Snowmobiling": 'snowmobiling',
        //     "Wakeboarding": 'boardercross',
        //     "Zip-lining": 'ziplining',
        //     "Beer Tour": 'beergarden',
        //     "Photography": 'photography',
        //     "Snowkiting": 'snowboarding',
        //     "Stand Up Paddle (SUP)": 'surfpaddle',
        //     "Off-road": 'atv',
        //     "Helicopter Tours": 'helicopter',
        //     "Horseback Riding": 'horseriding',
        //     "Rock Climbing": 'climbing'
        // },

        initialize : function(opts) {
            this.markers = [];
        },

        render : function() {
            var self = this;
            // Let's setup the map
            // var styles = [{
            //     elementType: "geometry",
            //     stylers: [{ lightness: 23 }, { saturation: -10 }]
            // }];


        var styles = [
              {
                featureType: "all",
                stylers: [
                  { saturation: -80 }
                ]
              },{
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                  { hue: "#00ffee" },
                  { saturation: 50 }
                ]
              },{
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                  { visibility: "off" }
                ]
             }
        ];

            // By default set fixed Geo-cordinates of Mountain View, CA
            // long, lat
            var defaultCoords = [37.413114,-122.070336];
            this.coords = { geo: defaultCoords.join(',') };
            // if (navigator.geolocation) {
            //     // We have the user's Geo Location - let's center the map around that area
            //     navigator.geolocation.getCurrentPosition(
            //         function(pos) {
            //             self.coords = { geo: pos.coords.latitude + "," + pos.coords.longitude };
                        
            //             var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + self.coords.geo + "&sensor=false";
            //             $.getJSON(url, function(data) {
            //                 if(data.status==='OK'){
                                
            //                     self.currentAddress = data.results[0].formatted_address; console.log(self.currentAddress);
            //                     $('#search-txt').val(self.currentAddress);
            //                 }
            //             });
            //         },
            //         function(e) {
            //             console.warn(e);
            //         }
            //     );
            // }

           
            var geo = this.coords.geo.split(',');
            this.options = {
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(geo[0], geo[1]), // Center of the US
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                styles: styles
            };

            this.collection = new app.ExperiencesCollection({coords : this.coords});
            app.experienceCollection = this.collection;
            //Fire an event when we receive the first batch of data
            this.listenTo(this.model,"change:experience",function(){
                console.log(self.model.get('experience'));
                self.trigger('load:first');
            });
        },

         findCoordinates : function(e) {
            if (e.which !== 1 && e.which !== 13) {
                return;
            }

            var txt = encodeURIComponent($("#search-txt").val());
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + txt + "&sensor=false";

            ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'click','eventLabel': txt});

            var self = this;
            $.getJSON(url, function(data) {
                console.log(data);
                
                var loc = data.results[0].geometry.location;
                self.coords = { geo: (data.results[0].geometry.location.lat).toString() +','+ (data.results[0].geometry.location.lng).toString() };
                var formatted_address = data.results[0].formatted_address;
                ga('send', {'hitType': 'event', 'eventCategory': 'search', 'eventAction': 'success','eventLabel': formatted_address});

                var bounds = data.results[0].geometry.viewport;

                var boundsSW = new google.maps.LatLng(bounds.southwest.lat, bounds.southwest.lng);
                var boundsNE = new google.maps.LatLng(bounds.northeast.lat, bounds.northeast.lng);

                var latBounds = new google.maps.LatLngBounds(boundsSW, boundsNE);

                self.map.fitBounds(latBounds);
                self.map.setCenter(new google.maps.LatLng(loc.lat, loc.lng));
                app.experienceCollection.initialize({coords : self.coords});
            });

        },

        fetchData : function(e){
            var id = e.currentTarget.id;
           
            if(id==='later'){
                //make API call with bigger distance
                app.experienceCollection.initialize({coords : this.coords},'500');       
            }else{
                //make API call with smaller distance
                app.experienceCollection.initialize({coords : this.coords},'30');       
            }
        },
        setMarkers : function() {
            var self = this;

            this.oms = new OverlappingMarkerSpiderfier(this.map);
            var geo = this.coords.geo.split(',');
            // this.map.panTo(new google.maps.LatLng(geo[0], geo[1]));

            // Put the selected experience on the map
                var markerView = new app.MarkerView({map: self.map});
                var experience = this.model;
                var marker = markerView.plotExperience(experience);
               
                if (marker) {
                    self.markers.push(marker);
                    self.oms.addMarker(marker);
                    self.map.setCenter(marker.getPosition());  
                }

            //Place the current location
            var geo = this.coords.geo.split(',');
            var location = new google.maps.LatLng(geo[0],geo[1]);
            marker = new google.maps.Marker({
                position: location,
                map: self.map
            });

            this.plotRoute();
    

            this.oms.addListener('click', function(marker) {
                self.showInfo.call(marker, self.$el);
            });

            this.oms.addListener('spiderfy', function(markers) {
                _.invoke(markers, self.hideInfo);
            });
        },

        showInfo : function($el) {
            // We are in scope of the marker
            this.InfoWindow.open(this.map, this);
            this.exploreView = new app.ExploreView({experience: this.experience});
            $("#explore").append(this.exploreView.el);
            this.exploreView.render();
            xola.init();
        },

        plotRoute : function(){
            var self=this;
            console.log(this);
            var geo = this.coords.geo.split(',');
            var exp = this.model.get('experience');    
            var latLong = [
                new google.maps.LatLng(geo[0],geo[1]),
                new google.maps.LatLng(exp.geo.lat, exp.geo.lng)
              ];
            var path = new google.maps.MVCArray();
            //Intialize the Direction Service
            var service = new google.maps.DirectionsService();  
            //Set the Path Stroke Color
            var poly = new google.maps.Polyline({ map: self.map, strokeColor: '#4444ee' });
            //Loop and Draw Path Route between the Points on MAP
            for (var i = 0; i < latLong.length; i++) {
                if ((i + 1) < latLong.length) {
                    var src = latLong[i];
                    var des = latLong[i + 1];
                    path.push(src);
                    poly.setPath(path);
                    service.route({
                        origin: src,
                        destination: des,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                    }, function (result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                path.push(result.routes[0].overview_path[i]);
                            }
                        }
                    });
                }
            }
        },

        hideInfo : function() {

        },

        clear: function() {
            _.each(this.markers, function(marker) {
                marker.setMap(null);
            })
        },

        exists: function(id) {
            var exists = false;
            _.each(this.markers, function(marker) {
                if (marker.experience.get('id') == id) {
                    exists = true;
                }
            });

            return exists;
        }
    });
})(jQuery);
