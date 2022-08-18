const {
  getSidebars,
  getNormalizedPath,
  parseFramework,
  getThisDocsVersion,
  getDocsBaseUrl,
  getPrettyFrameworkName,
  getDefaultFramework,
  FRAMEWORK_SUFFIX,
  getNotSearchableLinks,
} = require('../../helpers');

const buildMode = process.env.BUILD_MODE;
const pluginName = 'hot/extend-page-data';

/**
 * Dedupes the slashes in the string.
 *
 * @param {string} string String to process.
 * @returns {string}
 */
function dedupeSlashes(string) {
  return string.replace(/(\/)+/g, '$1');
}

const notSearchableLinks = getNotSearchableLinks();
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const twoDigitDay = date.getDate();
  const shortMonthName = date.toLocaleString('default', { month: 'short' });

  return `${shortMonthName} ${twoDigitDay}, ${date.getFullYear()}`;
};

module.exports = (options, context) => {
  return {
    name: pluginName,

    ready() {
      context.themeConfig.sidebar = getSidebars();
    },

    /**
     * Extends and updates a page with additional information for versioning.
     *
     * @param {object} $page The $page value of the page you’re currently reading.
     */
    extendPageData($page) {
      const normalizedPath = getNormalizedPath($page.path);
      const currentFramework = parseFramework(normalizedPath);

      $page.normalizedPath = normalizedPath;
      $page.baseUrl = getDocsBaseUrl();
      $page.currentVersion = getThisDocsVersion();
      $page.currentFramework = currentFramework;
      $page.frameworkName = getPrettyFrameworkName($page.currentFramework);
      $page.defaultFramework = getDefaultFramework();
      $page.frameworkSuffix = FRAMEWORK_SUFFIX;
      $page.lastUpdatedFormat = formatDate($page.lastUpdated);
      $page.buildMode = buildMode;
      $page.isSearchable = notSearchableLinks[$page.currentFramework]?.every(
        notSearchableLink => $page.normalizedPath.includes(notSearchableLink) === false);

      const frontmatter = $page.frontmatter;

      if (frontmatter[currentFramework]) {
        Object.keys(frontmatter[currentFramework]).forEach((key) => {
          frontmatter[key] = frontmatter[currentFramework][key] ?? frontmatter[key];
        });
      }

      const frameworkPath = $page.currentFramework + FRAMEWORK_SUFFIX;

      if ($page.frontmatter.canonicalUrl) {
        $page.frontmatter.canonicalUrl = dedupeSlashes(`/docs/${frameworkPath}${$page.frontmatter.canonicalUrl}/`);
      }

      if ($page.frontmatter.permalink) {
        $page.frontmatter.permalink = `/${frameworkPath}${$page.frontmatter.permalink}`;
      }
    },
  };
};
