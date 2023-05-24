// Shortcodes
const { srcset, src } = require("./src/helpers/shortcodes");

module.exports = function (config) {
    config.addPassthroughCopy("./src/style.css")

    // Image shortcodes from helpers/shortcodes.js
    config.addShortcode("src", src)
    config.addShortcode("srcset", srcset)

    // Make a collection of places but only those that aren't marked as 'draft'
    config.addCollection("publicPlaces", function (collectionApi) {
        // get all places
        return collectionApi.getFilteredByGlob("./src/places/*.md")
            // exclude all drafts
            .filter(item => !Boolean(item.data.draft))
    });

    config.addGlobalData('generated', () => {
        let now = new Date();
        return new Intl.DateTimeFormat(
            'en-GB', { dateStyle: 'full' }
        ).format(now);
    });

    return {
        dir: {
            input: "src",
            output: "public",
        },
    }
}