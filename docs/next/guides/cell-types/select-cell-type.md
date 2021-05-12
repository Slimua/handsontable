---
title: Select cell type
metaTitle: Select cell type - Guide - Handsontable Documentation
permalink: /next/select-cell-type
canonicalUrl: /select-cell-type
---

# Select cell type

Select editor should be considered an example how to write editors rather than used as a fully featured editor. It is a much simpler form of the [Dropdown editor](dropdown-cell-type.md). It is suggested to use the latter in your projects.

::: example #example1
```js
const container = document.querySelector('#example1');

const hot = new Handsontable(container, {
  data: [
    ['2017', 'Honda', 10],
    ['2018', 'Toyota', 20],
    ['2019', 'Nissan', 30]
  ],
  colWidths: [50, 70, 50],
  colHeaders: true,
  columns: [
    {},
    {
      editor: 'select',
      selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
    },
    {}
  ],
  licenseKey: 'non-commercial-and-evaluation',
});
```
:::
