const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");
// csv to json
const csvToJson = require("csvtojson");
const fs = require("fs");

// eleventy config
module.exports = function (eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("css");

  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias("default", "layouts/base.njk");

  // Grab excerpts and sections from a file
  eleventyConfig.addFilter("section", require("./js/section.js"));

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

  // CSV to JSON book feed
  csvToJson()
    .fromFile("./_data/books.csv")
    .then((books) => {
      fs.writeFile(
        "./_data/books.json",
        JSON.stringify(books, null, 4),
        (err) => {
          if (err) {
            throw err;
          }
          console.log("new books feed created!");
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });

  // PLUGINS //
  // RSS
  eleventyConfig.addPlugin(pluginRss);
  // Syntax Highlighting
  eleventyConfig.addPlugin(syntaxHighlight);
};
