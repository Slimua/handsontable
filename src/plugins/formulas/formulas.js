// TODO remove hot-formula-parser

import { HyperFormula } from 'hyperformula';
import { BasePlugin } from '../base';

export const PLUGIN_KEY = 'formulas';
export const PLUGIN_PRIORITY = 260;

/**
 * The formulas plugin.
 *
 * @plugin Formulas
 */
export class Formulas extends BasePlugin {
  static get PLUGIN_KEY() {
    return PLUGIN_KEY;
  }

  static get PLUGIN_PRIORITY() {
    return PLUGIN_PRIORITY;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link Formulas#enablePlugin} method is called.
   *
   * @returns {boolean}
   */
  isEnabled() {
    /* eslint-disable no-unneeded-ternary */
    return this.hot.getSettings()[PLUGIN_KEY] ? true : false;
  }

  /**
   * Enables the plugin functionality for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }

    // TODO use this
    // const settings = this.hot.getSettings()[PLUGIN_KEY];

    /**
     * The HyperFormula instance that will be used for this instance of Handsontable.
     *
     * @type {HyperFormula}
     */
    this.hyperformula = HyperFormula.buildEmpty({
      licenseKey: 'non-commercial-and-evaluation' // TODO
    });

    this.sheetName = this.hyperformula.addSheet();

    this.addHook('afterLoadData', (...args) => this.onAfterLoadData(...args));
    this.addHook('modifyData', (...args) => this.onModifyData(...args));
    this.addHook('modifySourceData', (...args) => this.onModifySourceData(...args));

    // TODO test if the `before` hook will actually block operations
    this.addHook('beforeCreateRow', (...args) => this.onBeforeCreateRow(...args));
    this.addHook('beforeCreateCol', (...args) => this.onBeforeCreateCol(...args));

    this.addHook('afterCreateRow', (...args) => this.onAfterCreateRow(...args));
    this.addHook('afterCreateCol', (...args) => this.onAfterCreateCol(...args));

    this.addHook('beforeRemoveRow', (...args) => this.onBeforeRemoveRow(...args));
    this.addHook('beforeRemoveCol', (...args) => this.onBeforeRemoveCol(...args));

    this.addHook('afterRemoveRow', (...args) => this.onAfterRemoveRow(...args));
    this.addHook('afterRemoveCol', (...args) => this.onAfterRemoveCol(...args));

    // this.addHook('beforeAutofill', (start, end, data) => {
    // })

    // this.addHook('modifyAutofillRange', (startArea, entireArea) => {
    //   console.log(startArea, entireArea)
    //   startArea[3] = 4
    // })

    // this.addHook('beforeAutofillInsidePopulate', (index, dir, inp, del) => {
    //   console.log(del)
    // })

    this.addHook('beforeAutofill', (start, end) => {
      //console.log(start, end)
      // this.hyperformula.copy()
      // this.hyperformula.copy(start, )
    })

    // Abuse the `modifyAutofillRange` hook to get the autofill start
    // coordinates.
    this.addHook('modifyAutofillRange', (_ , entireArea) => {
      console.log('modifyAutofillRange')
      const [startRow, startCol, endRow, endCol] = entireArea;

      const width = Math.abs(startCol - endCol) + 1
      const height = Math.abs(startRow - endRow) + 1

      console.log('width', width)
      console.log('height', height)

      this.hyperformula.copy({
        sheet: this.hyperformula.getSheetId(this.sheetName),
        row: startRow,
        col: startCol
      }, width, height)
    })

    this.addHook('afterAutofill', (start, end) => {
      // Fill out the cells inside HF using its clipboard.
      // this.hyperformula.paste({
      //   sheet: this.hyperformula.getSheetId(this.sheetName),
      //   row: start.row,
      //   col: start.col
      // })
      // console.log(start, end, data)
      this.hot.render()
    })

    // Abuse this hook to easily figure out the direction of the
    // autofill
    this.addHook('beforeAutofillInsidePopulate', (index, direction, input) => {
      //console.log('deltas', deltas)
      // deltas[0][0] = 'turbo'
      console.log('index', index)

      return {value: `=5 + 5`}
    })

    super.enablePlugin();
  }

