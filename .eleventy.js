module.exports = function (eleventyConfig) {
    // Passthroughs
    // CSS
    eleventyConfig.addPassthroughCopy("./src/style.css")

    // Filters
    // Readable dates
    eleventyConfig.addFilter("niceDate", (dateObj) => {
        return new Intl.DateTimeFormat(
            'en-US', { dateStyle: 'medium' }

        ).format(dateObj);
    });

    return {
        dir: {
            input: "src",
            output: "public",
        },
    }
}