import { BasePlugin } from '../base';
import Hooks from '../../pluginHooks';
import { stringify, parse } from '../../3rdparty/SheetClip';
import { arrayEach } from '../../helpers/array';
import { sanitize } from '../../helpers/string';
import { getSelectionText } from '../../helpers/dom/element';
import copyItem from './contextMenuItem/copy';
import copyColumnHeadersOnlyItem from './contextMenuItem/copyColumnHeadersOnly';
import copyWithColumnGroupHeadersItem from './contextMenuItem/copyWithColumnGroupHeaders';
import copyWithColumnHeadersItem from './contextMenuItem/copyWithColumnHeaders';
import cutItem from './contextMenuItem/cut';
import PasteEvent from './pasteEvent';
import { createElement, destroyElement } from './focusableElement';
import {
  CopyableRangesFactory,
  normalizeRanges,
} from './copyableRanges';
import { _dataToHTML, htmlToGridSettings } from '../../utils/parseTable';

import './copyPaste.css';

Hooks.getSingleton().register('afterCopyLimit');
Hooks.getSingleton().register('modifyCopyableRange');
Hooks.getSingleton().register('beforeCut');
Hooks.getSingleton().register('afterCut');
Hooks.getSingleton().register('beforePaste');
Hooks.getSingleton().register('afterPaste');
Hooks.getSingleton().register('beforeCopy');
Hooks.getSingleton().register('afterCopy');

export const PLUGIN_KEY = 'copyPaste';
export const PLUGIN_PRIORITY = 80;
const SETTING_KEYS = ['fragmentSelection'];
const META_HEAD = [
  '<meta name="generator" content="Handsontable"/>',
  '<style type="text/css">td{white-space:normal}br{mso-data-placement:same-cell}</style>',
].join('');

/* eslint-disable jsdoc/require-description-complete-sentence */
/**
 * @description
 * This plugin enables the copy/paste functionality in the Handsontable. The functionality works for API, Context Menu,
 * using keyboard shortcuts and menu bar from the browser.
 * Possible values:
 * * `true` (to enable default options),
 * * `false` (to disable completely).
 *
 * or an object with values:
 * * `'columnsLimit'` (see {@link CopyPaste#columnsLimit})
 * * `'rowsLimit'` (see {@link CopyPaste#rowsLimit})
 * * `'pasteMode'` (see {@link CopyPaste#pasteMode})
 * * `'copyColumnHeaders'`
 * * `'copyColumnGroupHeaders'`
 * * `'copyColumnHeadersOnly'`
 * * `'uiContainer'` (see {@link CopyPaste#uiContainer}).
 *
 * See [the copy/paste demo](@/guides/cell-features/clipboard.md) for examples.
 *
 * @example
 * ```js
 * // Enables the plugin with default values
 * copyPaste: true,
 * // Enables the plugin with custom values
 * copyPaste: {
 *   columnsLimit: 25,
 *   rowsLimit: 50,
 *   pasteMode: 'shift_down',
 *   copyColumnHeaders: true,
 *   copyColumnGroupHeaders: true,
 *   copyColumnHeadersOnly: true,
 *   uiContainer: document.body,
 * },
 * ```
 * @class CopyPaste
 * @plugin CopyPaste
 */
export class CopyPaste extends BasePlugin {
  static get PLUGIN_KEY() {
    return PLUGIN_KEY;
  }

  static get SETTING_KEYS() {
    return [
      PLUGIN_KEY,
      ...SETTING_KEYS
    ];
  }

  static get PLUGIN_PRIORITY() {
    return PLUGIN_PRIORITY;
  }

