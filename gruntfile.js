/**
 * Gruntfile for Zoocha Front end prototpye.
 * This Gruntfile contains all the task definitions related to the build of the thehm,
 * e.g. SCSS compilation, linting, etc
 * Mostly for reference
 */
"use strict();";

module.exports = function(grunt) {
  // Define the core Grunt config object

  var gruntConfig = {
    //Common vars and paths
    paths : {
      base : '.',
      css  : 'dist/css',
      scss : 'src/scss',
      js   : 'src/scripts',
      img  : 'images'
    },
    // Set this to the main SCSS file with all your imports in, the base CSS file.
    // Will compile to a CSS file of the same name.
    baseCSSFile: 'zoocha',

    //SASS subtask
    sass: {
      // Development target
      development : {
       // Any dev-specific options are declared here (e.g. sourceMaps)
        options: {
          sourceMap       : true,                   // The default source map - generate with relative URIs
          sourceComments  : false,
          trace           : true,                   // Generate a full traceback on error
          style           : 'expanded',             // Show compiled neatly and readable - best for debugging
          compass         : false,                  // Current false, but may be used if we import the Platon core CSS
          cacheLocation   : '/tmp/sasscache',       // Stores the SASS cache files in /tmp/, to keep the repo clean
          // debugInfo    : true,                   // Extra info that can be used by the FireSass plugin
          // lineNumbers  : true                    // Show source line numbers in compiled output
        },
        // The files to compile. This is in the format DESTINATION.CSS:SOURCE.SCSS
        files: {
          '<%= paths.css %>/styles.css' : '<%= paths.scss %>/<%= baseCSSFile %>.scss'
        }
      },
    },

    // postCSS subtask
    postcss: {
      options: {
        map: true,
        remove: false,
        processors: [
          require('pixrem')(),
          require('autoprefixer')
        ]
      },
      dist: {
        src: '<%= paths.css %>/styles.css'
      }
    },
    
    /**
     * CSS minify
     */
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
       files: {
        '<%= paths.css %>/styles.min.css': '<%= paths.css %>/styles.css'
       }
      }
    },

    /**
     * Linting - JS and CSS
     */
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        nocomma: true,
        browser: true,
        debug: true,
        evil: true,
        esnext: 'esversion: 6',
        globals: {
          jQuery: false,
          Drupal: false,
          drupalSettings: false
        },
      },
      beforeconcat: ['<%= paths.js %>/**/*.js']
    },
    
    /**
     * Lint SCSS files at source for coding style errors
     */
    stylelint: {
      dev: {
        src: ['<%= paths.scss %>/**/*.scss', '!<%= paths.scss %>/reset.scss', '!<%= paths.scss %>/_grid.scss'],
        extends: ["stylelint-config-standard"],
        verbose: true
      }
    },
    
    /**
     * Concatenate, then compile the JS with Babel
     */
    concat: {
      js: {
        src: [
          '<%= paths.js %>/**/*.js',
        ],
        dest: 'dist/js/global.js'
      }
    },

    /**
     * Babel Compiler
     */
    babel: {
      options: {
        sourceMap: true,
        presets: ['env']
      },
      dist: {
        files: {
          'dist/js/global.js' : 'dist/js/global.js'
        }
      }
    },
    
    /**
     * Uglify JS
     */
    uglify: {
      my_target: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/js/global.js.map'
        },
        files: {
          'dist/js/global.min.js': ['dist/js/global.js']
        }
      }
    },
    
    /**
     * Watch - Watch and run tasks on all src files
     */
    watch: {
      js: {
        files :['<%= paths.js %>/**/*.js'],
        tasks: ['js'],
      },
      css: {
        files: ['<%= paths.scss %>/**/*.scss'],
        tasks: ['css'],
      }
    },
    
    browserSync: {
      dev: {
        bsFiles: {
          src : [
              'dist/**/*.css',
              'dist/**/*.js',
              'src/**/*.html'
          ]
        },
        options: {
          notify: false,
          watchTask: true,
          server: {
            baseDir: "./",
            index: "index.html"
          }
        }
      }
    }
  };
  grunt.initConfig(gruntConfig);

  // Load any reuqired plugins here
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Set up tasks to run the subtasks declared in gruntConfig
  grunt.registerTask('css', ['stylelint', 'sass:development', 'postcss', 'cssmin']);
  grunt.registerTask('js', ['jshint', 'concat', 'babel', 'uglify']);

  grunt.registerTask('dev', ['css', 'js']);
  grunt.registerTask('default', ['dev', 'browserSync', 'watch']);

  // On watch events configure sttylelint to only run on changed file
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('stylelint.dev.src', filepath);
  });
};
