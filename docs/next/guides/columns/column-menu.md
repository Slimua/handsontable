---
title: Column menu
metaTitle: Column menu - Guide - Handsontable Documentation
permalink: /next/column-menu
canonicalUrl: /column-menu
tags:
  - dropdown menu
---

# Column menu

[[toc]]

## Overview

This plugin enables you to add a configurable dropdown menu to the table's column headers.
The dropdown menu acts like the **Context Menu** but is triggered by clicking the button in the header.

## Quick setup

To enable the plugin, set the `dropdownMenu` property to `true` when initializing Handsontable.

::: example #example1
```js
const container = document.querySelector('#example1');

const hot1 = new Handsontable(container, {
  data: Handsontable.helper.createSpreadsheetData(3, 7),
  colHeaders: true,
  dropdownMenu: true,
  licenseKey: 'non-commercial-and-evaluation'
});
```
:::

## Plugin configuration

To use the default dropdown contents, set it to `true`, or to customize it by setting it to use a custom list of actions. For the available entry options reference, see the [Context Menu demo](context-menu.md#page-specific).

::: example #example2
```js
const container = document.querySelector('#example2');

const hot2 = new Handsontable(container, {
  data: Handsontable.helper.createSpreadsheetData(3, 7),
  colHeaders: true,
  licenseKey: 'non-commercial-and-evaluation',
  dropdownMenu: [
    'remove_col',
    '---------',
    'make_read_only',
    '---------',
    'alignment'
  ]
});
```
:::
