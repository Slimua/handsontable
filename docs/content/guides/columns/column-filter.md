---
title: Column filter
metaTitle: Column filter - JavaScript Data Grid | Handsontable
description: Filter your data by a value or by a combination of conditions.
permalink: /column-filter
canonicalUrl: /column-filter
tags:
  - filtering data
react:
  metaTitle: Column filter - React Data Grid | Handsontable
searchCategory: Guides
---

# Column filter

Filter your data by a value or by a combination of conditions.

[[toc]]

## Overview

The [`Filters`](@/api/filters.md) plugin allows filtering the data in the table's columns using a range of pre-defined conditions.

## Basic configuration

To enable the plugin, set the [`filters`](@/api/options.md#filters) configuration option to `true` and enable the filters dependency, which is the [`DropdownMenu`](@/api/dropdownMenu.md) plugin.

::: only-for javascript
::: example #example1
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const container = document.querySelector('#example1');
const hot = new Handsontable(container, {
  data: [
    ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
    ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
    ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
    ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
    ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
  ],
  columns: [
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { type: 'date', dateFormat: 'M/D/YYYY' },
    { type: 'numeric' }
  ],
  colHeaders: true,
  rowHeaders: true,
  dropdownMenu: true,
  filters: true,
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
        ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
        ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
        ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
        ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
        ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
      ]}
      columns={[
        { type: 'text' },
        { type: 'text' },
        { type: 'text' },
        { type: 'text' },
        { type: 'date', dateFormat: 'M/D/YYYY' },
        { type: 'numeric' }
      ]}
      colHeaders={true}
      rowHeaders={true}
      dropdownMenu={true}
      filters={true}
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


## Custom filter menu

To display filters while hiding the other elements in the dropdown menu, pass the elements to be displayed as an array into the configuration.

::: only-for javascript
::: example #example2
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const container = document.querySelector('#example2');
const hot = new Handsontable(container, {
  data: [
    ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
    ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
    ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
    ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
    ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
  ],
  columns: [
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { type: 'date', dateFormat: 'M/D/YYYY' },
    { type: 'numeric' }
  ],
  colHeaders: true,
  rowHeaders: true,
  filters: true,
  dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
  height: 'auto',
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
        ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
        ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
        ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
        ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
        ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
      ]}
      columns={[
        { type: 'text' },
        { type: 'text' },
        { type: 'text' },
        { type: 'text' },
        { type: 'date', dateFormat: 'M/D/YYYY' },
        { type: 'numeric' }
      ]}
      colHeaders={true}
      rowHeaders={true}
      filters={true}
      dropdownMenu={['filter_by_condition', 'filter_action_bar']}
      height="auto"
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


## Custom implementations

The examples below show how to adjust the Filter plugin to your needs. They include customizing the UI components, changing the default behavior, and using filters outside the table.

### Filter as you type

This example places a basic `input` element inside each column header (A, B, C), separated by a horizontal line. The data is being filtered as you type, with a 100 ms delay. The filter element is excluded from the selection event, so the column doesn’t get selected when clicked on.

The demo below is just a demonstration (e.g., you can't add more columns). We don't recommend using it in your production code.

::: only-for javascript
::: example #example3
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

function debounce(func, wait = 200) {
  let lastTimer = null;
  let result;

  function _debounce(...args) {
    if (lastTimer) {
      clearTimeout(lastTimer);
    }
    lastTimer = setTimeout(() => {
      result = func.apply(this, args);
    }, wait);

    return result;
  }

  return _debounce;
}

// Event for `keydown` event. Add condition after delay of 200 ms which is counted from the time of last pressed key.
const debounceFn = debounce((colIndex, event) => {
  const filtersPlugin = hot.getPlugin('filters');

  filtersPlugin.removeConditions(colIndex);
  filtersPlugin.addCondition(colIndex, 'contains', [event.target.value]);
  filtersPlugin.filter();
}, 100);

const addEventListeners = (input, colIndex) => {
  input.addEventListener('keydown', event => {
    debounceFn(colIndex, event);
  });
};

// Build elements which will be displayed in header.
const getInitializedElements = colIndex => {
  const div = document.createElement('div');
  const input = document.createElement('input');

  div.className = 'filterHeader';

  addEventListeners(input, colIndex);

  div.appendChild(input);

  return div;
};

// Add elements to header on `afterGetColHeader` hook.
const addInput = (col, TH) => {
  // Hooks can return a value other than number (for example `columnSorting` plugin uses this).
  if (typeof col !== 'number') {
    return col;
  }

  if (col >= 0 && TH.childElementCount < 2) {
    TH.appendChild(getInitializedElements(col));
  }
};

const container = document.querySelector('#example3');

const hot = new Handsontable(container, {
  data: [
    ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
    ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
    ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
    ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
    ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
  ],
  height: 'auto',
  colHeaders: true,
  rowHeaders: true,
  className: 'as-you-type-demo',
  filters: true,
  colWidths: 100,
  afterGetColHeader: addInput,
  beforeOnCellMouseDown(event, coords) {
    // Deselect the column after clicking on input.
    if (coords.row === -1 && event.target.nodeName === 'INPUT') {
      event.stopImmediatePropagation();
      this.deselectCell();
    }
  },
  licenseKey: 'non-commercial-and-evaluation'
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

function debounce(func, wait = 200) {
  let lastTimer = null;
  let result;

  function _debounce(...args) {
    if (lastTimer) {
      clearTimeout(lastTimer);
    }
    lastTimer = setTimeout(() => {
      result = func.apply(this, args);
    }, wait);

    return result;
  }

  return _debounce;
}

export const ExampleComponent = () => {
  const hotRef = useRef(null);
  let debounceFn = null;

  const addEventListeners = (input, colIndex) => {
    input.addEventListener('keydown', event => {
      debounceFn(colIndex, event);
    });
  };

  //  Build elements which will be displayed in header.
  const getInitializedElements = colIndex => {
    const div = document.createElement('div');
    const input = document.createElement('input');

    div.className = 'filterHeader';

    addEventListeners(input, colIndex);

    div.appendChild(input);

    return div;
  };

  //  Add elements to header on `afterGetColHeader` hook.
  const addInput = (col, TH) => {
    // Hooks can return a value other than number (for example `columnSorting` plugin uses this).
    if (typeof col !== 'number') {
      return col;
    }

    if (col >= 0 && TH.childElementCount < 2) {
      TH.appendChild(getInitializedElements(col));
    }
  };

  useEffect(() => {
    const hot = hotRef.current.hotInstance;

    //  Event for `keydown` event. Add condition after delay of 200 ms which is counted from the time of last pressed key.
    debounceFn = debounce((colIndex, event) => {
      const filtersPlugin = hot.getPlugin('filters');

      filtersPlugin.removeConditions(colIndex);
      filtersPlugin.addCondition(colIndex, 'contains', [event.target.value]);
      filtersPlugin.filter();
    }, 100);
  });

  return (
    <HotTable
      ref={hotRef}
      data={[
        ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
        ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
        ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
        ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
        ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
      ]}
      height="auto"
      colHeaders={true}
      rowHeaders={true}
      className="as-you-type-demo"
      filters={true}
      colWidths={100}
      afterGetColHeader={addInput}
      beforeOnCellMouseDown={function(event, coords){
        // Deselect the column after clicking on input.
        if (coords.row === -1 && event.target.nodeName === 'INPUT') {
          event.stopImmediatePropagation();
          this.deselectCell();
        }
      }}
      licenseKey="non-commercial-and-evaluation"
    />
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example3'));
/* end:skip-in-preview */
```
:::
:::


### Filter from the outside the table

The external Filter component is controlling the main table by passing values for particular columns. Only a fraction of the code is related to Handsontable API, for example, [`addConditionsByValue`](@/api/filters.md#addcondition), [`filter`](@/api/filters.md), and [`removeConditions`](@/api/filters.md#removeconditions).

::: tip
Note that selecting a column in the Filter component resets the state of the table. This implementation can filter only one column at a time.
:::

::: only-for javascript
::: example #example4 --html 1 --css 2 --js 3
```html
<div id="example4"></div>
<div id="externalFilter">
  <div class="columnChoose">
    <label>Choose Column: </label>
    <select></select>
  </div>

  <div id="filterSelect">
    <div class="controllers">
      <div>
        <label><input type="checkbox" id="filtersSelectAll" checked="checked"> (Select all)</label>
      </div>
    </div>
    <div class="items"></div>
  </div>

  <div class="buttons controls">
    <button class="apply">Apply filter</button>
    <button class="clear">Clear filter</button>
  </div>
</div>
```
```css
#externalFilter {
  width: 240px;
  margin-top: 20px;
}

#externalFilter .columnChoose {
  margin-bottom: 5px;
}

#externalFilter .columnChoose select {
  width: 100%;
  margin-top: 5px;
  padding: 3px 6px;
  display: block;
  border-radius: 4px;
  border: 1px solid #cfdbe4;
}

#externalFilter #filterSelect {
  margin-bottom: 5px;
  padding: 0 10px 8px;
  border-radius: 4px;
  border: 1px solid #cfdbe4;
}
```
```js
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

function curry(func) {
  const argsLength = func.length;

  function given(argsSoFar) {
    return function _curry(...params) {
      const passedArgsSoFar = argsSoFar.concat(params);
      let result;

      if (passedArgsSoFar.length >= argsLength) {
        result = func.apply(this, passedArgsSoFar);
      } else {
        result = given(passedArgsSoFar);
      }

      return result;
    };
  }

  return given([]);
}

class DOMHelper {
  constructor(state, actions) {
    this.state = state;
    this.addConditionsByValue = actions.addConditionsByValue;
    this.filter = actions.filter;
    this.removeConditions = actions.removeConditions;

    this.externalFilterUI = document.querySelector('#externalFilter');
    this.selectAllUI = document.querySelector('#filtersSelectAll');
    this.itemsContainerUI = this.externalFilterUI.querySelector('.items');
    this.chooseColumnUI = this.externalFilterUI.querySelector('.columnChoose > select');
    this.applyFilterUI = this.externalFilterUI.querySelector('.buttons > .apply');
    this.clearFilterUI = this.externalFilterUI.querySelector('.buttons > .clear');
    this.inputs = [];

    this.fillSelectByColHeaders();
    this.fillValueBoxByData();
    this.initListeners();

    this.externalFilterUI.style.display = 'block';
  }

  initListeners() {
    this.chooseColumnUI.addEventListener('change', event => this.onSelectChanged(event));
    this.applyFilterUI.addEventListener('click', () => this.onApplyFilterClicked());
    this.clearFilterUI.addEventListener('click', () => this.onClearFilterClicked());
    this.selectAllUI.addEventListener('click', () => this.onSelectAllClicked());
  }

  fillSelectByColHeaders() {
    const colHeaders = this.state.getHeaders();

    colHeaders.forEach((colHeader, columnIndex) => {
      const option = document.createElement('option');

      option.text = colHeader;

      if (columnIndex === this.state.getSelectedColumn()) {
        option.selected = true;
      }

      this.chooseColumnUI.add(option);
    });
  }

  fillValueBoxByData() {
    this.state.getData().forEach((cellData, rowIndex) => {
      const item = document.createElement('div');

      item.className = 'item';

      const input = document.createElement('input');

      input.type = 'checkbox';
      input.name = 'cellData';
      input.value = cellData;
      input.checked = true;

      input.addEventListener('change', event => this.onInputChange(event));

      const label = document.createElement('label');

      label.innerText = ` ${cellData}`;

      label.prepend(input);
      item.appendChild(label);
      this.inputs.push(input);
      this.itemsContainerUI.appendChild(item);
    });
  }

  setSelectAllUIChecked(checked) {
    if (this.selectAllUI.checked !== checked) {
      this.selectAllUI.checked = checked;
    }
  }

  clearElementChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  onSelectChanged(event) {
    this.removeConditions(this.state.getSelectedColumn());
    this.filter();
    this.state.setSelectedColumn(event.target.selectedIndex);

    this.setSelectAllUIChecked(true);
    this.clearElementChildren(this.itemsContainerUI);
    this.fillValueBoxByData();
  }

  onInputChange(event) {
    if (event.target.checked === false) {
      this.state.addValuesToFilter(event.target.value);
      this.setSelectAllUIChecked(false);

    } else {
      this.state.removeValuesForFilter(event.target.value);

      if (this.state.allValuesChecked()) {
        this.setSelectAllUIChecked(true);
      }
    }
  }

  onApplyFilterClicked() {
    this.removeConditions(this.state.getSelectedColumn());
    this.addConditionsByValue(this.state.getValuesToFilter(), this.state.getSelectedColumn());
    this.filter();
  }

  onClearFilterClicked() {
    this.removeConditions(this.state.getSelectedColumn());
    this.state.removeValuesForFilter();
    this.filter();

    this.clearElementChildren(this.itemsContainerUI);
    this.fillValueBoxByData();
    this.setSelectAllUIChecked(true);
  }

  onSelectAllClicked() {
    if (this.state.allValuesChecked()) {
      this.state.addValuesToFilter();

      this.inputs.forEach(function (inputDomElement) {
        inputDomElement.checked = false;
      });

    } else {
      this.state.removeValuesForFilter();

      this.inputs.forEach(function (inputDomElement) {
        inputDomElement.checked = true;
      });
    }
  }
}

class State {
  constructor(data, headers, selectedColumn = 0) {
    this.selectedColumn = selectedColumn;
    this.data = data;
    this.headers = headers;

    this.initStateForColumn();
  }

  initStateForColumn() {
    this.dataAtCol = this.getUniqueDataAtCol(this.selectedColumn);
    this.checkedValues = this.dataAtCol.length;
    this.maxCheckedValues = this.dataAtCol.length;
    this.valuesToFilter = [];
  }

  getHeaders() {
    return this.headers;
  }

  getData() {
    return this.dataAtCol;
  }

  getUniqueDataAtCol(column) {
    const dataAtCol = this.getSourceDataAtCol(column);

    return dataAtCol.filter((value, index, self) => self.indexOf(value) === index);
  }

  getSourceDataAtCol(column) {
    return this.data.map(dataAtRow => dataAtRow[column].toString());
  }

  setSelectedColumn(column) {
    this.selectedColumn = column;
    this.initStateForColumn();
  }

  getSelectedColumn() {
    return this.selectedColumn;
  }

  getValuesToFilter() {
    return this.valuesToFilter;
  }

  addValuesToFilter(value) {
    if (value) {
      this.valuesToFilter.push(value);
      this.checkedValues -= 1;

    } else {
      this.valuesToFilter = Array.from(this.dataAtCol);
      this.checkedValues = 0;
    }
  }

  removeValuesForFilter(value) {
    if (value) {
      const indexOfRemovedElement = this.valuesToFilter.indexOf(value);

      if (indexOfRemovedElement !== -1) {
        this.valuesToFilter.splice(indexOfRemovedElement, 1);
        this.checkedValues += 1;
      }

    } else {
      this.valuesToFilter.length = 0;
      this.checkedValues = this.maxCheckedValues;
    }
  }

  allValuesChecked() {
    return this.checkedValues === this.maxCheckedValues;
  }
}

class Controller {
  constructor(hotInstance, options = {}) {
    const {addConditionsByValue, filter, removeConditions} = options;

    this.hot = hotInstance;
    this.state = new State(hotInstance.getSourceData(), hotInstance.getColHeader(), options.selectedColumn);
    new DOMHelper(this.state, {addConditionsByValue, filter, removeConditions});
  }
}

const container = document.querySelector('#example4');
const hot = new Handsontable(container, {
  data: [
    ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
    ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
    ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
    ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
    ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
  ],
  height: 'auto',
  colHeaders: true,
  rowHeaders: true,
  filters: true,
  colWidths: 100,
  editor: false,
  fillHandle: false,
  licenseKey: 'non-commercial-and-evaluation',
  afterInit() {
    const filtersPlugin = this.getPlugin('filters');

    new Controller(this, {
      selectedColumn: 0,
      addConditionsByValue: curry((values, column) => {
        values.forEach(value => filtersPlugin.addCondition(column, 'not_contains', [value]));
      }),
      filter: () => filtersPlugin.filter(),
      removeConditions: column => filtersPlugin.removeConditions(column)
    });
  }
});
```
:::
:::

::: only-for react
::: example #example4 :react
```jsx
import React, { useEffect, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

export const ExampleComponent = () => {
  const hotRef = useRef(null);
  const [colHeaders, setColHeaders] = React.useState([]);
  const [selectedColumnIndex, setSelectedColumnIndex] = React.useState(0);
  const [rowEntries, setRowEntries] = React.useState([]);
  const [selectedRowEntries, setSelectedRowEntries] = React.useState([]);

  const selectEntry = (rowEntry) => {
    if (selectedRowEntries.includes(rowEntry)) {
      setSelectedRowEntries(selectedRowEntries.filter(entry => entry !== rowEntry));

    } else {
      setSelectedRowEntries([...selectedRowEntries, rowEntry]);
    }
  };

  const toggleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRowEntries(rowEntries);

    } else {
      setSelectedRowEntries([]);
    }
  }

  let updateSelectedColumn;
  let applyFilter;
  let clearFilter;

  useEffect(() => {
    const hot = hotRef.current.hotInstance;
    const filtersPlugin = hot.getPlugin('filters');

    if (colHeaders.length === 0) {
      const fetchedEntries = hot.getSourceDataAtCol(0);

      setColHeaders(hot.getColHeader());
      setRowEntries(fetchedEntries);
      setSelectedRowEntries(fetchedEntries);
    }

    updateSelectedColumn = (event) => {
      const fetchedEntries = hot.getSourceDataAtCol(event.target.value);

      clearFilter();
      setRowEntries(fetchedEntries);
      setSelectedColumnIndex(event.target.value);
      setSelectedRowEntries(fetchedEntries);
    };

    applyFilter = () => {
      filtersPlugin.removeConditions(selectedColumnIndex);
      if (selectedRowEntries.length) {
        selectedRowEntries.forEach((selectedEntry) => {
          filtersPlugin.addCondition(selectedColumnIndex, 'contains', [selectedEntry], 'disjunction');
        });

      } else {
        rowEntries.forEach((selectedEntry) => {
          filtersPlugin.addCondition(selectedColumnIndex, 'not_contains', [selectedEntry], 'conjunction');
        });
      }

      filtersPlugin.filter();
    };

    clearFilter = () => {
      filtersPlugin.removeConditions(selectedColumnIndex);
      filtersPlugin.filter();
      setSelectedRowEntries(rowEntries);
    };
  });

  return (
    <>
      <HotTable
        ref={hotRef}
        data={[
          ['Lorem', 'ipsum', 'dolor', 'sit', '12/1/2015', 23],
          ['adipiscing', 'elit', 'Ut', 'imperdiet', '5/12/2015', 6],
          ['Pellentesque', 'vulputate', 'leo', 'semper', '10/23/2015', 26],
          ['diam', 'et', 'malesuada', 'libero', '12/1/2014', 98],
          ['orci', 'et', 'dignissim', 'hendrerit', '12/1/2016', 8.5]
        ]}
        height="auto"
        colHeaders={true}
        rowHeaders={true}
        filters={true}
        colWidths={100}
        editor={false}
        fillHandle={false}
        licenseKey="non-commercial-and-evaluation"
      />
      <div id="externalFilter">
        <div className="columnChoose">
          <label>Choose Column: </label>
          <select onChange={(event) => updateSelectedColumn(event)}>
            {colHeaders.map(
              (headerLabel, index) => <option key={`${headerLabel}-${index}`} value={index}>{headerLabel}</option>
            )}
          </select>
        </div>

        <div id="filterSelect">
          <div className="controllers">
            <div>
              <label><input type="checkbox" onChange={(event) => toggleSelectAll(event)} id="filtersSelectAll"
                defaultChecked="checked"/> (Select all)</label>
            </div>
          </div>
          <div className="items">
            {rowEntries.map(
              (rowEntry, index) => <React.Fragment key={`${rowEntry}-${index}`}>
                <label><input type="checkbox" onChange={() => selectEntry(rowEntry)}
                  checked={selectedRowEntries.includes(rowEntry)}/>{rowEntry}</label><br/>
              </React.Fragment>
            )}
          </div>
        </div>

        <div className="buttons controls">
          <button onClick={() => applyFilter()} className="apply">Apply filter</button>
          <button onClick={() => clearFilter()} className="clear">Clear filter</button>
        </div>
      </div>

    </>
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example4'));
/* end:skip-in-preview */
```
:::
:::

## Related API reference

- Configuration options:
  - [`dropdownMenu`](@/api/options.md#dropdownmenu)
  - [`filters`](@/api/options.md#filters)
- Hooks:
  - [`afterFilter`](@/api/hooks.md#afterfilter)
  - [`beforeFilter`](@/api/hooks.md#beforefilter)
- Plugins:
  - [`DropdownMenu`](@/api/dropdownMenu.md)
  - [`Filters`](@/api/filters.md)
