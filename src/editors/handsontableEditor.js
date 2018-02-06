import { KEY_CODES } from './../helpers/unicode';
import { extend } from './../helpers/object';
import { setCaretPosition } from './../helpers/dom/element';
import { stopImmediatePropagation, isImmediatePropagationStopped } from './../helpers/dom/event';
import TextEditor from './textEditor';

const HandsontableEditor = TextEditor.prototype.extend();

/**
 * @private
 * @editor HandsontableEditor
 * @class HandsontableEditor
 * @dependencies TextEditor
 */
HandsontableEditor.prototype.createElements = function (...args) {
  TextEditor.prototype.createElements.apply(this, args);

  var DIV = document.createElement('DIV');
  DIV.className = 'handsontableEditor';
  this.TEXTAREA_PARENT.appendChild(DIV);

  this.htContainer = DIV;
  this.assignHooks();
};

HandsontableEditor.prototype.prepare = function (row, col, prop, td, originalValue, cellProperties) {
  TextEditor.prototype.prepare.apply(this, [row, col, prop, td, originalValue, cellProperties]);

  var parent = this;
  var options = {
    startRows: 0,
    startCols: 0,
    minRows: 0,
    minCols: 0,
    className: 'listbox',
    copyPaste: false,
    autoColumnSize: false,
    autoRowSize: false,
    readOnly: true,
    fillHandle: false,
    afterOnCellMouseDown(_, coords) {
      let sourceValue = this.getSourceData(coords.row, coords.col);

      // if the value is undefined then it means we don't want to set the value
      if (sourceValue !== void 0) {
        parent.setValue(sourceValue);
      }
      parent.instance.destroyEditor();
    },
  };

  if (this.cellProperties.handsontable) {
    extend(options, cellProperties.handsontable);
  }
  this.htOptions = options;
};

var onBeforeKeyDown = function (event) {
  if (isImmediatePropagationStopped(event)) {
    return;
  }
  var editor = this.getActiveEditor();

  var innerHOT = editor.htEditor.getInstance();

  var rowToSelect;
  var selectedRow;

  if (event.keyCode === KEY_CODES.ARROW_DOWN) {
    if (!innerHOT.getSelected() && !innerHOT.flipped) {
      rowToSelect = 0;
    } else if (innerHOT.getSelected()) {
      if (innerHOT.flipped) {
        rowToSelect = innerHOT.getSelected()[0] + 1;
      } else if (!innerHOT.flipped) {
        [selectedRow] = innerHOT.getSelected();
        var lastRow = innerHOT.countRows() - 1;
        rowToSelect = Math.min(lastRow, selectedRow + 1);
      }
    }
  } else if (event.keyCode === KEY_CODES.ARROW_UP) {
    if (!innerHOT.getSelected() && innerHOT.flipped) {
      rowToSelect = innerHOT.countRows() - 1;

    } else if (innerHOT.getSelected()) {
      if (innerHOT.flipped) {
        [selectedRow] = innerHOT.getSelected();
        rowToSelect = Math.max(0, selectedRow - 1);
      } else {
        [selectedRow] = innerHOT.getSelected();
        rowToSelect = selectedRow - 1;
      }
    }
  }

  if (rowToSelect !== void 0) {
    if (rowToSelect < 0 || (innerHOT.flipped && rowToSelect > innerHOT.countRows() - 1)) {
      innerHOT.deselectCell();
    } else {
      innerHOT.selectCell(rowToSelect, 0);
    }
    if (innerHOT.getData().length) {
      event.preventDefault();
      stopImmediatePropagation(event);

      editor.instance.listen();
      editor.TEXTAREA.focus();
    }
  }
};

HandsontableEditor.prototype.open = function (...args) {
  this.instance.addHook('beforeKeyDown', onBeforeKeyDown);

  TextEditor.prototype.open.apply(this, args);

  if (this.htEditor) {
    this.htEditor.destroy();
  }
  // Construct and initialise a new Handsontable
  this.htEditor = new this.instance.constructor(this.htContainer, this.htOptions);
  this.htEditor.init();

  if (this.cellProperties.strict) {
    this.htEditor.selectCell(0, 0);
    this.TEXTAREA.style.visibility = 'hidden';
  } else {
    this.htEditor.deselectCell();
    this.TEXTAREA.style.visibility = 'visible';
  }

  setCaretPosition(this.TEXTAREA, 0, this.TEXTAREA.value.length);
};

HandsontableEditor.prototype.close = function (...args) {
  this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
  this.instance.listen();

  TextEditor.prototype.close.apply(this, args);
};

HandsontableEditor.prototype.focus = function (...args) {
  this.instance.listen();
  TextEditor.prototype.focus.apply(this, args);
};

HandsontableEditor.prototype.beginEditing = function (initialValue) {
  let { onBeginEditing } = this.instance.getSettings();

  if (onBeginEditing && onBeginEditing() === false) {
    return;
  }
  TextEditor.prototype.beginEditing.apply(this, [initialValue]);
};

HandsontableEditor.prototype.finishEditing = function (isCancelled, ctrlDown) {
  if (this.htEditor && this.htEditor.isListening()) { // if focus is still in the HOT editor

    this.instance.listen(); // return the focus to the parent HOT instance
  }

  if (this.htEditor && this.htEditor.getSelected()) {
    var value = this.htEditor.getInstance().getValue();

    if (value !== void 0) { // if the value is undefined then it means we don't want to set the value
      this.setValue(value);
    }
  }

  return TextEditor.prototype.finishEditing.apply(this, [isCancelled, ctrlDown]);
};

HandsontableEditor.prototype.assignHooks = function () {
  var _this = this;

  this.instance.addHook('afterDestroy', () => {
    if (_this.htEditor) {
      _this.htEditor.destroy();
    }
  });
};

export default HandsontableEditor;