  /**
   * Disables the plugin functionality for this Handsontable instance.
   */
  disablePlugin() {
    // TODO add tests for this line
    this.hyperformula.destroy();

    super.disablePlugin();
  }

  /**
   * Destroys the plugin instance.
   */
  destroy() {
    super.destroy();
  }

  onAfterLoadData(data) {
    if (!this.enabled) {
      return;
    }

    this.hyperformula.setSheetContent(this.sheetName, this.hot.getSourceDataArray());
  }

  onModifyData(row, column, valueHolder, ioMode) {
    if (!this.enabled) {
      // TODO check if this line is actually ever reached
      return;
    }

    const address = {
      row: this.hot.toVisualRow(row),
      col: column,
      sheet: this.hyperformula.getSheetId(this.sheetName)
    };

    if (ioMode === 'get') {
      const cellValue = this.hyperformula.getCellValue(address);

      // If `cellValue` is an object it is expected to be an error
      const value = (typeof cellValue === 'object' && cellValue !== null) ? cellValue.value : cellValue;

      // Omit the leading `'` from presentation, and all `getData` operations
      const prettyValue = typeof value === 'string' ? (value.indexOf('\'') === 0 ? value.slice(1) : value) : value;

      valueHolder.value = prettyValue;
    } else {
      this.hyperformula.setCellContents(address, valueHolder.value);
    }
  }

  onModifySourceData(row, col, valueHolder, ioMode) {
    if (!this.enabled) {
      return;
    }

    const dimensions = this.hyperformula.getSheetDimensions(this.hyperformula.getSheetId(this.sheetName));

    // Don't actually change the source data if HyperFormula is not
    // initialized yet. This is done to allow the `afterLoadData` hook to
    // load the existing source data with `Handsontable#getSourceDataArray`
    // properly.
    if (dimensions.width === 0 && dimensions.height === 0) {
      return;
    }

    const address = {
      row: this.hot.toVisualRow(row),
      col,
      sheet: this.hyperformula.getSheetId(this.sheetName)
    };

    if (ioMode === 'get') {
      valueHolder.value = this.hyperformula.getCellSerialized(address);
    } else if (ioMode === 'set') {
      this.hyperformula.setCellContents(address, valueHolder.value);
    }
  }

  onBeforeCreateRow(row, amount) {
    return this.hyperformula.isItPossibleToAddRows(this.hyperformula.getSheetId(this.sheetName), [row, amount]);
  }

  onBeforeCreateCol(col, amount) {
    return this.hyperformula.isItPossibleToAddColumns(this.hyperformula.getSheetId(this.sheetName), [col, amount]);
  }

  onAfterCreateRow(row, amount) {
    this.hyperformula.addRows(this.hyperformula.getSheetId(this.sheetName), [row, amount]);
  }

  onAfterCreateCol(col, amount) {
    this.hyperformula.addColumns(this.hyperformula.getSheetId(this.sheetName), [col, amount]);
  }

  onBeforeRemoveRow(row, amount) {
    return this.hyperformula.isItPossibleToRemoveRows(this.hyperformula.getSheetId(this.sheetName), [row, amount]);
  }

  onBeforeRemoveCol(col, amount) {
    return this.hyperformula.isItPossibleToRemoveRows(this.hyperformula.getSheetId(this.sheetName), [col, amount]);
  }

  onAfterRemoveRow(row, amount) {
    this.hyperformula.removeRows(this.hyperformula.getSheetId(this.sheetName), [row, amount]);
  }

  onAfterRemoveCol(col, amount) {
    this.hyperformula.removeColumns(this.hyperformula.getSheetId(this.sheetName), [col, amount]);
  }
}
