---
id: 42px61id
title: Row pre-populating
metaTitle: Row pre-populating - JavaScript Data Grid | Handsontable
description: Populate newly-added rows with predefined template values, using cell renderers.
permalink: /row-prepopulating
canonicalUrl: /row-prepopulating
tags:
  - spare rows
  - extra rows
  - bottom rows
  - placeholder
react:
  id: kmqhr00y
  metaTitle: Row pre-populating - React Data Grid | Handsontable
searchCategory: Guides
category: Rows
---

# Row pre-populating

Populate newly-added rows with predefined template values, using cell renderers.

[[toc]]

## Example

The example below shows how cell renderers can be used to populate the template values in empty rows. When a cell in the empty row is edited, the [`beforeChange`](@/api/hooks.md#beforechange) callback fills the row with the template values.

::: only-for javascript

::: example #example1

@[code](@/content/guides/rows/row-prepopulating/javascript/example1.js)

:::

:::

::: only-for react

::: example #example1 :react

@[code](@/content/guides/rows/row-prepopulating/react/example1.jsx)

:::

:::

## Related API reference

- Hooks:
  - [`beforeChange`](@/api/hooks.md#beforechange)
