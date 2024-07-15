module.exports = function(eleventyConfig) {
  // Add support for JSON files
  eleventyConfig.addDataExtension("json", contents => JSON.parse(contents));
  eleventyConfig.addPassthroughCopy("src/images");
  
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

  /*eleventyConfig.addCollection("tagList", function(collectionApi) {
    let tagSet = new Set();
    const notations = collectionApi.items[0].data.notations;
    for (let key in notations) {
      const notation = notations[key];
      if (notation.tags) {
        notation.tags.forEach(tag => tagSet.add(tag));
      }
    }
    const tagList = [...tagSet];
    console.log("Tags found:", tagList);  // Debug statement
    return tagList;
  });*/

  eleventyConfig.addCollection("notationsEdit", function(collectionApi) {
    return collectionApi.getAll().filter(function(item) {
      return item.inputPath.includes("notations/");
    });
  });

  eleventyConfig.addFilter("limit", function(arr, limit) {
    return arr.slice(0, limit);
  });

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function(item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        tags = tags.filter(item => !['post', 'all'].includes(item));
        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });
    return [...tagSet];
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