  /**
   * Maximum number of columns than can be copied to clipboard using <kbd>**Ctrl**</kbd>/<kbd>**Cmd**</kbd> + <kbd>**C**</kbd>.
   *
   * @type {number}
   * @default Infinity
   */
  columnsLimit = Infinity;
  /**
   * Maximum number of rows than can be copied to clipboard using <kbd>**Ctrl**</kbd>/<kbd>**Cmd**</kbd> + <kbd>**C**</kbd>.
   *
   * @type {number}
   * @default Infinity
   */
  rowsLimit = Infinity;
  /**
   * Defines paste (<kbd>**Ctrl**</kbd>/<kbd>**Cmd**</kbd> + <kbd>**V**</kbd>) behavior.
   * * Default value `"overwrite"` will paste clipboard value over current selection.
   * * When set to `"shift_down"`, clipboard data will be pasted in place of current selection, while all selected cells are moved down.
   * * When set to `"shift_right"`, clipboard data will be pasted in place of current selection, while all selected cells are moved right.
   *
   * @type {string}
   * @default 'overwrite'
   */
  pasteMode = 'overwrite';
  /**
   * UI container for the secondary focusable element.
   *
   * @type {HTMLElement}
   */
  uiContainer = this.hot.rootDocument.body;
  /**
   * Shows the "Copy with column headers" item in the context menu and extends the context menu for
   * `'copy_with_column_headers'` option that can be used for creating custom menus arrangements.
   *
   * @type {boolean}
   * @default false
   */
  #enableCopyColumnHeaders = false;
  /**
   * Shows the "Copy with column group headers" item in the context menu and extends the context menu for
   * `'copy_with_column_group headers'` option that can be used for creating custom menus arrangements.
   *
   * @type {boolean}
   * @default false
   */
  #enableCopyColumnGroupHeaders = false;
  /**
   * Shows the "Copy column headers only" item in the context menu and extends the context menu for
   * `'copy_column_headers_only'` option that can be used for creating custom menus arrangements.
   *
   * @type {boolean}
   * @default false
   */
  #enableCopyColumnHeadersOnly = false;
  /**
   * Defines the data range to copy. Possible values:
   *  * `'cells-only'` Copy selected cells only;
   *  * `'column-headers-only'` Copy column headers only;
   *  * `'with-all-column-headers'` Copy cells with all column headers;
   *  * `'with-column-headers'` Copy cells with column headers;
   *
   * @type {'cells-only' | 'column-headers-only' | 'with-all-column-headers' | 'with-column-headers'}
   */
  #copyMode = 'cells-only';
  /**
   * Flag that is used to prevent copying when the native shortcut was not pressed.
   *
   * @type {boolean}
   */
  #isTriggeredByCopy = false;
  /**
   * Flag that is used to prevent cutting when the native shortcut was not pressed.
   *
   * @type {boolean}
   */
  #isTriggeredByCut = false;
  /**
   * Class that helps generate copyable ranges based on the current selection for different copy mode
   * types.
   *
   * @type {CopyableRangesFactory}
   */
  #copyableRangesFactory = new CopyableRangesFactory({
    countRows: () => this.hot.countRows(),
    countColumns: () => this.hot.countCols(),
    rowsLimit: () => this.rowsLimit,
    columnsLimit: () => this.columnsLimit,
    countColumnHeaders: () => this.hot.view.getColumnHeadersCount(),
  });
  /**
   * Ranges of the cells coordinates, which should be used to copy/cut/paste actions.
   *
   * @private
   * @type {Array<{startRow: number, startCol: number, endRow: number, endCol: number}>}
   */
  copyableRanges = [];
  /**
   * Provides focusable element to support IME and copy/paste/cut actions.
   *
   * @private
   * @type {FocusableWrapper}
   */
  focusableElement = void 0;

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` then the {@link CopyPaste#enablePlugin} method is called.
   *
   * @returns {boolean}
   */
  isEnabled() {
    return !!this.hot.getSettings()[PLUGIN_KEY];
  }

  /**
   * Enables the plugin functionality for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }
    const { [PLUGIN_KEY]: settings } = this.hot.getSettings();

    if (typeof settings === 'object') {
      this.pasteMode = settings.pasteMode ?? this.pasteMode;
      this.rowsLimit = isNaN(settings.rowsLimit) ? this.rowsLimit : settings.rowsLimit;
      this.columnsLimit = isNaN(settings.columnsLimit) ? this.columnsLimit : settings.columnsLimit;
      this.#enableCopyColumnHeaders = !!settings.copyColumnHeaders;
      this.#enableCopyColumnGroupHeaders = !!settings.copyColumnGroupHeaders;
      this.#enableCopyColumnHeadersOnly = !!settings.copyColumnHeadersOnly;
      this.uiContainer = settings.uiContainer ?? this.uiContainer;
    }

    this.addHook('afterContextMenuDefaultOptions', options => this.onAfterContextMenuDefaultOptions(options));
    this.addHook('afterOnCellMouseUp', () => this.onAfterOnCellMouseUp());
    this.addHook('afterSelectionEnd', () => this.onAfterSelectionEnd());
    this.addHook('beforeKeyDown', () => this.onBeforeKeyDown());

    this.focusableElement = createElement(this.uiContainer);
    this.focusableElement
      .addLocalHook('copy', event => this.onCopy(event))
      .addLocalHook('cut', event => this.onCut(event))
      .addLocalHook('paste', event => this.onPaste(event));

    super.enablePlugin();
  }

  /**
   * Updates the plugin's state.
   *
   * This method is executed when [`updateSettings()`](@/api/core.md#updatesettings) is invoked with any of the following configuration options:
   *  - [`copyPaste`](@/api/options.md#copypaste)
   *  - [`fragmentSelection`](@/api/options.md#fragmentselection)
   */
  updatePlugin() {
    this.disablePlugin();
    this.enablePlugin();
    this.getOrCreateFocusableElement();

    super.updatePlugin();
  }

  /**
   * Disables the plugin functionality for this Handsontable instance.
   */
  disablePlugin() {
    if (this.focusableElement) {
      destroyElement(this.focusableElement);
    }

    super.disablePlugin();
  }

  /**
   * Copies the selected cell with or without column headers into the clipboard.
   *
   * @param {'cells-only' | 'column-headers-only' | 'with-all-column-headers' | 'with-column-headers'} [copyMode='cells-only']
   * Defines the data range to copy. Possible values: `cells-only` (copy selected cells only),
   * `column-headers-only` (copy the most-bottom column headers only), `with-all-column-headers` (copy cells
   * with all column headers levels) or `with-column-headers` (copy cells with the most-bottom column headers).
   */
  copy(copyMode = 'cells-only') {
    this.#copyMode = copyMode;
    this.#isTriggeredByCopy = true;
    this.getOrCreateFocusableElement();
    this.focusableElement.focus();
    this.hot.rootDocument.execCommand('copy');
  }

  /**
   * Copies the selected cell/cells into the clipboard.
   */
  copyCellsOnly() {
    this.copy('cells-only');
  }
  /**
   * Copies only the most-bottom column headers into the clipboard.
   */
  copyColumnHeadersOnly() {
    this.copy('column-headers-only');
  }
  /**
   * Copies the selected cell/cells and all column headers levels (including column group) into the clipboard.
   */
  copyWithAllColumnHeaders() {
    this.copy('with-column-group-headers');
  }
  /**
   * Copies the selected cell/cells and most-bottom column headers into the clipboard.
   */
  copyWithColumnHeaders() {
    this.copy('with-column-headers');
  }

  /**
   * Cuts the selected cell into the clipboard.
   */
  cut() {
    this.#isTriggeredByCut = true;
    this.getOrCreateFocusableElement();
    this.focusableElement.focus();
    this.hot.rootDocument.execCommand('cut');
  }

  /**
   * Creates copyable text related to range objects.
   *
   * @param {Array<{startRow: number, startCol: number, endRow: number, endCol: number}>} ranges Array of objects with properties `startRow`, `endRow`, `startCol` and `endCol`.
   * @returns {string} Returns string which will be copied into clipboard.
   */
  getRangedCopyableData(ranges) {
    return stringify(this.getRangedData(ranges));
  }

  /**
   * Creates copyable text related to range objects.
   *
   * @param {Array<{startRow: number, startCol: number, endRow: number, endCol: number}>} ranges Array of objects with properties `startRow`, `startCol`, `endRow` and `endCol`.
   * @returns {Array[]} Returns array of arrays which will be copied into clipboard.
   */
  getRangedData(ranges) {
    const data = [];
    const { rows, columns } = normalizeRanges(ranges);

    // Concat all rows and columns data defined in ranges into one copyable string
    arrayEach(rows, (row) => {
      const rowSet = [];

      arrayEach(columns, (column) => {
        if (row < 0) {
          // 'row' as the second argument act here as 'headerLevel' argument
          rowSet.push(this.hot.getColHeader(column, row));
        } else {
          rowSet.push(this.hot.getCopyableData(row, column));
        }
      });

      data.push(rowSet);
    });

    return data;
  }

  /**
   * Simulates the paste action.
   *
   * Due to security reasons, modern browsers disallow reading from the system clipboard.
   *
   * @param {string} pastableText Value as raw string to paste.
   * @param {string} [pastableHtml=''] Value as HTML to paste.
   */
  paste(pastableText = '', pastableHtml = pastableText) {
    if (!pastableText && !pastableHtml) {
      return;
    }

    const pasteData = new PasteEvent();

    if (pastableText) {
      pasteData.clipboardData.setData('text/plain', pastableText);
    }
    if (pastableHtml) {
      pasteData.clipboardData.setData('text/html', pastableHtml);
    }

    this.getOrCreateFocusableElement();
    this.onPaste(pasteData);
  }

  /**
   * Prepares copyable text from the cells selection in the invisible textarea.
   */
  setCopyableText() {
    const selectionRange = this.hot.getSelectedRangeLast();

    if (!selectionRange) {
      return;
    }

    this.#copyableRangesFactory.setSelectedRange(selectionRange);

    const groupedRanges = new Map([
      ['headers', null],
      ['cells', null],
    ]);

    if (this.#copyMode === 'column-headers-only') {
      groupedRanges.set('headers', this.#copyableRangesFactory.getMostBottomColumnHeadersRange());

    } else {
      if (this.#copyMode === 'with-column-headers') {
        groupedRanges.set('headers', this.#copyableRangesFactory.getMostBottomColumnHeadersRange());

      } else if (this.#copyMode === 'with-column-group-headers') {
        groupedRanges.set('headers', this.#copyableRangesFactory.getAllColumnHeadersRange());
      }

      groupedRanges.set('cells', this.#copyableRangesFactory.getCellsRange());
    }

    this.copyableRanges = Array.from(groupedRanges.values())
      .filter(range => range !== null)
      .map(({ startRow, startCol, endRow, endCol }) => ({ startRow, startCol, endRow, endCol }));

    this.copyableRanges = this.hot.runHooks('modifyCopyableRange', this.copyableRanges);

    const cellsRange = groupedRanges.get('cells');

    if (cellsRange !== null && cellsRange.isRangeTrimmed) {
      const {
        startRow, startCol, endRow, endCol
      } = cellsRange;

      this.hot.runHooks('afterCopyLimit',
        endRow - startRow + 1, endCol - startCol + 1, this.rowsLimit, this.columnsLimit);
    }
  }

  /**
   * Force focus on editable element.
   *
   * @private
   */
  getOrCreateFocusableElement() {
    const editableElement = this.hot.getActiveEditor()?.TEXTAREA;

    if (editableElement) {
      this.focusableElement.setFocusableElement(editableElement);
    } else {
      this.focusableElement.useSecondaryElement();
    }
  }

  /**
   * Verifies if editor exists and is open.
   *
   * @private
   * @returns {boolean}
   */
  isEditorOpened() {
    return this.hot.getActiveEditor()?.isOpened();
  }

  /**
   * Counts how many column headers will be copied based on the passed range.
   *
   * @private
   * @param {Array<{startRow: number, startCol: number, endRow: number, endCol: number}>} ranges Array of objects with properties `startRow`, `startCol`, `endRow` and `endCol`.
   * @returns {{ columnHeadersCount: number }} Returns an object with keys that holds
   *                                           information with the number of copied headers.
   */
  #countCopiedHeaders(ranges) {
    const { rows } = normalizeRanges(ranges);
    let columnHeadersCount = 0;

    for (let row = 0; row < rows.length; row++) {
      if (rows[row] >= 0) {
        break;
      }

      columnHeadersCount += 1;
    }

    return {
      columnHeadersCount,
    };
  }

  /**
   * Prepares new values to populate them into datasource.
   *
   * @private
   * @param {Array} inputArray An array of the data to populate.
   * @param {Array} [selection] The selection which indicates from what position the data will be populated.
   * @returns {Array} Range coordinates after populate data.
   */
  populateValues(inputArray, selection = this.hot.getSelectedRangeLast()) {
    if (!inputArray.length) {
      return;
    }

    const populatedRowsLength = inputArray.length;
    const populatedColumnsLength = inputArray[0].length;
    const newRows = [];

    const { row: startRow, col: startColumn } = selection.getTopStartCorner();
    const { row: endRowFromSelection, col: endColumnFromSelection } = selection.getBottomEndCorner();

    let visualRowForPopulatedData = startRow;
    let visualColumnForPopulatedData = startColumn;
    let lastVisualRow = startRow;
    let lastVisualColumn = startColumn;

    // We try to populate just all copied data or repeat copied data within a selection. Please keep in mind that we
    // don't know whether populated data is bigger than selection on start as there are some cells for which values
    // should be not inserted (it's known right after getting cell meta).
    while (newRows.length < populatedRowsLength || visualRowForPopulatedData <= endRowFromSelection) {
      const { skipRowOnPaste, visualRow } = this.hot.getCellMeta(visualRowForPopulatedData, startColumn);

      visualRowForPopulatedData = visualRow + 1;

      if (skipRowOnPaste === true) {
        /* eslint-disable no-continue */
        continue;
      }

      lastVisualRow = visualRow;
      visualColumnForPopulatedData = startColumn;

      const newRow = [];
      const insertedRow = newRows.length % populatedRowsLength;

      while (newRow.length < populatedColumnsLength || visualColumnForPopulatedData <= endColumnFromSelection) {
        const { skipColumnOnPaste, visualCol } = this.hot.getCellMeta(startRow, visualColumnForPopulatedData);

        visualColumnForPopulatedData = visualCol + 1;

        if (skipColumnOnPaste === true) {
          /* eslint-disable no-continue */
          continue;
        }

        lastVisualColumn = visualCol;
        const insertedColumn = newRow.length % populatedColumnsLength;

        newRow.push(inputArray[insertedRow][insertedColumn]);
      }

      newRows.push(newRow);
    }

    this.hot.populateFromArray(startRow, startColumn, newRows, void 0, void 0, 'CopyPaste.paste', this.pasteMode);

    return [startRow, startColumn, lastVisualRow, lastVisualColumn];
  }

  /**
   * `copy` event callback on textarea element.
   *
   * @param {Event} event ClipboardEvent.
   * @private
   */
  onCopy(event) {
    if ((!this.hot.isListening() && !this.#isTriggeredByCopy) || this.isEditorOpened()) {
      return;
    }

    this.setCopyableText();
    this.#isTriggeredByCopy = false;

    const data = this.getRangedData(this.copyableRanges);
    const copiedHeadersCount = this.#countCopiedHeaders(this.copyableRanges);
    const allowCopying = !!this.hot.runHooks('beforeCopy', data, this.copyableRanges, copiedHeadersCount);

    if (allowCopying) {
      const textPlain = stringify(data);

      if (event && event.clipboardData) {
        const textHTML = _dataToHTML(data, this.hot.rootDocument);

        event.clipboardData.setData('text/plain', textPlain);
        event.clipboardData.setData('text/html', [META_HEAD, textHTML].join(''));

      } else if (typeof ClipboardEvent === 'undefined') {
        this.hot.rootWindow.clipboardData.setData('Text', textPlain);
      }

      this.hot.runHooks('afterCopy', data, this.copyableRanges, copiedHeadersCount);
    }

    this.#copyMode = 'cells-only';
    event.preventDefault();
  }

  /**
   * `cut` event callback on textarea element.
   *
   * @param {Event} event ClipboardEvent.
   * @private
   */
  onCut(event) {
    if ((!this.hot.isListening() && !this.#isTriggeredByCut) || this.isEditorOpened()) {
      return;
    }

    this.setCopyableText();
    this.#isTriggeredByCut = false;

    const rangedData = this.getRangedData(this.copyableRanges);
    const allowCuttingOut = !!this.hot.runHooks('beforeCut', rangedData, this.copyableRanges);

    if (allowCuttingOut) {
      const textPlain = stringify(rangedData);

      if (event && event.clipboardData) {
        const textHTML = _dataToHTML(rangedData, this.hot.rootDocument);

        event.clipboardData.setData('text/plain', textPlain);
        event.clipboardData.setData('text/html', [META_HEAD, textHTML].join(''));

      } else if (typeof ClipboardEvent === 'undefined') {
        this.hot.rootWindow.clipboardData.setData('Text', textPlain);
      }

      this.hot.emptySelectedCells('CopyPaste.cut');
      this.hot.runHooks('afterCut', rangedData, this.copyableRanges);
    }

    event.preventDefault();
  }

  /**
   * `paste` event callback on textarea element.
   *
   * @param {Event} event ClipboardEvent or pseudo ClipboardEvent, if paste was called manually.
   * @private
   */
  onPaste(event) {
    if (!this.hot.isListening() || this.isEditorOpened()) {
      return;
    }

    if (event && event.preventDefault) {
      event.preventDefault();
    }

    let pastedData;

    if (event && typeof event.clipboardData !== 'undefined') {
      const textHTML = sanitize(event.clipboardData.getData('text/html'), {
        ADD_TAGS: ['meta'],
        ADD_ATTR: ['content'],
        FORCE_BODY: true,
      });

      if (textHTML && /(<table)|(<TABLE)/g.test(textHTML)) {
        const parsedConfig = htmlToGridSettings(textHTML, this.hot.rootDocument);

        pastedData = parsedConfig.data;
      } else {
        pastedData = event.clipboardData.getData('text/plain');
      }

    } else if (typeof ClipboardEvent === 'undefined' && typeof this.hot.rootWindow.clipboardData !== 'undefined') {
      pastedData = this.hot.rootWindow.clipboardData.getData('Text');
    }

    if (typeof pastedData === 'string') {
      pastedData = parse(pastedData);
    }

    if (pastedData && pastedData.length === 0) {
      return;
    }

    if (this.hot.runHooks('beforePaste', pastedData, this.copyableRanges) === false) {
      return;
    }

    const [startRow, startColumn, endRow, endColumn] = this.populateValues(pastedData);

    this.hot.selectCell(
      startRow,
      startColumn,
      Math.min(this.hot.countRows() - 1, endRow),
      Math.min(this.hot.countCols() - 1, endColumn),
    );

    this.hot.runHooks('afterPaste', pastedData, this.copyableRanges);
  }

  /**
   * Add copy and cut options to the Context Menu.
   *
   * @private
   * @param {object} options Contains default added options of the Context Menu.
   */
  onAfterContextMenuDefaultOptions(options) {
    options.items.push(
      { name: '---------' },
      copyItem(this),
    );

    if (this.#enableCopyColumnHeaders) {
      options.items.push(
        copyWithColumnHeadersItem(this),
      );
    }
    if (this.#enableCopyColumnGroupHeaders) {
      options.items.push(
        copyWithColumnGroupHeadersItem(this),
      );
    }
    if (this.#enableCopyColumnHeadersOnly) {
      options.items.push(
        copyColumnHeadersOnlyItem(this),
      );
    }

    options.items.push(cutItem(this));
  }

  /**
   * Force focus on focusableElement.
   *
   * @private
   */
  onAfterOnCellMouseUp() {
    // Changing focused element will remove current selection. It's unnecessary in case when we give possibility
    // for fragment selection
    if (!this.hot.isListening() || this.isEditorOpened() || this.hot.getSettings().fragmentSelection) {
      return;
    }

    this.getOrCreateFocusableElement();
    this.focusableElement.focus();
  }

  /**
   * Force focus on focusableElement after end of the selection.
   *
   * @private
   */
  onAfterSelectionEnd() {
    if (this.isEditorOpened()) {
      return;
    }

    this.getOrCreateFocusableElement();

    if (this.hot.getSettings().fragmentSelection &&
        this.focusableElement.getFocusableElement() !== this.hot.rootDocument.activeElement && getSelectionText()) {
      return;
    }

    this.setCopyableText();
    this.focusableElement.focus();
  }

  /**
   * `beforeKeyDown` listener to force focus of focusableElement.
   *
   * @private
   */
  onBeforeKeyDown() {
    if (!this.hot.isListening() || this.isEditorOpened()) {
      return;
    }
    const activeElement = this.hot.rootDocument.activeElement;
    const activeEditor = this.hot.getActiveEditor();

    if (!activeEditor ||
        (activeElement !== this.focusableElement.getFocusableElement() && activeElement !== activeEditor.select)) {
      return;
    }

    this.getOrCreateFocusableElement();
    this.focusableElement.focus();
  }

  /**
   * Destroys the plugin instance.
   */
  destroy() {
    if (this.focusableElement) {
      destroyElement(this.focusableElement);
      this.focusableElement = null;
    }

    super.destroy();
  }
}
