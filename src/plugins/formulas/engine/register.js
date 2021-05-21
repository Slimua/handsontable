import staticRegister from '../../../utils/staticRegister';
import { isUndefined } from '../../../helpers/mixed';
import { warn } from '../../../helpers/console';
import { PLUGIN_KEY } from '../formulas';
import { DEFAULT_LICENSE_KEY, getEngineSettingsWithDefaultsAndOverrides } from './settings';

/**
 * Setups the engine instance. It either creates a new (possibly shared) engine instance, or attaches
 * the plugin to an already-existing instance.
 *
 * @param {object} hotSettings Object containing the Handsontable settings.
 * @param {string} hotId Handsontable guid.
 * @returns {null|object} Returns the engine instance if everything worked right and `null` otherwise.
 */
export function setupEngine(hotSettings, hotId) {
  const pluginSettings = hotSettings[PLUGIN_KEY];
  const engineConfigItem = pluginSettings?.engine;

  if (pluginSettings === true) {
    return null;
  }

  if (isUndefined(engineConfigItem)) {
    return null;
  }

  // `engine.hyperformula` or `engine` is the engine class
  if (typeof engineConfigItem.hyperformula === 'function' || typeof engineConfigItem === 'function') {
    return registerEngine(
      engineConfigItem.hyperformula ?? engineConfigItem,
      hotSettings,
      hotId);

    // `engine` is the engine instance
  } else if (typeof engineConfigItem === 'object' && isUndefined(engineConfigItem.hyperformula)) {
    const engineRegistry = staticRegister(PLUGIN_KEY).getItem('engine');
    const sharedEngineUsage = engineRegistry?.get(engineConfigItem);

    if (sharedEngineUsage) {
      sharedEngineUsage.push(hotId);
    }

    if (!engineConfigItem.getConfig().licenseKey) {
      engineConfigItem.updateConfig({
        licenseKey: DEFAULT_LICENSE_KEY
      });
    }

    return engineConfigItem;
  }

  return null;
}

/**
 * Registers the engine in the global register and attaches the needed event listeners.
 *
 * @param {Function} engineClass The engine class.
 * @param {object} hotSettings The Handsontable settings.
 * @param {string} hotId Handsontable guid.
 * @returns {object} Returns the engine instance.
 */
export function registerEngine(engineClass, hotSettings, hotId) {
  if (!staticRegister(PLUGIN_KEY).hasItem('engine')) {
    staticRegister(PLUGIN_KEY).register('engine', new Map());
  }

  const pluginSettings = hotSettings[PLUGIN_KEY];
  const engineSettings = getEngineSettingsWithDefaultsAndOverrides(hotSettings);
  const engineRegistry = staticRegister(PLUGIN_KEY).getItem('engine');

  registerCustomFunctions(engineClass, pluginSettings.functions);

  registerLanguage(engineClass, pluginSettings.language);

  // Create instance
  const engineInstance = engineClass.buildEmpty(engineSettings);

  // Add it to global registry
  engineRegistry.set(engineInstance, [hotId]);

  registerNamedExpressions(engineInstance, pluginSettings.namedExpressions);

  // Add hooks needed for cross-referencing sheets
  engineInstance.on('sheetAdded', () => {
    engineInstance.rebuildAndRecalculate();
  });

  engineInstance.on('sheetRemoved', () => {
    engineInstance.rebuildAndRecalculate();
  });

  return engineInstance;
}

/**
 * Removes the HOT instance from the global register's engine usage array, and if there are no HOT instances left,
 * unregisters the engine itself.
 *
 * @param {object} engine The engine instance.
 * @param {string} hotId The Handsontable guid.
 */
export function unregisterEngine(engine, hotId) {
  if (engine) {
    const engineRegistry = staticRegister(PLUGIN_KEY).getItem('engine');
    const sharedEngineUsage = engineRegistry?.get(engine);

    if (sharedEngineUsage && sharedEngineUsage.includes(hotId)) {
      sharedEngineUsage.splice(sharedEngineUsage.indexOf(hotId), 1);

      if (sharedEngineUsage.length === 0) {
        engineRegistry.delete(engine);
        engine.destroy();
      }
    }
  }
}

/**
 * Registers the custom functions for the engine.
 *
 * @param {Function} engineClass The engine class.
 * @param {Array} customFunctions The custom functions array.
 */
export function registerCustomFunctions(engineClass, customFunctions) {
  if (customFunctions) {
    customFunctions.forEach((func) => {
      const {
        name,
        plugin,
        translations
      } = func;

      try {
        engineClass.registerFunction(name, plugin, translations);

      } catch (e) {
        warn(e.message);
      }
    });
  }
}

/**
 * Registers the provided language for the engine.
 *
 * @param {Function} engineClass The engine class.
 * @param {object} languageSetting The engine's language object.
 */
export function registerLanguage(engineClass, languageSetting) {
  if (languageSetting) {
    const {
      langCode,
    } = languageSetting;

    try {
      engineClass.registerLanguage(langCode, languageSetting);

    } catch (e) {
      warn(e.message);
    }
  }
}

/**
 * Registers the provided named expressions in the engine instance.
 *
 * @param {object} engineInstance The engine instance.
 * @param {Array} namedExpressions Array of the named expressions to be registered.
 */
export function registerNamedExpressions(engineInstance, namedExpressions) {
  if (namedExpressions) {
    engineInstance.suspendEvaluation();

    namedExpressions.forEach((namedExp) => {
      const {
        name,
        expression,
        scope,
        options
      } = namedExp;

      try {
        engineInstance.addNamedExpression(name, expression, scope, options);

      } catch (e) {
        warn(e.message);
      }
    });

    engineInstance.resumeEvaluation();
  }
}

/**
 * Sets up a new sheet.
 *
 * @param {object} engineInstance The engine instance.
 * @param {string} sheetName The new sheet name.
 * @returns {*}
 */
export function setupSheet(engineInstance, sheetName) {
  if (isUndefined(sheetName) || !engineInstance.doesSheetExist(sheetName)) {
    sheetName = engineInstance.addSheet(sheetName);
  }

  return sheetName;
}
