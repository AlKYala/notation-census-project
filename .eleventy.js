module.exports = function(eleventyConfig) {
  // Add support for JSON files
  eleventyConfig.addDataExtension("json", contents => JSON.parse(contents));

  // Create a collection of all tags
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    let tagSet = new Set();
    const notations = collectionApi.items[0].data.notations;
    for (let key in notations) {
      const notation = notations[key];
      if (notation.tags) {
        notation.tags.forEach(tag => tagSet.add(tag));
      }
    }
    return [...tagSet];
  });

  // Create a collection for each tag
  eleventyConfig.addCollection("taggedNotations", function(collectionApi) {
    const notations = collectionApi.items[0].data.notations;
    let taggedNotations = {};
    for (let key in notations) {
      const notation = notations[key];
      if (notation.tags) {
        notation.tags.forEach(tag => {
          if (!taggedNotations[tag]) {
            taggedNotations[tag] = [];
          }
          taggedNotations[tag].push(notation);
        });
      }
    }
    return taggedNotations;
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    }
  };
};