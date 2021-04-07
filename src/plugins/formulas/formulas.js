// big work in progress.
// TODO remove hot-formula-parser

import { BasePlugin } from '../base';
import staticRegister from '../../utils/staticRegister';
import hyperformulaDefaultSettings from './hfDefaultSettings';
import { registerHF } from './hyperformulaSetup';

export const PLUGIN_KEY = 'formulas';
export const PLUGIN_PRIORITY = 260;

registerHF();

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

    /**
     * Plugin settings.
     */
    this.settings = this.hot.getSettings()[PLUGIN_KEY];

    /**
     * Static register used to set up one global HyperFormula instance.
     *
     * @type {object}
     */
    this.staticRegister = staticRegister('formulas');

    /**
     * The HyperFormula instance that will be used for this instance of Handsontable.
     *
     * @type {HyperFormula}
     */
    this.hyperformula = this.staticRegister.getItem('hyperformula');

    /**
     * HyperFormula's sheet name.
     *
     * @type {string}
     */
    this.sheetName = this.hyperformula.addSheet();

    /**
     * HyperFormula's sheet id.
     *
     * @type {number}
     */
    this.sheetId = this.hyperformula.getSheetId(this.sheetName);

    /**
     * Flag used to retrieve the data straight from Handsontable.
     *
     * @type {boolean}
     */
    this.skipHF = false;

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

    // HyperFormula events:
    this.hyperformula.on('valuesUpdated', (...args) => this.onHFvaluesUpdated(...args));

    // TODO list out hooks from my local plugin/old plugin/todo

    this.applyHFSettings();

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
   * Triggered on `updateSettings`.
   */
  updatePlugin() {
    this.applyHFSettings();

    super.updatePlugin();
  }

  /**
   * Destroys the plugin instance.
   */
  destroy() {
    super.destroy();
  }

  /**
   * Applies the settings passed to the plugin to the HF instance.
   */
  applyHFSettings() {
    const hotSettings = this.hot.getSettings();
    const hfConfig = this.settings.hyperFormulaConfig;

    if (hfConfig) {
      this.hyperformula.updateConfig({
        ...hyperformulaDefaultSettings,
        ...hfConfig,
        maxColumns: hotSettings.maxColumns,
        maxRows: hotSettings.maxRows,
        licenseKey: hotSettings.licenseKey
      });
    }
  }

  /**
   * `afterLoadData` hook callback.
   */
  onAfterLoadData() {
    if (!this.isEnabled()) {
      return;
    }

    const hotSettings = this.hot.getSettings();
    const pluginSettings = hotSettings.formulas;
    const sheetName = pluginSettings.sheetName;

    if (sheetName) {
      this.sheetName = sheetName;
      this.hyperformula.renameSheet(this.sheetId, sheetName);
    }

    this.skipHF = true;
    this.hyperformula.setSheetContent(this.sheetName, this.hot.getSourceDataArray());
    this.skipHF = false;
  }

  onModifyData(row, column, valueHolder, ioMode) {
    if (!this.enabled || this.skipHF) {
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
    if (!this.isEnabled() || this.skipHF) {
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

  /**
   * HyperFormula's `valuesUpdated` event callback.
   *
   * @param {Array} changes Array of objects containing information about HF changes.
   */
  onHFvaluesUpdated(changes) {
    let isAffectedByChange = false;

    changes.some((change) => {
      isAffectedByChange = change.address.sheet === this.sheetId;

      return isAffectedByChange;
    });

    if (isAffectedByChange) {
      this.hot.render();
    }
  }
}
