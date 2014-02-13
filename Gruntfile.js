module.exports = function(grunt) {

  // The plugins we're using 
  grunt.loadNpmTasks('grunt-contrib-concat'); // Concatenate files
  grunt.loadNpmTasks('grunt-contrib-uglify'); // Minify JavaScript
  grunt.loadNpmTasks('grunt-contrib-jshint'); // Run JSHint
  grunt.loadNpmTasks('grunt-scriptlinker'); // Insert JS Script tags in an HTML file
  grunt.loadNpmTasks('grunt-contrib-watch'); // Watch for changes to files and execute tasks
  grunt.loadNpmTasks('grunt-contrib-clean'); // Clean up things

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        stripBanners: true,
        banner: '/*! Grunt Processed [<%= grunt.task.current.filesSrc.join(",") %>] on <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
      },
      vendor: {
        src: "<%= vendor_src %>",
        dest: 'cache/vendor.js',
        nonull: true
      },
      app: {
        src: "<%= app_src %>",
        dest: 'cache/app.js',
        nonull: true
      },
    },

    uglify: {
      options: {
        banner: '/*! Minified [<%= grunt.task.current.filesSrc.join(",") %>] on <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
      },
      vendor: {
        src: "<%= vendor_src %>",
        dest: 'cache/<%= vendor_dest_filename %>',
        nonull: true
      },
      app: {
        src: "<%= app_src %>",
        dest: 'cache/<%= app_dest_filename %>',
        nonull: true
      }
    },

    jshint: {
      // jshint options http://www.jshint.com/docs/
      options: {
        "browser": true,
        "undef": true,
        "unused": true,
        "curly": true,
        "globals": {"Backbone": false, "google" : false, "ga": false, "_": false, "OverlappingMarkerSpiderfier" : false, "xola" : false},
        "eqeqeq": true,
        "immed": true,
        "latedef": true,
        "newcap": true,
        "undef": true,
        "unused": true,
        "devel": true,
        "jquery": true
      },
      app: "<%= app_src %>"
    },

    scriptlinker: {
      vendor: {
        options: {
          startTag: "<!--VENDOR_SCRIPTS-->\n",
          endTag: "<!--VENDOR_SCRIPTS_END-->",
          fileTmpl: "<script src='%s?r=<%= grunt.template.today(\"yyyymmddHHMMss\") %>'></script>\n",
        },
        files: {
          'sample.html': "cache/<%= vendor_dest_filename %>"
        },
      },
      app: {
        options: {
          startTag: "<!--APP_SCRIPTS-->\n",
          endTag: "<!--APP_SCRIPTS_END-->",
          fileTmpl: "<script src='%s?r=<%= grunt.template.today(\"yyyymmddHHMMss\") %>'></script>\n",
        },
        files: {
          'sample.html': "cache/<%= app_dest_filename %>"
        },
      },
    },

    watch: {
      vendor: {
        files: "<%= app_src %>",
        tasks: ['quickwatch-vendor']
      },
      app: {
        files: "<%= app_src %>",
        tasks: ['quickwatch-app']
      }
    },

    clean: {
      cache: ['cache/*.js']
    },

    // Vendor Library Definitions, in order
    vendor_src: ['js/lib/jquery*.js', 'js/lib/underscore*.js', 'js/lib/backbone*.js', 'js/lib/oms*', 'js/lib/jqueryui/jquery-ui-1.10.3.custom.min.js', 'js/lib/xola*'],
    // Application Code, in order
    app_src: ['js/app/models/*.js', 'js/app/collections/*', 'js/app/views/*.js', 'js/app/router.js', 'js/app/app.js'],
    // Destination filename for minified vendor library
    vendor_dest_filename: 'vendor<%= grunt.template.today("yyyymmdd") %>.min.js',
    // Destination filename for minified application code
    app_dest_filename: 'app<%= grunt.template.today("yyyymmdd") %>.min.js'
  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'scriptlinker']);
  // This task will just uglify and run scriptlinker for the app code only
  grunt.registerTask('quickwatch-app', ['uglify:app', 'scriptlinker:app']);
  // This task will just uglify and run scriptlinker for the vendor code only
  grunt.registerTask('quickwatch-vendor', ['uglify:vendor', 'scriptlinker:vendor']);

};