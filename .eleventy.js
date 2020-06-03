
const { DateTime }  = require('luxon');
const excerpt = require('eleventy-plugin-excerpt');


module.exports = function(eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy('fonts');
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('css');

  eleventyConfig.addPlugin(excerpt, {
    excerptSeparator: '<!--more-->'
  });

  // Layout aliases for convenience 
  eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');

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
  
}

