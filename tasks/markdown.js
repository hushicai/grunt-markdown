/*
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';
  
  var path = require('path'); 
  var markdown = require('marked');
  var hljs = require('highlight.js');
  var _ = require('lodash');

  grunt.registerHelper('markdown', function(src, options, template) {

    var html = null;

    if(typeof options.highlight === 'string') {
      if(options.highlight === 'auto') {
        options.highlight = function(code) {

          return hljs.highlightAuto(code).value;
        };
      } else if (options.highlight === 'manual') {
        options.highlight = function(code, lang) {
          return hljs.highlight(lang, code).value;
        };
      }
      
    }

    markdown.setOptions(options);

    grunt.verbose.write('Marking down...');  

    html = markdown(src);

    return _.template(template, {content:html});

  });

  grunt.registerMultiTask('markdown', 'compiles markdown files into html', function() {
    var destPath = this.data.dest;
    var options = this.data.options || {};
    var extension = this.data.extenstion || 'html';
    var templateFn = this.data.template || 'tasks/template.html'; 
    var template = grunt.file.read(templateFn);

    grunt.file.expandFiles(this.data.files).forEach(function(filepath) {
      
      var file = grunt.file.read(filepath);

      var html = grunt.helper('markdown', file, options, template);
      var ext = path.extname(filepath);
      var dest = path.join(destPath, path.basename(filepath, ext) +'.'+ extension);
      grunt.file.write(dest, html);
      
    });
    
  });
  
};

