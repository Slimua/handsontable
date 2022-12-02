---
title: Clipboard
metaTitle: Clipboard - JavaScript Data Grid | Handsontable
description: Copy data from selected cells to the clipboard, using the "Ctrl/Cmd + C" shortcut or the context menu. Control the clipboard with Handsontable's API.
permalink: /basic-clipboard
canonicalUrl: /basic-clipboard
tags:
  - copy
  - cut
  - paste
react:
  metaTitle: Clipboard - React Data Grid | Handsontable
searchCategory: Guides
---

# Clipboard

Copy data from selected cells to the clipboard, using the <kbd>**Ctrl**</kbd> / <kbd>**Cmd**</kbd>  + <kbd>**C**</kbd> shortcut or the context menu. Control the clipboard with Handsontable's API.

[[toc]]

## Overview

The clipboard offers Copy & Cut and Paste functionality, enabling you to copy & cut cell data from Handsontable and paste it to the system clipboard. This can be achieved either via shortcut keys or by triggering a copy & cut or paste programmatically.

## Copy & Cut

Copy & Cut actions allow exporting data from Handsontable to the system clipboard. The [`CopyPaste`](@/api/copyPaste.md) plugin copies and cuts data as a `text/plain` and a `text/html` MIME-type.

### End-user usage

Available keyboard shortcuts:

- <kbd>**Ctrl**</kbd>/<kbd>**Cmd**</kbd> + <kbd>**C**</kbd> - copies the content of the last cell in the selected range
- <kbd>**Ctrl**</kbd>/<kbd>**Cmd**</kbd> + <kbd>**X**</kbd> - cuts the content of the last cell in the selected range

Available options in the browser's toolbar:

- `Edit > Copy` - copies the content of the last cell in the selected range
- `Edit > Cut` - cuts the content of the last cell in the selected range

### Context menu

When the context menu is enabled, it includes default items, including copy & cut options.

- Copy - as a predefined key `copy`
- Cut - as a predefined key `cut`

