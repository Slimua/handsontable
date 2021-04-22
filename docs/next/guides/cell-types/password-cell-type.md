---
title: Password cell type
permalink: /next/password-cell-type
canonicalUrl: /password-cell-type
---

# Password cell type

[[toc]]

## Password cell type

This kind of cell behaves like a text cell with a difference that it masks its value using asterisk in cell renderer. For the cell editor, a `<input type="password">` field is used. Data is stored in the data source as plain text.

::: example #example1
```js
var
  example1 = document.getElementById('example1'),
  hot1;

hot1 = new Handsontable(example1, {
  data: [
    {id: 1, name: {first: 'Chris', last: 'Right'}, password: 'plainTextPassword'},
    {id: 2, name: {first: 'John', last: 'Honest'}, password: 'txt'},
    {id: 3, name: {first: 'Greg', last: 'Well'}, password: 'longer'}
  ],
  colHeaders: ['ID', 'First name', 'Last name', 'Password'],
  licenseKey: 'non-commercial-and-evaluation',
  columns: [
    {data: 'id'},
    {data: 'name.first'},
    {data: 'name.last'},
    {data: 'password', type: 'password'}
  ]
});
```
:::

## Fixed hash length

By default every hash has length equal to the length of value that it corresponds with. Use option `hashLength` to set fixed hash length.

::: example #example2
```js
var example2 = document.getElementById('example2'),
  hot2;

hot2 = new Handsontable(example2, {
  data: [
    {id: 1, name: {first: 'Chris', last: 'Right'}, password: 'plainTextPassword'},
    {id: 2, name: {first: 'John', last: 'Honest'}, password: 'txt'},
    {id: 3, name: {first: 'Greg', last: 'Well'}, password: 'longer'}
  ],
  colHeaders: ['ID', 'First name', 'Last name', 'Password'],
  licenseKey: 'non-commercial-and-evaluation',
  columns: [
    {data: 'id'},
    {data: 'name.first'},
    {data: 'name.last'},
    {data: 'password', type: 'password', hashLength: 10}
  ]
});
```
:::

## Custom hash symbol

By default every hash consists of asterisks `*`. Use option `hashSymbol` to set custom hash symbol. You can use any character, entity or event HTML. Note that you can't change symbol used by the input field due to browsers limitations.

::: example #example3
```js
var example3 = document.getElementById('example3'),
  hot3;

hot3 = new Handsontable(example3, {
  data: [
    {id: 1, name: {first: 'Chris', last: 'Right'}, password: 'plainTextPassword'},
    {id: 2, name: {first: 'John', last: 'Honest'}, password: 'txt'},
    {id: 3, name: {first: 'Greg', last: 'Well'}, password: 'longer'}
  ],
  colHeaders: ['ID', 'First name', 'Last name', 'Password'],
  licenseKey: 'non-commercial-and-evaluation',
  columns: [
    {data: 'id'},
    {data: 'name.first'},
    {data: 'name.last'},
    {data: 'password', type: 'password', hashSymbol: '&#9632;'}
  ]
});
```
:::
