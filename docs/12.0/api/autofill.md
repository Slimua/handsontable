---
title: Autofill
metaTitle: Autofill - Plugin - Handsontable Documentation
permalink: /12.0/api/autofill
canonicalUrl: /api/autofill
hotPlugin: true
editLink: false
---

# Autofill

[[toc]]

## Description

This plugin provides "drag-down" and "copy-down" functionalities, both operated using the small square in the right
bottom of the cell selection.

"Drag-down" expands the value of the selected cells to the neighbouring cells when you drag the small
square in the corner.

"Copy-down" copies the value of the selection to all empty cells below when you double click the small square.


## Members

### autoInsertRow
  
::: source-code-link https://github.com/handsontable/handsontable/blob/92725e660e6a9b7df7b6d889aeab2022cbf4b4a7/handsontable/src/plugins/autofill/autofill.js#L96

:::

_autofill.autoInsertRow : boolean_

Specifies if can insert new rows if needed.


## Methods

### destroy
  
::: source-code-link https://github.com/handsontable/handsontable/blob/92725e660e6a9b7df7b6d889aeab2022cbf4b4a7/handsontable/src/plugins/autofill/autofill.js#L662

:::

_autofill.destroy()_

Destroys the plugin instance.



### disablePlugin
  
::: source-code-link https://github.com/handsontable/handsontable/blob/92725e660e6a9b7df7b6d889aeab2022cbf4b4a7/handsontable/src/plugins/autofill/autofill.js#L138

:::

_autofill.disablePlugin()_

Disables the plugin functionality for this Handsontable instance.



### enablePlugin
  
::: source-code-link https://github.com/handsontable/handsontable/blob/92725e660e6a9b7df7b6d889aeab2022cbf4b4a7/handsontable/src/plugins/autofill/autofill.js#L111

:::

_autofill.enablePlugin()_

Enables the plugin functionality for this Handsontable instance.



### isEnabled
  
::: source-code-link https://github.com/handsontable/handsontable/blob/92725e660e6a9b7df7b6d889aeab2022cbf4b4a7/handsontable/src/plugins/autofill/autofill.js#L104

:::

_autofill.isEnabled() ⇒ boolean_

Checks if the plugin is enabled in the Handsontable settings.



### updatePlugin
  
::: source-code-link https://github.com/handsontable/handsontable/blob/92725e660e6a9b7df7b6d889aeab2022cbf4b4a7/handsontable/src/plugins/autofill/autofill.js#L129

:::

_autofill.updatePlugin()_

Updates the plugin state. This method is executed when [Core#updateSettings](@/api/core.md#updatesettings) is invoked.


