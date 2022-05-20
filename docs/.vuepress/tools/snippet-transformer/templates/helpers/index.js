/**
 * Indent each line of the provided string by an amount specified in the `count` parameter.
 *
 * @param {string} content The content to be indented.
 * @param {number} count Number of indents to be applied to each line of the content.
 * @returns {string}
 */
const indentLines = (content, count = 1) => {
  return content.split('\n').map(line => '  '.repeat(count) + line).join('\n');
};

module.exports = {
  indentLines
};
