var app = app || {};

(function(){
    'use strict';

    app.Experience = Backbone.Model.extend({
        defaults : {

        },
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
            "Art & Architecture": '',
            "Birdwatching": 'birds-2',
            "Hang Gliding ": 'hanggliding',
            "Wilderness Training": '',
            "Ballooning": 'hotairbaloon',
            "Walking Tours": 'walkingtour',
            "Backpacking/Camping": 'camping-2',
            "Culture & History": '',
            "Eco-Tour/Hike": '',
            "Marine Wildlife": '',
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
            "Rock Climbing": 'climbing'
    	},
    	initialize : function(){
    		this.experienceList = _.keys(this.markerImg);
    	},
        isMappable : function() {
            var exp = this.get('experience');
            return exp.photo && exp.geo && exp.complete == true;
        }
    });
})();