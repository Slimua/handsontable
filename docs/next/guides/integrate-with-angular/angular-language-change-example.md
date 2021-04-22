---
title: Language change example
permalink: /next/angular-language-change-example
canonicalUrl: /angular-language-change-example
---

# Language change example

An implementation of the `@handsontable/angular` component with an option to change the Context Menu language. Select a language from the selector above the table and open the Context Menu to see the result.

```js
// app.component.ts
import { Component } from '@angular/core';
import * as Handsontable from 'handsontable';

@Component({
  selector: 'app-root',
  template: `
  <label for="languages">Select language:</label>
  <select [(ngModel)]="language">
    <option *ngFor="let l of languages" [value]="l.languageCode">{{l.languageCode}}</option>
  </select><br/><br/>
  <div class="hot">
    <hot-table [language]="language" [settings]="hotSettings"></hot-table>
  </div>
  `,
})
class AppComponent {
  hotSettings: Handsontable.GridSettings = {
    data: Handsontable.helper.createSpreadsheetData(5, 10),
    colHeaders: true,
    rowHeaders: true,
    contextMenu: true,
    licenseKey: 'non-commercial-and-evaluation'
  };
  language = 'en-US';
  languages = Handsontable.languages.getLanguagesDictionaries();
}

// app.module.ts
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HotTableModule } from '@handsontable/angular';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HotTableModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
class AppModule { }

// bootstrap
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => { console.error(err) });
```