You can use them in the same way as the rest of the predefined items in the [context menu](@/guides/accessories-and-menus/context-menu.md#context-menu-with-specific-options). These operations are executed by `document.execCommand()`.

::: only-for javascript
::: example #example1
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const container = document.querySelector('#example1');
const hot = new Handsontable(container, {
  data: [
    ['A1', 'B1', 'C1', 'D1', 'E1'],
    ['A2', 'B2', 'C2', 'D2', 'E2'],
    ['A3', 'B3', 'C3', 'D3', 'E3'],
    ['A4', 'B4', 'C4', 'D4', 'E4'],
    ['A5', 'B5', 'C5', 'D5', 'E5'],
  ],
  rowHeaders: true,
  colHeaders: true,
  contextMenu: ['copy', 'cut'],
  height: 'auto',
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

export const ExampleComponent = () => {
  return (
    <HotTable
      data={[
        ['A1', 'B1', 'C1', 'D1', 'E1'],
        ['A2', 'B2', 'C2', 'D2', 'E2'],
        ['A3', 'B3', 'C3', 'D3', 'E3'],
        ['A4', 'B4', 'C4', 'D4', 'E4'],
        ['A5', 'B5', 'C5', 'D5', 'E5'],
      ]}
      rowHeaders={true}
      colHeaders={true}
      contextMenu={['copy', 'cut']}
      height="auto"
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

### Copy with headers

Let the user copy the contents of column headers, by enabling the [additional options](@/api/options.md#copypaste-additional-options) of the [`CopyPaste`](@/api/copyPaste.md) plugin:

| Context menu item       | Option                                                                    | Copied area                                                               |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Copy with headers       | [`copyColumnHeaders`](@/api/options.md#copypaste-additional-options)      | ![copy_with_headers]({{$basePath}}/img/copy_with_headers.png)             |
| Copy with group headers | [`copyColumnGroupHeaders`](@/api/options.md#copypaste-additional-options) | ![copy_with_group_headers]({{$basePath}}/img/copy_with_group_headers.png) |
| Copy headers only       | [`copyColumnHeadersOnly`](@/api/options.md#copypaste-additional-options)  | ![copy_headers_only]({{$basePath}}/img/copy_headers_only.png)             |

To enable these features, configure the [`CopyPaste`](@/api/copyPaste.md) plugin like this:

```js{2-4}
copyPaste: {
  copyColumnHeaders: true,
  copyColumnGroupHeaders: true,
  copyColumnHeadersOnly: true,
}
```

Right-click on a cell to try it out:

::: only-for javascript
::: example #example2
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const container = document.querySelector('#example2');
const hot = new Handsontable(container, {
  data: [
    ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1'],
    ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2'],
    ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3', 'I3', 'J3'],
    ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4'],
    ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5'],
  ],
  contextMenu: true,
  copyPaste: {
    copyColumnHeaders: true,
    copyColumnGroupHeaders: true,
    copyColumnHeadersOnly: true,
  },
  colHeaders: true,
  rowHeaders: true,
  height: 'auto',
  nestedHeaders: [
    ['A', { label: 'B', colspan: 2 }, { label: 'C', colspan: 2 }, { label: 'D', colspan: 2 }, { label: 'E', colspan: 2 }, 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
  ],
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

export const ExampleComponent = () => {
  return (
  <HotTable
    data={[
      ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1'],
      ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2', 'J2'],
      ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3', 'I3', 'J3'],
      ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4'],
      ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5', 'I5', 'J5'],
    ]}
    contextMenu={true}
    copyPaste={{
      copyColumnHeaders: true,
      copyColumnGroupHeaders: true,
      copyColumnHeadersOnly: true,
    }}
    colHeaders={true}
    rowHeaders={true}
    height="auto"
    nestedHeaders={[
      ['A', { label: 'B', colspan: 2 }, { label: 'C', colspan: 2 }, { label: 'D', colspan: 2 }, { label: 'E', colspan: 2 }, 'F'],
      ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
    ]}
    licenseKey="non-commercial-and-evaluation"
      >
  </HotTable>
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example2'));
/* end:skip-in-preview */
```
:::
:::

### Trigger copy & cut programmatically

::: only-for react
::: tip
To use the Handsontable API, you'll need access to the Handsontable instance. You can do that by utilizing a reference to the `HotTable` component, and reading its `hotInstance` property.

For more information, see the [`Instance Methods`](@/guides/getting-started/react-methods.md) page.
:::
:::

First, select a cell range to copy or cut.

```js
hot.selectCell(1, 1);
```

Then use one of the following commands:

* `document.execCommand('copy')`
* `document.execCommand('cut')`

The **CopyPaste** plugin listens to the browser's `copy` and `cut` events. If triggered, our implementation will copy or cut the selected data to the system clipboard.

::: only-for javascript
::: example #example3 --html 1 --js 2
```html
<div id="example3"></div>
<div class="controls">
  <button id="copy">Select and copy cell B2</button>
  <button id="cut">Select and cut cell B2</button>
</div>
```

```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const container = document.querySelector('#example3');
const copyBtn = document.querySelector('#copy');
const cutBtn = document.querySelector('#cut');

const hot = new Handsontable(container, {
  rowHeaders: true,
  colHeaders: true,
  data: [
    ['A1', 'B1', 'C1', 'D1', 'E1'],
    ['A2', 'B2', 'C2', 'D2', 'E2'],
    ['A3', 'B3', 'C3', 'D3', 'E3'],
    ['A4', 'B4', 'C4', 'D4', 'E4'],
    ['A5', 'B5', 'C5', 'D5', 'E5'],
  ],
  outsideClickDeselects: false,
  height: 'auto',
  licenseKey: 'non-commercial-and-evaluation'
});

copyBtn.addEventListener('mousedown', function() {
  hot.selectCell(1, 1);
});

copyBtn.addEventListener('click', function() {
  document.execCommand('copy');
});

cutBtn.addEventListener('mousedown', function() {
  hot.selectCell(1, 1);
});

cutBtn.addEventListener('click', function() {
  document.execCommand('cut');
});
```
:::
:::

::: only-for react
::: example #example3 :react
```jsx
import { useEffect, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

export const ExampleComponent = () => {
  const hotRef = useRef(null);

  const copyBtnClickCallback = function() {
    document.execCommand('copy');
  };
  const cutBtnClickCallback = function() {
    document.execCommand('cut');
  };
  let copyBtnMousedownCallback;
  let cutBtnMousedownCallback;

  useEffect(() => {
    const hot = hotRef.current.hotInstance;

    copyBtnMousedownCallback = function() {
      hot.selectCell(1, 1);
    };
    cutBtnMousedownCallback = function() {
      hot.selectCell(1, 1);
    };
  });

  return (
    <>
      <HotTable
        ref={hotRef}
        rowHeaders={true}
        colHeaders={true}
        data={[
          ['A1', 'B1', 'C1', 'D1', 'E1'],
          ['A2', 'B2', 'C2', 'D2', 'E2'],
          ['A3', 'B3', 'C3', 'D3', 'E3'],
          ['A4', 'B4', 'C4', 'D4', 'E4'],
          ['A5', 'B5', 'C5', 'D5', 'E5'],
        ]}
        outsideClickDeselects={false}
        height="auto"
        licenseKey="non-commercial-and-evaluation"
      />
      <div className="controls">
        <button
          id="copy"
          onMouseDown={(...args) => copyBtnMousedownCallback(...args)}
          onClick={(...args) => copyBtnClickCallback(...args)}
        >
          Select and copy cell B2
        </button>
        <button
          id="cut"
          onMouseDown={(...args) => cutBtnMousedownCallback(...args)}
          onClick={(...args) => cutBtnClickCallback(...args)}
        >
          Select and cut cell B2
        </button>
      </div>
    </>
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example3'));
/* end:skip-in-preview */
```
:::
:::

**Note:** Not all selection-related Handsontable methods result in it gaining focus. Make sure your table instance is focused by calling [isListening()](@/api/core.md#islistening) before copying or pasting data.


### Hooks

The [`CopyPaste`](@/api/copyPaste.md) plugin exposes the following hooks to manipulate data during copy or cut operations:

- [`beforeCopy`](@/api/hooks.md#beforecopy)
- [`afterCopy`](@/api/hooks.md#aftercopy)
- [`beforeCut`](@/api/hooks.md#beforecut)
- [`afterCut`](@/api/hooks.md#aftercut)

Examples of how to use them are provided in their descriptions.

## Paste

The Paste action allows the importing of data from external sources using the user's system clipboard. The **CopyPaste** firstly looks for `text/html` in the system clipboard, followed by `text/plain`.

### End-user usage

Available keyboard shortcuts:

- <kbd>**Ctrl**</kbd>/<kbd>**Cmd**</kbd> + <kbd>**V**</kbd> - paste the content into the last cell in the selected range

Available options in the browser's toolbar:

- `Edit > Paste` - paste the content into the last cell in the selected range

### Context menu

Due to security reasons, modern browsers disallow reading from the system clipboard. [Learn more](https://www.w3.org/TR/clipboard-apis/#privacy)

### Trigger paste programmatically

Due to security reasons, modern browsers disallow reading from the system clipboard. [Learn more](https://www.w3.org/TR/clipboard-apis/#privacy)

### Hooks

The [`CopyPaste`](@/api/copyPaste.md) plugin exposes the following hooks to manipulate data during the pasting operation:

- [`beforePaste`](@/api/hooks.md#beforepaste)
- [`afterPaste`](@/api/hooks.md#afterpaste)

Examples of how to use them are provided in their descriptions.

## Known limitations

1.  The [`CopyPaste`](@/api/copyPaste.md) plugin doesn't copy, cut or paste cells' appearance.
2.  The data copied from Handsontable will always remain as plain text. For example, if you copy a checked checkbox, the input will be kept as a value of `'true'`.
3.  `document.execCommand` can be called only during an immediate-execute event, such as a `MouseEvent` or a `KeyboardEvent`.

## Related keyboard shortcuts

| Windows                                | macOS                                 | Action                                                          |  Excel  | Sheets  |
| -------------------------------------- | ------------------------------------- | --------------------------------------------------------------- | :-----: | :-----: |
| <kbd>**Ctrl**</kbd> + <kbd>**X**</kbd> | <kbd>**Cmd**</kbd> + <kbd>**X**</kbd> | Cut the contents of the selected cells to the system clipboard  | &check; | &check; |
| <kbd>**Ctrl**</kbd> + <kbd>**C**</kbd> | <kbd>**Cmd**</kbd> + <kbd>**C**</kbd> | Copy the contents of the selected cells to the system clipboard | &check; | &check; |
| <kbd>**Ctrl**</kbd> + <kbd>**V**</kbd> | <kbd>**Cmd**</kbd> + <kbd>**V**</kbd> | Paste from the system clipboard                                 | &check; | &check; |

## Related API reference

- Configuration options:
  - [`copyPaste`](@/api/options.md#copypaste)
  - [`copyable`](@/api/options.md#copyable)
  - [`skipColumnOnPaste`](@/api/options.md#skipcolumnonpaste)
  - [`skipRowOnPaste`](@/api/options.md#skiprowonpaste)
- Core methods:
  - [`getCopyableData()`](@/api/core.md#getcopyabledata)
  - [`getCopyableText()`](@/api/core.md#getcopyabletext)
- Hooks:
  - [`afterCopy`](@/api/hooks.md#aftercopy)
  - [`afterCopyLimit`](@/api/hooks.md#aftercopylimit)
  - [`afterCut`](@/api/hooks.md#aftercut)
  - [`afterPaste`](@/api/hooks.md#afterpaste)
  - [`beforeCopy`](@/api/hooks.md#beforecopy)
  - [`beforeCut`](@/api/hooks.md#beforecut)
  - [`beforePaste`](@/api/hooks.md#beforepaste)
  - [`modifyCopyableRange`](@/api/hooks.md#modifycopyablerange)
- Plugins:
  - [`CopyPaste`](@/api/copyPaste.md)
