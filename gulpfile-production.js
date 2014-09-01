// For all available options, see node_modules/pho-devstack/config.js
// These are production build settings, see gulpfile.js for development settings

var gulp = require('gulp');
var extend = require('node.extend');
var substituteConfig = require('./substitute-config');

var pho = require('pho-devstack')(gulp, {
  browserify: {
    debug: false,
    transforms: {
      "browserify-ngmin": true,
      uglifyify: true
    }
  },
  less: {
    sourceMap: false
  },
  livereload: {
    enabled: false
  },
  plumber: {
    enabled: false
  },
  rename: {
    enabled: true
  },
  watch: {
    enabled: false
  },
  substituter: extend(true, substituteConfig, {
    // cdn: 'http://example.com' // url to your CDN server
    // cdn: '/', // uncomment if you are using absolute paths without CDN
  }),
  copy: ['humans.txt', 'scripts/plugins.js']
});

// If needed, redefine tasks here
