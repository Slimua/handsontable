---
title: Referencing the Handsontable instance
permalink: /next/angular-hot-reference
canonicalUrl: /angular-hot-reference
---

# Referencing the Handsontable instance

An implementation of the `@handsontable/angular` explaining how to reference the Handsontable instance from the wrapper component.

::: example :angular --html 1 --js 2
```html
<app-root></app-root>
```
```js
// app.component.ts
import { Component } from '@angular/core';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';

@Component({
  selector: 'app-root',
  template: `
  <div class="hot">
    <hot-table [hotId]="id" [settings]="hotSettings"></hot-table>
  </div>
  <br>
  <button (click)="swapHotData()">Load new data!</button>
  `,
})
class AppComponent {
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  hotSettings: Handsontable.GridSettings = {
    data: Handsontable.helper.createSpreadsheetData(4, 4),
    colHeaders: true
  };

  swapHotData() {
    this.hotRegisterer.getInstance(this.id).loadData([['new', 'data']]);
  }
}

// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HotTableModule } from '@handsontable/angular';

@NgModule({
  imports:      [ BrowserModule, HotTableModule.forRoot() ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
class AppModule { }

// bootstrap
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => { console.error(err) });
```
:::
