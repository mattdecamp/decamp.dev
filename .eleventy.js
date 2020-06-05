
const { DateTime }  = require('luxon');
const excerpt = require('eleventy-plugin-excerpt');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require("@11ty/eleventy-plugin-rss");


module.exports = function(eleventyConfig) {

  // Passthrough copy
  eleventyConfig.addPassthroughCopy('fonts');
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('css');
  
  // Post Excerpts
  eleventyConfig.addPlugin(excerpt, {
    excerptSeparator: '<!--more-->'
  });

  // Layout aliases for convenience 
  eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');

  // Post Dates
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('LLLL d, y');
  });
  eleventyConfig.addFilter('htmlDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('y-MM-dd');
  });
  
  // PLUGINS //
  // RSS
  eleventyConfig.addPlugin(pluginRss);
  // Syntax Highlighting
  eleventyConfig.addPlugin(syntaxHighlight);
  
}

