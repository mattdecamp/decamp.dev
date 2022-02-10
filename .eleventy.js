const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
// csv to json
const csvToJson = require("csvtojson");
const fs = require("fs");
// SVG sprite
const svgSprite = require('eleventy-plugin-svg-sprite');

// eleventy config
module.exports = function (eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("_src/fonts");
  eleventyConfig.addPassthroughCopy("_src/images");
  eleventyConfig.addPassthroughCopy("_src/js");
  eleventyConfig.addPassthroughCopy("_src/css");

  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias("default", "layouts/base.njk");

  // Grab excerpts and sections from a file
  eleventyConfig.addFilter("section", require("./_src/js/section.js"));

  // Post Dates
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("LLLL d, y");
  });
  eleventyConfig.addFilter("htmlDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("y-MM-dd");
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
    htmlTemplateEngine: "njk"
  };
};

