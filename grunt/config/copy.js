'use strict';

var commentLineExp =  /^[\s]*<!-- (\/|#) (CE|EE)/;
var requireConfExp =  /require-conf.js$/;

module.exports = function(config) {
  var grunt = config.grunt;

  function fileProcessing(content, srcpath) {
    if(grunt.config('buildTarget') === 'dist') {
      // removes the template comments
      content = content
                .split('\n').filter(function(line) {
                  return !commentLineExp.test(line);
                }).join('\n');

      var date = new Date();
      var cacheBuster = [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
      content = content
                .replace(/\/\* cache-busting /, '/* cache-busting */')
                .replace(/CACHE_BUSTER/g, requireConfExp.test(srcpath) ? '\''+ cacheBuster +'\'' : cacheBuster);

      return content;
    } else {
      /* jshint validthis: true */
      var liveReloadPort = this.config.get('pkg.gruntConfig.livereloadPort');
      /* jshint validthis: false */

      if (requireConfExp.test(srcpath)) {
        content = content
                  .replace(/\/\* live-reload/, '/* live-reload */')
                  .replace(/LIVERELOAD_PORT/g, liveReloadPort);
      }

      content = content
                .replace(/\/\* cache-busting/, '/* cache-busting */')
                .replace(/CACHE_BUSTER/g, (new Date()).getTime());

      return content;
    }
  }

  return {
    options: {},

    index: {
      options: {
        process: function() {
          return fileProcessing.apply(grunt, arguments);
        }
      },
      files: [
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.clientDir %>/scripts/',
          src: [
            'index.html'
          ],
          dest: '<%= buildTarget %>/'
        }
      ]
    },

    assets: {
      process: function(content, srcpath) {
        grunt.log.ok('Copy '+ srcpath);
        return content;
      },
      files: [
        // images, fonts & stuff
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.clientDir %>/',
          src:  [
            '{fonts,images}/**/*.*'
          ],
          dest: '<%= buildTarget %>/assets'
        },

        // dojo & dojox
        {
          expand: true,
          cwd: '<%= pkg.gruntConfig.clientDir %>/vendor/dojo',
          src:  [
            '**/*.*'
          ],
          dest: '<%= buildTarget %>/assets/vendor'
        }
      ]
    },
  };
};
