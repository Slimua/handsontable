const fs = require('fs');
const path = require('path');
const semver = require('semver');
const fsExtra = require('fs-extra');

const unsortedVersions = fs.readdirSync(path.join(__dirname, '..'))
  .filter(f => semver.valid(semver.coerce(f)));

const availableVersions = unsortedVersions.sort((a, b) => semver.rcompare(semver.coerce(a), semver.coerce((b))));
const TMP_DIR_FOR_WATCH = '.watch-tmp';
const MIN_FRAMEWORKED_DOCS_VERSION = '12.0.1';
const FRAMEWORK_SUFFIX = '-data-grid';

/**
 * Get whether we work in dev mode (watch script).
 *
 * @returns {boolean}
 */
function isEnvDev() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Gets version of documentation which should be build for particular framework.
 *
 * @param {string} buildMode The env name.
 * @returns {Array}
 */
function getDocsFrameworkedVersions(buildMode) {
  const versions = getVersions(buildMode);

  return versions.filter(version => version === 'next' ||
    semver.gte(semver.coerce(version), semver.coerce(MIN_FRAMEWORKED_DOCS_VERSION)));
}

/**
 * Gets version of documentation which should be build only in one version (no separate builds for particular framework).
 *
 * @param {string} buildMode The env name.
 * @returns {Array}
 */
function getDocsNonFrameworkedVersions(buildMode) {
  const versions = getVersions(buildMode);

  return versions.filter(version => version !== 'next' &&
    semver.lt(semver.coerce(version), semver.coerce(MIN_FRAMEWORKED_DOCS_VERSION)));
}

/**
 * Gets all available docs versions.
 *
 * @param {string} buildMode The env name.
 * @returns {string[]}
 */
function getVersions(buildMode) {
  const next = buildMode !== 'production' ? ['next'] : [];

  return [...next, ...availableVersions];
}

/**
 * Gets all available frameworks.
 *
 * @returns {string[]}
 */
function getFrameworks() {
  return ['javascript', 'react', 'angular', 'vue2', 'vue3'];
}

/**
 * Gets default framework.
 *
 * @returns {string}
 */
function getDefaultFramework() {
  return 'javascript';
}

/**
 * Gets the latest version of docs.
 *
 * @returns {string}
 */
function getLatestVersion() {
  return availableVersions[0];
}

/**
 * Gets the sidebar object for docs.
 *
 * @param {string} buildMode The env name.
 * @returns {object}
 */
function getSidebars(buildMode) {
  const sidebars = { };
  const frameworks = getFrameworks();

  if (isEnvDev()) {
    getDocsNonFrameworkedVersions(buildMode).forEach((version) => {
      // eslint-disable-next-line
      const sidebarConfig = require(path.join(__dirname, `../${version}/sidebars.js`));

      sidebars[`/${TMP_DIR_FOR_WATCH}/${version}/examples/`] = sidebarConfig.examples;
      sidebars[`/${TMP_DIR_FOR_WATCH}/${version}/api/`] = sidebarConfig.api;
      sidebars[`/${TMP_DIR_FOR_WATCH}/${version}/`] = sidebarConfig.guides;
    });

    getDocsFrameworkedVersions(buildMode).forEach((version) => {
      // eslint-disable-next-line
      const sidebarConfig = require(path.join(__dirname, `../${version}/sidebars.js`));

      frameworks.forEach((framework) => {
        const apiTransformed = JSON.parse(JSON.stringify(sidebarConfig.api)); // Copy sidebar definition
        const plugins = apiTransformed.find(arrayElement => typeof arrayElement === 'object');
        const pathPartsWithoutVersion = plugins.path.split(`/${version}`);

        // We store path in sidebars.js files in form <VERSION>/api/plugins.
        plugins.path = [`/${TMP_DIR_FOR_WATCH}/${framework}${FRAMEWORK_SUFFIX}/`,
          version, ...pathPartsWithoutVersion].join('');

        sidebars[`/${TMP_DIR_FOR_WATCH}/${version}/${framework}${FRAMEWORK_SUFFIX}/examples/`] = sidebarConfig.examples;
        sidebars[`/${TMP_DIR_FOR_WATCH}/${version}/${framework}${FRAMEWORK_SUFFIX}/api/`] = apiTransformed;
        sidebars[`/${TMP_DIR_FOR_WATCH}/${version}/${framework}${FRAMEWORK_SUFFIX}/`] = sidebarConfig.guides;
      });
    });

  } else {
    getVersions(buildMode).forEach((version) => {
      // eslint-disable-next-line
      const sidebarConfig = require(path.join(__dirname, `../${version}/sidebars.js`));

      sidebars[`/${version}/examples/`] = sidebarConfig.examples;
      sidebars[`/${version}/api/`] = sidebarConfig.api;
      sidebars[`/${version}/`] = sidebarConfig.guides;
    });
  }

  return sidebars;
}

/**
 * Parses the docs version from the URL.
 *
 * @param {string} url The URL to parse.
 * @returns {string}
 */
function parseVersion(url) {
  if (isEnvDev()) {
    url = url.replace(`/${TMP_DIR_FOR_WATCH}`, '');
  }

  return url.split('/')[1] || getLatestVersion();
}

/**
 * Parses the docs framework from the URL.
 *
 * @param {string} url The URL to parse.
 * @returns {string}
 */
function parseFramework(url) {
  if (isEnvDev()) {
    url = url.replace(`/${TMP_DIR_FOR_WATCH}`, '');
  }

  const potentialFramework = url.split('/')[2]?.replace(FRAMEWORK_SUFFIX, '');

  if (getFrameworks().includes(potentialFramework)) {
    return potentialFramework;
  }
}

/**
 * Gets docs version that is currently building (based on the environment variable).
 *
 * @returns {string}
 */
function getEnvDocsVersion() {
  return process.env.DOCS_VERSION;
}

/**
 * Gets docs framework that is currently building (based on the environment variable).
 *
 * @returns {string}
 */
function getEnvDocsFramework() {
  return process.env.DOCS_FRAMEWORK;
}

/**
 * Create symlinks needed for vuepress dev script.
 *
 * @param {string} buildMode The env name.
 */
function createSymlinks(buildMode) {
  if (isEnvDev()) {
    fsExtra.removeSync(TMP_DIR_FOR_WATCH);

    getDocsNonFrameworkedVersions(buildMode).forEach((version) => {
      fsExtra.ensureSymlinkSync(version, `./${TMP_DIR_FOR_WATCH}/${version}`);
    });

    getDocsFrameworkedVersions(buildMode).forEach((version) => {
      getFrameworks().forEach((framework) => {
        fsExtra.ensureSymlinkSync(version, `./${TMP_DIR_FOR_WATCH}/${version}/${framework}${FRAMEWORK_SUFFIX}`);
      });
    });
  }
}

module.exports = {
  TMP_DIR_FOR_WATCH,
  FRAMEWORK_SUFFIX,
  getVersions,
  getFrameworks,
  getDocsFrameworkedVersions,
  getDocsNonFrameworkedVersions,
  getLatestVersion,
  getSidebars,
  parseVersion,
  parseFramework,
  getEnvDocsFramework,
  getEnvDocsVersion,
  getDefaultFramework,
  isEnvDev,
  createSymlinks
};
