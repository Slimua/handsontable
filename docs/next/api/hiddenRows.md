---
title: HiddenRows
permalink: /next/api/hidden-rows
canonicalUrl: /api/hidden-rows
editLink: false
---

# HiddenRows

[[toc]]

## Description

Plugin allows to hide certain rows. The hiding is achieved by rendering the rows with height set as 0px.
The plugin not modifies the source data and do not participate in data transformation (the shape of data returned
by `getData*` methods stays intact).

Possible plugin settings:
 * `copyPasteEnabled` as `Boolean` (default `true`)
 * `rows` as `Array`
 * `indicators` as `Boolean` (default `false`).

**Example**  
```js
const container = document.getElementById('example');
const hot = new Handsontable(container, {
  data: getData(),
  hiddenRows: {
    copyPasteEnabled: true,
    indicators: true,
    rows: [1, 2, 5]
  }
});

// access to hiddenRows plugin instance
const hiddenRowsPlugin = hot.getPlugin('hiddenRows');

// show single row
hiddenRowsPlugin.showRow(1);

// show multiple rows
hiddenRowsPlugin.showRow(1, 2, 9);

// or as an array
hiddenRowsPlugin.showRows([1, 2, 9]);

// hide single row
hiddenRowsPlugin.hideRow(1);

// hide multiple rows
hiddenRowsPlugin.hideRow(1, 2, 9);

// or as an array
hiddenRowsPlugin.hideRows([1, 2, 9]);

// rerender the table to see all changes
hot.render();
```

## Methods

### destroy
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L461
  

_hiddenRows.destroy()_
Destroys the plugin instance.



### disablePlugin
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L152
  

_hiddenRows.disablePlugin()_
Disables the plugin functionality for this Handsontable instance.



### enablePlugin
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L111
  

_hiddenRows.enablePlugin()_
Enables the plugin functionality for this Handsontable instance.



### getHiddenRows
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L260
  

_hiddenRows.getHiddenRows() ⇒ Array&lt;number&gt;_
Returns an array of visual indexes of hidden rows.



### hideRow
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L251
  

_hiddenRows.hideRow(...row)_
Hides the row provided as row index (counting from 0).


| Param | Type | Description |
| --- | --- | --- |
| ...row | `number` | Visual row index. |



### hideRows
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L219
  

_hiddenRows.hideRows(rows)_
Hides the rows provided in the array.


| Param | Type | Description |
| --- | --- | --- |
| rows | `Array.&lt;number&gt;` | Array of visual row indexes. |



### isEnabled
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L104
  

_hiddenRows.isEnabled() ⇒ boolean_
Checks if the plugin is enabled in the handsontable settings. This method is executed in [Hooks#beforeInit](./Hooks/#beforeInit)
hook and if it returns `true` than the [enablePlugin](#HiddenRows+enablePlugin) method is called.



### isHidden
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L272
  

_hiddenRows.isHidden(row) ⇒ boolean_
Checks if the provided row is hidden.


| Param | Type | Description |
| --- | --- | --- |
| row | `number` | Visual row index. |



### isValidConfig
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L282
  

_hiddenRows.isValidConfig(hiddenRows) ⇒ boolean_
Checks whether all of the provided row indexes are within the bounds of the table.


| Param | Type | Description |
| --- | --- | --- |
| hiddenRows | `Array` | List of hidden visual row indexes. |



### showRow
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L210
  

_hiddenRows.showRow(...row)_
Shows the row provided as row index (counting from 0).


| Param | Type | Description |
| --- | --- | --- |
| ...row | `number` | Visual row index. |



### showRows
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L165
  

_hiddenRows.showRows(rows)_
Shows the rows provided in the array.


| Param | Type | Description |
| --- | --- | --- |
| rows | `Array.&lt;number&gt;` | Array of visual row indexes. |



### updatePlugin
::: source-code-link https://github.com/handsontable/handsontable/blob/develop/src/plugins/hiddenRows/hiddenRows.js#L142
  

_hiddenRows.updatePlugin()_
Updates the plugin state. This method is executed when [Core#updateSettings](./Core/#updateSettings) is invoked.


