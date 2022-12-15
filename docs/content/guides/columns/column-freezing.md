---
id: 2anhuqf7
title: Column freezing
metaTitle: Column freezing - JavaScript Data Grid | Handsontable
description: Lock (freeze) the position of specified columns, keeping them visible while scrolling to another area of the grid.
permalink: /column-freezing
canonicalUrl: /column-freezing
tags:
  - fixing columns
  - snapping columns
  - pinning columns
  - fixedColumns
react:
  id: otumcpty
  metaTitle: Column freezing - React Data Grid | Handsontable
searchCategory: Guides
---

# Column freezing

Lock the position of specified columns, keeping them visible when scrolling.

[[toc]]

## Overview

Column freezing locks specific columns of a grid in place, keeping them visible while scrolling to another area of the grid. We refer to frozen columns as *fixed*.

Columns can be frozen during initialization and by the user.

## Freeze columns at initialization

To freeze the columns on the left-hand side, you need to pass the option [`fixedColumnsStart`](@/api/options.md#fixedcolumnsstart) in the Settings object. The container you initialize the data grid in will need additional CSS attributes configured: `width` and `overflow: hidden`.

::: warning
The [`fixedColumnsStart`](@/api/options.md#fixedcolumnsstart) property used to be called [`fixedColumnsLeft`](@/api/options.md#fixedcolumnleft) before Handsontable 12.0.0. The old name [`fixedColumnsLeft`](@/api/options.md#fixedcolumnleft) works in the LTR [layout direction](@/guides/internationalization/layout-direction.md) but throws an error when the layout direction is set to RTL.
:::

::: only-for javascript
::: example #example1
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// generate an array of arrays with dummy data
const data = new Array(100) // number of rows
  .fill()
  .map((_, row) => new Array(50) // number of columns
    .fill()
    .map((_, column) => `${row}, ${column}`)
  );

const container = document.querySelector('#example1');
const hot = new Handsontable(container, {
  data,
  colWidths: 100,
  width: '100%',
  height: 320,
  rowHeaders: true,
  colHeaders: true,
  fixedColumnsStart: 1,
  licenseKey: 'non-commercial-and-evaluation'
});
```
:::
:::

::: only-for react
::: example #example1 :react
```jsx
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

// generate an array of arrays with dummy data
const data = new Array(100) // number of rows
  .fill()
  .map((_, row) => new Array(50) // number of columns
    .fill()
    .map((_, column) => `${row}, ${column}`)
  );

export const ExampleComponent = () => {
  return (
    <HotTable
      data={data}
      colWidths={100}
      width="100%"
      height={320}
      rowHeaders={true}
      colHeaders={true}
      fixedColumnsStart={1}
      licenseKey="non-commercial-and-evaluation"
    />
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example1'));
/* end:skip-in-preview */
```
:::
:::


## User-triggered freeze

To manually freeze a column, you need to set the [`manualColumnFreeze`](@/api/options.md#manualcolumnfreeze) configuration option to `true` in the Handsontable settings. When the Manual Column Freeze plugin is enabled, you can freeze any non-fixed column and unfreeze any fixed column in your Handsontable instance using the Context Menu.

Mind that a frozen column won't go back to the original position after you unfreeze it.

::: only-for javascript
::: example #example2
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// generate an array of arrays with dummy data
const data = new Array(100) // number of rows
  .fill()
  .map((_, row) => new Array(50) // number of columns
    .fill()
    .map((_, column) => `${row}, ${column}`)
  );

const container = document.querySelector('#example2');
const hot = new Handsontable(container, {
  data,
  colWidths: 100,
  width: '100%',
  height: 320,
  rowHeaders: true,
  colHeaders: true,
  fixedColumnsStart: 2,
  contextMenu: true,
  manualColumnFreeze: true,
  licenseKey: 'non-commercial-and-evaluation'
});
```
:::
:::

::: only-for react
::: example #example2 :react
```jsx
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

// generate an array of arrays with dummy data
const data = new Array(100) // number of rows
  .fill()
  .map((_, row) => new Array(50) // number of columns
    .fill()
    .map((_, column) => `${row}, ${column}`)
  );

export const ExampleComponent = () => {
  return (
    <HotTable
      data={data}
      colWidths={100}
      width="100%"
      height={320}
      rowHeaders={true}
      colHeaders={true}
      fixedColumnsStart={2}
      contextMenu={true}
      manualColumnFreeze={true}
      licenseKey="non-commercial-and-evaluation"
    />
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example2'));
/* end:skip-in-preview */
```
:::
:::


## Related API reference

- Configuration options:
  - [`fixedColumnsStart`](@/api/options.md#fixedcolumnsstart)
  - [`manualColumnFreeze`](@/api/options.md#manualcolumnfreeze)
- Plugins:
  - [`ManualColumnFreeze`](@/api/manualColumnFreeze.md)
