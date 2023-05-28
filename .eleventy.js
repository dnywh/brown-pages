// Imports
// const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { srcset, src } = require("./src/helpers/shortcodes");

module.exports = function (config) {
    // Quieten console output
    config.setQuietMode(true);

    // Plugins
    config.addPlugin(eleventyNavigationPlugin);

    // Copy folders into output directory
    config.addPassthroughCopy("./src/style.css")
    config.addPassthroughCopy("./src/js/");
    config.addPassthroughCopy("./src/assets/");

    // Shortcodes
    // Image shortcodes from helpers/shortcodes.js
    config.addShortcode("src", src)
    config.addShortcode("srcset", srcset)

    // Global data
    config.addGlobalData('generatedDate', () => {
        let now = new Date();
        return new Intl.DateTimeFormat(
            'en-GB', { dateStyle: 'full' }
        ).format(now);
    });

    // Filters
    // Date filter for ISO8601 format (for further manipulation in JavaScript)
    // https://www.aleksandrhovhannisyan.com/blog/useful-11ty-filters/#3-date-formatting
    const toISOString = (dateString) => new Date(dateString).toISOString();
    config.addFilter('toISOString', toISOString);

    // Date filter for last updated date on guides
    // https://11ty.rocks/eleventyjs/dates/#postdate-filter
    // https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html
    config.addFilter("readableDate", (dateObj) => {
        // return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
        // Actually just using same format as `generatedDate` for now...
        return new Intl.DateTimeFormat(
            'en-GB', { dateStyle: 'full' }
        ).format(dateObj);
    });

    // Make a collection of guides sorted alphabetically
    config.addCollection("guides", (collection) => {
        // Get all guides
        const allGuides = collection.getFilteredByGlob("./src/guides/*.md")
        // Sort alphabetically
        const sortedAlphabetically = allGuides.sort((a, b) => {
            if (a.data.title > b.data.title) return -1;
            else if (a.data.title < b.data.title) return 1;
            else return 0;
        }).reverse()
        // Return the end result
        const guides = sortedAlphabetically
        return guides
    })

    return {
        dir: {
            input: "src",
            output: "public",
        },
    }
}