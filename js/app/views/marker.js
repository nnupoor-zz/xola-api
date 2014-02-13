var app = app || {};

(function($){
    app.MarkerView = Backbone.View.extend({
        template : "#markerInfo",
        markerImg : {
            'River Rafting' : 'waterpark',
            'Trekking / Hiking' : 'hiking',
            'Kayaking & Canoeing' : 'kayaking',
            'Fly Fishing' : 'fishing',
            'Food & Wine' : 'restaurant',
            "Sailing" : 'sailing',
            'Cycling & Mountain Biking' : 'cycling',
            "Deep Sea Fishing": 'deepseafishing',
            "Guide School": 'walkingtour',
            "River Tubing ": '',
            "Safety Training": '',
            "Team Building": '',
            "Bungee Jumping": '',
            "Caving / Spelunking": 'spelunking',
            "River Cruises": 'cruiseship',
            "Ocean Cruises": 'cruiseship',
            "Motor Yacht" : 'boat',
            "Houseboats" : 'boat',
            "Sleigh Riding" : 'sleigh',
            "Skydiving": 'diving',
            "Surfing": 'surfing',
            "Website Creation": '',
            "Lake Fishing": 'fishing',
            "Parachuting": 'paragliding',
            "Paragliding": 'paragliding',
            "Mountaineering": 'mountains',
            "Aerial Tours": 'helicopter',
            "Creative Classes": '',
            "Snowshoeing": 'snowshoeing',
            "Windsurfing & Kitesurfing": 'kitesurfing',
            "Art & Architecture": 'art',
            "Birdwatching": 'birds-2',
            "Hang Gliding": 'hanggliding',
            "Wilderness Training": 'wild',
            "Ballooning": 'hotairbaloon',
            "Walking Tours": 'walkingtour',
            "Backpacking/Camping": 'camping-2',
            "Culture & History": 'history',
            "Eco-Tour/Hike": 'hiking',
            "Marine Wildlife": 'marine',
            "Website Creation" : 'computer',
            "Snowmobiling": 'snowmobiling',
            "Wakeboarding": 'boardercross',
            "Zip-lining": 'ziplining',
            "Beer Tour": 'beergarden',
            "Photography": 'photography',
            "Snowkiting": 'snowboarding',
            "Stand Up Paddle (SUP)": 'surfpaddle',
            "Off-road": 'atv',
            "Helicopter Tours": 'helicopter',
            "Horseback Riding": 'horseriding',
            "Rock Climbing": 'climbing',
            "Skiing": 'skiing',
            "Cross Country Skiing": 'cross_country_skiing',
            "Film Screening": 'film',
            "Scuba & Snorkeling": 'scubadiving',
            "Music/Rafting festival" : 'music'
        },

        initialize : function(opts) {
            this.map = opts.map;
        },

        plotExperience : function(experience) {
            var self = this;
           
            if (!experience.isMappable()) {
                return;
            }
            //console.log(experience.get('category'));
            var exp=experience.get('experience');
            var expCategory = exp.category.trim();
            var currentMarkerImg = this.markerImg[expCategory] ? this.markerImg[expCategory] : 'blank';
            currentMarkerImg = 'images/markers/' + currentMarkerImg + '.png';
            var marker = new google.maps.Marker({
                map: self.map,
                experience: exp,
                exploreView: null,
                icon: currentMarkerImg,
                position: new google.maps.LatLng(exp.geo.lat, exp.geo.lng),
                title: exp.name,
                descr : exp.excerpt,
                id : exp.id
            });

            var markerTpl = _.template($(this.template).html());
            var cacheImg = rootImageDomain + '/experiences/' + exp.id + '/medias/' + exp.photo.id + '?width=260&height=200';
            var experienceJson = experience.toJSON();
            experienceJson.experience.cacheImg = cacheImg;
            marker.InfoWindow = new google.maps.InfoWindow({
                content: markerTpl(experienceJson.experience)
            });

            // When you click the close button on the marker, hide info window
            google.maps.event.addListener(marker.InfoWindow, 'closeclick', function() {
                // self.hide_info.call(marker);
            });
            return marker;
        }
    });
})(jQuery);