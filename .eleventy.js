// Imports
// const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const lightningCSS = require("@11tyrocks/eleventy-plugin-lightningcss");
const { srcset, src } = require("./src/helpers/shortcodes");
const mila = require("markdown-it-link-attributes");

module.exports = function (config) {
    // Quieten console output
    config.setQuietMode(true);

    // Turn all external Markdown links to new-tab links
    const milaOptions = {
        html: true,
        matcher(href) {
            return href.match(/^https?:\/\//);
        },
        attrs: {
            target: "_blank",
            rel: "noopener"
        }
    };
    config.amendLibrary("md", mdLib => mdLib.use(mila, milaOptions));

    // Create a helpful production flag
    // TODO: Unify with that in /data/env.js?
    const isBuild = process.env.ELEVENTY_RUN_MODE === 'build';

    // Transforms
    // Only minify HTML if we are in production because it slows builds _right_ down
    if (isBuild) {
        config.addTransform('htmlmin', htmlMinTransform);
    }

    // Plugins
    config.addPlugin(eleventyNavigationPlugin);
    // https://11ty.rocks/posts/process-css-with-lightningcss/#autoprefixing-and-minification-with-lightningcss
    config.addPlugin(lightningCSS);

    // Copy folders into output directory
    config.addPassthroughCopy("./src/css/");
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