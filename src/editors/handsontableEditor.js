import { KEY_CODES } from './../helpers/unicode';
import { extend } from './../helpers/object';
import { setCaretPosition } from './../helpers/dom/element';
import { stopImmediatePropagation, isImmediatePropagationStopped } from './../helpers/dom/event';
import TextEditor from './textEditor';

const onBeforeKeyDown = function(event) {
  if (isImmediatePropagationStopped(event)) {
    return;
  }
  const editor = this.getActiveEditor();

  const innerHOT = editor.htEditor.getInstance();

  let rowToSelect;
  let selectedRow;

  if (event.keyCode === KEY_CODES.ARROW_DOWN) {
    if (!innerHOT.getSelectedLast() && !innerHOT.flipped) {
      rowToSelect = 0;
    } else if (innerHOT.getSelectedLast()) {
      if (innerHOT.flipped) {
        rowToSelect = innerHOT.getSelectedLast()[0] + 1;
      } else if (!innerHOT.flipped) {
        const lastRow = innerHOT.countRows() - 1;
        selectedRow = innerHOT.getSelectedLast()[0];
        rowToSelect = Math.min(lastRow, selectedRow + 1);
      }
    }
  } else if (event.keyCode === KEY_CODES.ARROW_UP) {
    if (!innerHOT.getSelectedLast() && innerHOT.flipped) {
      rowToSelect = innerHOT.countRows() - 1;

    } else if (innerHOT.getSelectedLast()) {
      if (innerHOT.flipped) {
        selectedRow = innerHOT.getSelectedLast()[0];
        rowToSelect = Math.max(0, selectedRow - 1);
      } else {
        selectedRow = innerHOT.getSelectedLast()[0];
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

/**
 * @private
 * @editor HandsontableEditor
 * @class HandsontableEditor
 * @dependencies TextEditor
 */
class HandsontableEditor extends TextEditor {
  createElements(...args) {
    super.createElements(...args);

    const DIV = document.createElement('DIV');
    DIV.className = 'handsontableEditor';
    this.TEXTAREA_PARENT.appendChild(DIV);

    this.htContainer = DIV;
    this.assignHooks();
  }

  prepare(td, row, col, prop, value, cellProperties, ...args) {
    super.prepare(td, row, col, prop, value, cellProperties, ...args);

    const parent = this;
    const options = {
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
      autoWrapCol: false,
      autoWrapRow: false,
      afterOnCellMouseDown(_, coords) {
        const sourceValue = this.getSourceData(coords.row, coords.col);

        // if the value is undefined then it means we don't want to set the value
        if (sourceValue !== void 0) {
          parent.setValue(sourceValue);
        }
        parent.instance.destroyEditor();
      }
    };

    if (this.cellProperties.handsontable) {
      extend(options, cellProperties.handsontable);
    }
    this.htOptions = options;
  }

  open(...args) {
    this.instance.addHook('beforeKeyDown', onBeforeKeyDown);

    super.open(...args);

    if (this.htEditor) {
      this.htEditor.destroy();
    }

    if (this.htContainer.style.display === 'none') {
      this.htContainer.style.display = '';
    }

    // Construct and initialise a new Handsontable
    this.htEditor = new this.instance.constructor(this.htContainer, this.htOptions);
    this.htEditor.init();
    this.htEditor.rootElement.style.display = '';

    if (this.cellProperties.strict) {
      this.htEditor.selectCell(0, 0);
    } else {
      this.htEditor.deselectCell();
    }

    setCaretPosition(this.TEXTAREA, 0, this.TEXTAREA.value.length);
  }

  close(...args) {
    this.htEditor.rootElement.style.display = 'none';
    this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
    super.close(...args);
  }

  focus(...args) {
    super.focus(...args);
  }

  beginEditing(...args) {
    const onBeginEditing = this.instance.getSettings().onBeginEditing;

    if (onBeginEditing && onBeginEditing() === false) {
      return;
    }
    super.beginEditing(...args);
  }

  finishEditing(...args) {
    if (this.htEditor && this.htEditor.isListening()) { // if focus is still in the HOT editor
      this.instance.listen(); // return the focus to the parent HOT instance
    }

    if (this.htEditor && this.htEditor.getSelectedLast()) {
      const value = this.htEditor.getInstance().getValue();

      if (value !== void 0) { // if the value is undefined then it means we don't want to set the value
        this.setValue(value);
      }
    }

    return super.finishEditing(...args);
  }

  assignHooks() {
    this.instance.addHook('afterDestroy', () => {
      if (this.htEditor) {
        this.htEditor.destroy();
      }
    });
  }
}

export default HandsontableEditor;
