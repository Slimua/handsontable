---
title: MergeCells
metaTitle: MergeCells - Plugin - Handsontable Documentation
permalink: /12.0/api/merge-cells
canonicalUrl: /api/merge-cells
hotPlugin: true
editLink: false
---

# MergeCells

[[toc]]

## Description

Plugin, which allows merging cells in the table (using the initial configuration, API or context menu).

**Example**  
```js
const hot = new Handsontable(document.getElementById('example'), {
 data: getData(),
 mergeCells: [
   {row: 0, col: 3, rowspan: 3, colspan: 3},
   {row: 2, col: 6, rowspan: 2, colspan: 2},
   {row: 4, col: 8, rowspan: 3, colspan: 3}
 ],
```

## Options

### mergeCells
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/dataMap/metaManager/metaSchema.js#L2882

:::

_mergeCells.mergeCells : boolean | Array&lt;object&gt;_

The `mergeCells` option configures the [`MergeCells`](@/api/mergeCells.md) plugin.

You can set the `mergeCells` option to one of the following:

| Setting             | Description                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `true`              | Enable the [`MergeCells`](@/api/mergeCells.md) plugin                                               |
| `false`             | Disable the [`MergeCells`](@/api/mergeCells.md) plugin                                              |
| An array of objects | - Enable the [`MergeCells`](@/api/mergeCells.md) plugin<br>- Merge specific cells at initialization |

To merge specific cells at Handsontable's initialization,
set the `mergeCells` option to an array of objects, with the following properties:

| Property  | Description                                                |
| --------- | ---------------------------------------------------------- |
| `row`     | The row index of the merged section's beginning            |
| `col`     | The column index of the merged section's beginning         |
| `rowspan` | The width (as a number of rows) of the merged section      |
| `colspan` | The height (as a number of columns ) of the merged section |

Read more:
- [Merge cells &#8594;](@/guides/cell-features/merge-cells.md)

**Default**: <code>false</code>  
**Example**  
```js
// enable the `MergeCells` plugin
margeCells: true,

// enable the `MergeCells` plugin
// and merge specific cells at initialization
mergeCells: [
  // merge cells from cell (1,1) to cell (3,3)
  {row: 1, col: 1, rowspan: 3, colspan: 3},
  // merge cells from cell (3,4) to cell (2,2)
  {row: 3, col: 4, rowspan: 2, colspan: 2},
  // merge cells from cell (5,6) to cell (3,3)
  {row: 5, col: 6, rowspan: 3, colspan: 3}
],
```

## Methods

### clearCollections
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L291

:::

_mergeCells.clearCollections()_

Clears the merged cells from the merged cell container.



### disablePlugin
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L144

:::

_mergeCells.disablePlugin()_

Disables the plugin functionality for this Handsontable instance.



### enablePlugin
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L96

:::

_mergeCells.enablePlugin()_

Enables the plugin functionality for this Handsontable instance.



### isEnabled
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L89

:::

_mergeCells.isEnabled() ⇒ boolean_

Checks if the plugin is enabled in the handsontable settings. This method is executed in [Hooks#beforeInit](@/api/hooks.md#beforeinit)
hook and if it returns `true` than the [MergeCells#enablePlugin](@/api/mergeCells.md#enableplugin) method is called.



### merge
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L496

:::

_mergeCells.merge(startRow, startColumn, endRow, endColumn)_

Merges the specified range.

**Emits**: [`Hooks#event:beforeMergeCells`](@/api/hooks.md#beforemergecells), [`Hooks#event:afterMergeCells`](@/api/hooks.md#aftermergecells)  

| Param | Type | Description |
| --- | --- | --- |
| startRow | `number` | Start row of the merged cell. |
| startColumn | `number` | Start column of the merged cell. |
| endRow | `number` | End row of the merged cell. |
| endColumn | `number` | End column of the merged cell. |



### mergeSelection
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L332

:::

_mergeCells.mergeSelection([cellRange])_

Merges the selection provided as a cell range.


| Param | Type | Description |
| --- | --- | --- |
| [cellRange] | `CellRange` | `optional` Selection cell range. |



### unmerge
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L513

:::

_mergeCells.unmerge(startRow, startColumn, endRow, endColumn)_

Unmerges the merged cell in the provided range.

**Emits**: [`Hooks#event:beforeUnmergeCells`](@/api/hooks.md#beforeunmergecells), [`Hooks#event:afterUnmergeCells`](@/api/hooks.md#afterunmergecells)  

| Param | Type | Description |
| --- | --- | --- |
| startRow | `number` | Start row of the merged cell. |
| startColumn | `number` | Start column of the merged cell. |
| endRow | `number` | End row of the merged cell. |
| endColumn | `number` | End column of the merged cell. |



### unmergeSelection
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L351

:::

_mergeCells.unmergeSelection([cellRange])_

Unmerges the selection provided as a cell range.


| Param | Type | Description |
| --- | --- | --- |
| [cellRange] | `CellRange` | `optional` Selection cell range. |



### updatePlugin
  
::: source-code-link https://github.com/handsontable/handsontable/blob/5aabeed320156232ca30482eca172fb2d11f2f72/handsontable/src/plugins/mergeCells/mergeCells.js#L154

:::

_mergeCells.updatePlugin()_

Updates the plugin state. This method is executed when [Core#updateSettings](@/api/core.md#updatesettings) is invoked.


