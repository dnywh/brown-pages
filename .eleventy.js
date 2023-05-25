// Imports
const { DateTime } = require("luxon");
const { srcset, src } = require("./src/helpers/shortcodes");

module.exports = function (config) {
    config.addPassthroughCopy("./src/style.css")

    // Shortcodes
    // Image shortcodes from helpers/shortcodes.js
    config.addShortcode("src", src)
    config.addShortcode("srcset", srcset)

    // Filters
    // Date filter for last updated date on guides
    // https://11ty.rocks/eleventyjs/dates/#postdate-filter
    // https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html
    config.addFilter("guideDate", (dateObj) => {
        // return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
        // Actually just using same format as `generated` for now...
        return new Intl.DateTimeFormat(
            'en-GB', { dateStyle: 'full' }
        ).format(dateObj);
    });

    config.addGlobalData('generated', () => {
        let now = new Date();
        return new Intl.DateTimeFormat(
            'en-GB', { dateStyle: 'full' }
        ).format(now);
    });

    // Make a collection of guides but only those that aren't marked as 'draft'
    config.addCollection("publicGuides", function (collectionApi) {
        // get all guides
        return collectionApi.getFilteredByGlob("./src/guides/*.md")
            // exclude all drafts
            .filter(item => !Boolean(item.data.draft))
    });


    return {
        dir: {
            input: "src",
            output: "public",
        },
    }
}