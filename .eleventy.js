module.exports = function(config) {
  // Passthrough copy
  config.addPassthroughCopy('fonts');
  config.addPassthroughCopy('images');
  config.addPassthroughCopy('js');
  config.addPassthroughCopy('css');
}