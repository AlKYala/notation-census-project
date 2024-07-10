module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension("json", contents => JSON.parse(contents));

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    }
  };
};