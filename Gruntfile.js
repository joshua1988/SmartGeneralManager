module.exports = function(grunt) {
  grunt.initConfig({
    // Watch task config
    watch: {
      sass: {
        files: 'public/css/scss/*.scss',
        tasks: ['sass']
      }
    },
    // SASS task config
    sass: {
      dev: {
        files: {
          // destination         // source file
          'public/css/scss/styles.css': 'public/css/scss/styles.scss'
        }
      }
    },
    browserSync: {
      default_options: {
        bsFiles: {
          src: [
            'public/css/scss/*.css',
            'public/*.html'
          ]
        },
        // https: true,
        options: {
          watchTask: true,
          proxy: 'localhost:3000'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['browserSync', 'watch']);
};
