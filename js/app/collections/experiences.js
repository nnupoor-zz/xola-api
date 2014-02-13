var app = app || {};

(function($) {

    app.ExperiencesCollection = Backbone.Collection.extend({

        initialize : function(opts,dist) {

            dist=dist!==undefined?dist:'100';
            _.bindAll(this);
            this.coords = opts;
            //random number index of experiences
            var listOfExperiences = app.experienceModel.experienceList;
            var experience = listOfExperiences[Math.floor(Math.random() * listOfExperiences.length)];
            var latlong = $.param(opts.coords); var totalDist = latlong+'%2C'+dist; experience.replace('','%20');
            this.url = rootDomain + '/api/experiences?category='+experience+'&' + totalDist + '&apiKey='+apiKey ;//pp1yvpos00okckkkko' ;
            this.nextUri = null;
            this.fetchPage();
        },

        fetchPage : function() {
            if (this.nextUri) {
                this.url = rootDomain + this.nextUri;
            }
            this.fetch({
                success : this.success,
                dataType: 'jsonp',
                remove : false
            });
        },

        parse : function(resp, options) {
            if(resp.paging && resp.data) {
                this.nextUri = resp.paging.next;
                return resp.data;
            }

            return resp;
        },

        success : function(collection, response, options) {
            if (this.nextUri) {
                this.fetchPage();
            }
            else {  
                var listOfAllExperiences = _.flatten(_.pluck(this.models,'attributes'));
                if(response.data.length!==0) {
                    var listOfExperiences = _.first(listOfAllExperiences,listOfAllExperiences.length-1);
                    var experience = listOfExperiences[Math.floor(Math.random() * listOfExperiences.length)];
                    app.experienceModel.set({experience:''},{silent:true});
                    app.experienceModel.set('experience',experience); 
                }
                else {
                    this.initialize(this.coords,'100');
                }
               
            }
        },

        comparator: function(e) {
            return e.get('name'); // sort by name
        }

    });
})(jQuery);
