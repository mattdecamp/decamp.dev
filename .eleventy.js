const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
// SVG sprite
const svgSprite = require('eleventy-plugin-svg-sprite');
const markdownIt = require('markdown-it');
const CleanCSS = require("clean-css");

// eleventy config
module.exports = function (eleventyConfig) {
  // Passthroughs
  eleventyConfig.addPassthroughCopy("_src/fonts");
  eleventyConfig.addPassthroughCopy("_src/images");
  eleventyConfig.addPassthroughCopy("_src/js");
  eleventyConfig.addPassthroughCopy("_src/robots.txt");
  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias("default", "layouts/base.njk");
  
  // FILTERS
  // Clean CSS and minify
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
  // Post Dates
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("LLLL d, y");
  });
  // Format Notion Dates
  eleventyConfig.addFilter("fixDate", (dateObj) => {
    return DateTime.fromISO(dateObj).toLocaleString();
  });
  eleventyConfig.addFilter("dateTime", (dateObj) => {
    return DateTime.fromISO(dateObj);
  });

  // Parse markdown included in njk files
  eleventyConfig.addFilter("markdown", function (value) {
    let markdown = require("markdown-it")({
      html: true,
    });
    return markdown.render(value);
  });


  // TRANSFORMS //
  // minify HTML
  const htmlMinTransform = require("./_src/transforms/html-min.js");
  const isProduction = process.env.ELEVENTY_ENV === "production";
  // html min only in production
  if (isProduction) {
    eleventyConfig.addTransform("htmlmin", htmlMinTransform);
  }

  // PLUGINS //
  // RSS
  eleventyConfig.addPlugin(pluginRss);
  // Syntax Highlighting
  eleventyConfig.addPlugin(syntaxHighlight);
  // SVG Sprite
  eleventyConfig.addPlugin(svgSprite, {
    path: "./_src/assets/svg",
    svgShortcode: "icon",
    defaultClasses: "icon"
  });

  // Base Config //
  return {
    dir: {
      input: "_src",
      output: "_site",
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
  };
};

