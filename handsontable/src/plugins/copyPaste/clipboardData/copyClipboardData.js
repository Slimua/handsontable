import { META_HEAD, ClipboardData } from './clipboardData';
import { transformRangeLikeToIndexes } from '../../../selection';
import { getDataByCoords, getHTMLByCoords } from '../../../utils/parseTable';

/**
 * Creates an object containing information about copy/cut action.
 *
 * @private
 */
export class CopyClipboardData extends ClipboardData {
  /**
   * Sanitized data of "text/html" type inside the clipboard.
   *
   * @private
   * @type {string}
   */
  html;
  /**
   * Copied data stored as array of arrays.
   *
   * @private
   * @type {string[][]}
   */
  data;
  /**
   * Copied cell ranges related to instance of Handsontable.
   *
   * @private
   * @type {Array<{startRow: number, startCol: number, endRow: number, endCol: number}>}
   */
  copyableRanges;
  /**
   * @param {Core} instance Handsontable instance (used only while copying data).
   * @param {Array<{startRow: number, startCol: number, endRow: number, endCol: number}>} copyableRanges Cell
   * ranges related to instance of Handsontable (used only while copying data).
   */
  constructor(instance, copyableRanges) {
    super();

    const { rows, columns } = transformRangeLikeToIndexes(copyableRanges);

    this.html = [META_HEAD, getHTMLByCoords(instance, { rows, columns })].join('');
    this.data = getDataByCoords(instance, { rows, columns });
    this.copyableRanges = copyableRanges;
  }

  /**
   * Gets ranges related to copied part of Handsontable.
   *
   * @returns {Array<{startRow: number, startCol: number, endRow: number, endCol: number}>}
   */
  getRanges() {
    return this.copyableRanges;
  }
}
