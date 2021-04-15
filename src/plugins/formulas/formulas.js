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

    // Autofill hooks
    {
      // Scoped into this block instead of being on the whole class to prevent
      // other places from messing with it.
      const lastAutofillSource = { value: undefined };

      // Abuse the `modifyAutofillRange` hook to get the autofill start coordinates.
      this.addHook('modifyAutofillRange', (_, entireArea) => {
        const [startRow, startCol, endRow, endCol] = entireArea;

        lastAutofillSource.value = {
          start: {
            row: startRow,
            col: startCol
          },
          end: {
            row: endRow,
            col: endCol
          }
        };
      });

      // Abuse this hook to easily figure out the direction of the autofill
      this.addHook('beforeAutofillInsidePopulate', (index, direction, _input, _deltas, _, selected) => {
        const autofillTargetSize = {
          width: selected.col,
          height: selected.row
        };

        const autofillSourceSize = {
          width: Math.abs(lastAutofillSource.value.start.col - lastAutofillSource.value.end.col) + 1,
          height: Math.abs(lastAutofillSource.value.start.row - lastAutofillSource.value.end.row) + 1
        };

        const paste = (
          // The cell we're copy'ing to let HyperFormula adjust the references properly
          sourceCellCoordinates,

          // The cell we're pasting into
          targetCellCoordinates
        ) => {
          this.hyperformula.copy({
            sheet: this.hyperformula.getSheetId(this.sheetName),
            row: sourceCellCoordinates.row,
            col: sourceCellCoordinates.col
          }, 1, 1);

          const [{ address }] = this.hyperformula.paste({
            sheet: this.hyperformula.getSheetId(this.sheetName),
            row: targetCellCoordinates.row,
            col: targetCellCoordinates.col
          });

          const value = this.hyperformula.getCellSerialized(address);

          return { value };
        };

        // Pretty much reimplements the logic from `src/plugins/autofill/autofill.js#fillIn`
        switch (direction) {
          case 'right': {
            const targetCellCoordinates = {
              row: lastAutofillSource.value.start.row + index.row,
              col: lastAutofillSource.value.start.col + index.col + autofillSourceSize.width
            };

            const sourceCellCoordinates = {
              row: lastAutofillSource.value.start.row + index.row,
              col: (index.col % autofillSourceSize.width) + lastAutofillSource.value.start.col
            };

            return paste(sourceCellCoordinates, targetCellCoordinates);
          }

          case 'left': {
            const targetCellCoordinates = {
              row: lastAutofillSource.value.start.row + index.row,
              col: lastAutofillSource.value.start.col + index.col - autofillTargetSize.width
            };

            const fillOffset = autofillTargetSize.width % autofillSourceSize.width;

            const sourceCellCoordinates = {
              row: lastAutofillSource.value.start.row + index.row,
              col:
                ((autofillSourceSize.width - fillOffset + index.col) %
                  autofillSourceSize.width) +
                lastAutofillSource.value.start.col,
            };

            return paste(sourceCellCoordinates, targetCellCoordinates);
          }

          case 'down': {
            const targetCellCoordinates = {
              row: lastAutofillSource.value.start.row + index.row + autofillSourceSize.height,
              col: lastAutofillSource.value.start.col + index.col
            };

            const sourceCellCoordinates = {
              row: (index.row % autofillSourceSize.height) + lastAutofillSource.value.start.row,
              col: lastAutofillSource.value.start.col + index.col
            };

            return paste(sourceCellCoordinates, targetCellCoordinates);
          }

          case 'up': {
            const targetCellCoordinates = {
              row: lastAutofillSource.value.start.row + index.row - autofillTargetSize.height,
              col: lastAutofillSource.value.start.col + index.col
            };

            const fillOffset = autofillTargetSize.height % autofillSourceSize.height;

            const sourceCellCoordinates = {
              row:
                ((autofillSourceSize.height - fillOffset + index.row) %
                  autofillSourceSize.height) +
                lastAutofillSource.value.start.row,
              col: lastAutofillSource.value.start.col + index.col,
            };

            return paste(sourceCellCoordinates, targetCellCoordinates);
          }

          default: {
            throw new Error('Unexpected direction parameter');
          }
        }
      });
    }

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

  onAfterLoadData() {
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
      const prettyValue = (() => {
        if (typeof value === 'string') {
          return value.indexOf('\'') === 0 ? value.slice(1) : value;
        }

        return value;
      })();

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
    if (!this.hyperformula.isItPossibleToAddRows(this.hyperformula.getSheetId(this.sheetName), [row, amount])) {
      return false;
    }
  }

  onBeforeCreateCol(col, amount) {
    if (!this.hyperformula.isItPossibleToAddColumns(this.hyperformula.getSheetId(this.sheetName), [col, amount])) {
      return false;
    }
  }

  onBeforeRemoveRow(row, amount) {
    if (!this.hyperformula.isItPossibleToRemoveRows(this.hyperformula.getSheetId(this.sheetName), [row, amount])) {
      return false;
    }
  }

  onBeforeRemoveCol(col, amount) {
    if (!this.hyperformula.isItPossibleToRemoveRows(this.hyperformula.getSheetId(this.sheetName), [col, amount])) {
      return false;
    }
  }

  onAfterCreateRow(row, amount) {
    this.hyperformula.addRows(this.hyperformula.getSheetId(this.sheetName), [row, amount]);
  }

  onAfterCreateCol(col, amount) {
    this.hyperformula.addColumns(this.hyperformula.getSheetId(this.sheetName), [col, amount]);
  }

  onAfterRemoveRow(row, amount) {
    this.hyperformula.removeRows(this.hyperformula.getSheetId(this.sheetName), [row, amount]);
  }

  onAfterRemoveCol(col, amount) {
    this.hyperformula.removeColumns(this.hyperformula.getSheetId(this.sheetName), [col, amount]);
  }
}
