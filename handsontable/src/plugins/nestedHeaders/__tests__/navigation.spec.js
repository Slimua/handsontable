describe('NestedHeaders', () => {
  const id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('navigation in headers (navigableHeaders on)', () => {
    it('should be possible to move the focus around the headers (autoWrap off)', () => {
      handsontable({
        data: createSpreadsheetData(1, 7),
        colHeaders: true,
        rowHeaders: true,
        navigableHeaders: true,
        nestedHeaders: [
          ['A1', { label: 'B1', colspan: 5 }, 'G1'],
          ['A2', { label: 'B2', colspan: 4 }, 'F2', 'G2'],
          ['A3', { label: 'B3', colspan: 2 }, { label: 'D3', colspan: 2 }, 'F3', 'G3'],
        ],
      });

      selectCell(0, 6);
      keyDownUp('arrowup');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   : # |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,6 from: -1,6 to: -1,6']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       : # :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,5 from: -1,5 to: -1,5']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : #   # :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,4 from: -1,4 to: -1,4']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : #   # :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,2 from: -1,2 to: -1,2']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║ # :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,0 from: -1,0 to: -1,0']);

      keyDownUp('arrowleft');
      keyDownUp('arrowleft'); // the movement should be ignored
      keyDownUp('arrowleft'); // the movement should be ignored

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        | # ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,-1 from: -1,-1 to: -1,-1']);

      keyDownUp('arrowup');

      expect(`
        |   ║   :                   :   |
        | # ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,-1 from: -2,-1 to: -2,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║ # :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,0 from: -2,0 to: -2,0']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   : #   #   #   # :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,1 from: -2,1 to: -2,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               : # :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,5 from: -2,5 to: -2,5']);

      keyDownUp('arrowright');
      keyDownUp('arrowright'); // the movement should be ignored
      keyDownUp('arrowright'); // the movement should be ignored

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   : # |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,6 from: -2,6 to: -2,6']);

      keyDownUp('arrowup');
      keyDownUp('arrowup'); // the movement should be ignored
      keyDownUp('arrowup'); // the movement should be ignored

      expect(`
        |   ║   :                   : # |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,6 from: -3,6 to: -3,6']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,5 from: -3,5 to: -3,5']);

      keyDownUp('arrowleft');

      expect(`
        |   ║ # :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,0 from: -3,0 to: -3,0']);

      keyDownUp('arrowleft');
      keyDownUp('arrowleft'); // the movement should be ignored
      keyDownUp('arrowleft'); // the movement should be ignored

      expect(`
        | # ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,-1 from: -3,-1 to: -3,-1']);
    });

    it('should be possible to move the focus vertically (autoWrap on)', () => {
      handsontable({
        data: createSpreadsheetData(1, 7),
        colHeaders: true,
        rowHeaders: true,
        navigableHeaders: true,
        autoWrapCol: true,
        autoWrapRow: true,
        nestedHeaders: [
          ['A1', { label: 'B1', colspan: 5 }, 'G1'],
          ['A2', { label: 'B2', colspan: 4 }, 'F2', 'G2'],
          ['A3', { label: 'B3', colspan: 2 }, { label: 'D3', colspan: 2 }, 'F3', 'G3'],
        ],
      });

      selectCell(-3, -1);
      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        | # ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,-1 from: -2,-1 to: -2,-1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        | # ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,-1 from: -1,-1 to: -1,-1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        | # ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,-1 from: 0,-1 to: 0,-1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║ # :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,0 from: -3,0 to: -3,0']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║ # :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,0 from: -2,0 to: -2,0']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║ # :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,0 from: -1,0 to: -1,0']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║ - :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║ # :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,0 from: 0,0 to: 0,0']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,1 from: -3,1 to: -3,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   : #   #   #   # :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,1 from: -2,1 to: -2,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : #   # :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,1 from: -1,1 to: -1,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : -   - :       :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   : # :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,1 from: 0,1 to: 0,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,2 from: -3,2 to: -3,2']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   : #   #   #   # :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,2 from: -2,2 to: -2,2']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : #   # :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,2 from: -1,2 to: -1,2']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : -   - :       :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   : # :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,2 from: 0,2 to: 0,2']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,3 from: -3,3 to: -3,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   : #   #   #   # :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,3 from: -2,3 to: -2,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : #   # :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,3 from: -1,3 to: -1,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : -   - :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   : # :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,3 from: 0,3 to: 0,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,4 from: -3,4 to: -3,4']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   : #   #   #   # :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,4 from: -2,4 to: -2,4']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : #   # :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,4 from: -1,4 to: -1,4']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : -   - :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   :   : # :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,4 from: 0,4 to: 0,4']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,5 from: -3,5 to: -3,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               : # :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,5 from: -2,5 to: -2,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       : # :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,5 from: -1,5 to: -1,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       : - :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   :   :   : # :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,5 from: 0,5 to: 0,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   : # |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,6 from: -3,6 to: -3,6']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   : # |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,6 from: -2,6 to: -2,6']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   : # |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,6 from: -1,6 to: -1,6']);

      keyDownUp('arrowdown');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   : - |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   :   :   :   : # |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,6 from: 0,6 to: 0,6']);

      keyDownUp('arrowdown');

      expect(`
        | # ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,-1 from: -3,-1 to: -3,-1']);
    });

    it('should be possible to move the focus horizontally (autoWrap on)', () => {
      handsontable({
        data: createSpreadsheetData(1, 7),
        colHeaders: true,
        rowHeaders: true,
        navigableHeaders: true,
        autoWrapCol: true,
        autoWrapRow: true,
        nestedHeaders: [
          ['A1', { label: 'B1', colspan: 5 }, 'G1'],
          ['A2', { label: 'B2', colspan: 4 }, 'F2', 'G2'],
          ['A3', { label: 'B3', colspan: 2 }, { label: 'D3', colspan: 2 }, 'F3', 'G3'],
        ],
      });

      selectCell(-3, -1);
      keyDownUp('arrowright');

      expect(`
        |   ║ # :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,0 from: -3,0 to: -3,0']);

      keyDownUp('arrowright');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,1 from: -3,1 to: -3,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   : # |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,6 from: -3,6 to: -3,6']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        | # ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,-1 from: -2,-1 to: -2,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║ # :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,0 from: -2,0 to: -2,0']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   : #   #   #   # :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,1 from: -2,1 to: -2,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               : # :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,5 from: -2,5 to: -2,5']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   : # |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,6 from: -2,6 to: -2,6']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        | # ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,-1 from: -1,-1 to: -1,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║ # :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,0 from: -1,0 to: -1,0']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : #   # :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,1 from: -1,1 to: -1,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : #   # :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,3 from: -1,3 to: -1,3']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       : # :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,5 from: -1,5 to: -1,5']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   : # |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,6 from: -1,6 to: -1,6']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        | # ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,-1 from: 0,-1 to: 0,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║ - :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║ # :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,0 from: 0,0 to: 0,0']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : -   - :       :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   : # :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,1 from: 0,1 to: 0,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   : -   - :       :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   : # :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,2 from: 0,2 to: 0,2']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : -   - :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   : # :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,3 from: 0,3 to: 0,3']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : -   - :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   :   : # :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,4 from: 0,4 to: 0,4']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       : - :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   :   :   : # :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,5 from: 0,5 to: 0,5']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   : - |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   :   :   :   : # |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,6 from: 0,6 to: 0,6']);

      keyDownUp('arrowright');

      expect(`
        | # ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,-1 from: -3,-1 to: -3,-1']);
    });

    it('should be possible to move the focus around the headers when some columns are hidden (autoWrap off)', () => {
      const hot = handsontable({
        data: createSpreadsheetData(1, 7),
        colHeaders: true,
        rowHeaders: true,
        navigableHeaders: true,
        nestedHeaders: [
          ['A1', { label: 'B1', colspan: 5 }, 'G1'],
          ['A2', { label: 'B2', colspan: 4 }, 'F2', 'G2'],
          ['A3', { label: 'B3', colspan: 2 }, { label: 'D3', colspan: 2 }, 'F3', 'G3'],
        ],
      });

      const hidingMap = hot.columnIndexMapper.createAndRegisterIndexMap('my-hiding-map', 'hiding');

      hidingMap.setValueAtIndex(1, true); // Hide column that contains cells B{n}
      hidingMap.setValueAtIndex(2, true); // Hide column that contains cells C{n}
      hidingMap.setValueAtIndex(5, true); // Hide column that contains cells F{n}
      hot.render();

      selectCell(0, 6);
      keyDownUp('arrowup');

      expect(`
        |   ║   :       :   |
        |   ║   :       :   |
        |   ║   :       : # |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,6 from: -1,6 to: -1,6']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   :       :   |
        |   ║   :       :   |
        |   ║   : #   # :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,4 from: -1,4 to: -1,4']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   :       :   |
        |   ║   :       :   |
        |   ║ # :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,0 from: -1,0 to: -1,0']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   :       :   |
        |   ║   :       :   |
        | # ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,-1 from: -1,-1 to: -1,-1']);

      keyDownUp('arrowup');

      expect(`
        |   ║   :       :   |
        | # ║   :       :   |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,-1 from: -2,-1 to: -2,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :       :   |
        |   ║ # :       :   |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,0 from: -2,0 to: -2,0']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :       :   |
        |   ║   : #   # :   |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,3 from: -2,3 to: -2,3']);

      keyDownUp('arrowright');

      expect(`
        |   ║   :       :   |
        |   ║   :       : # |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,6 from: -2,6 to: -2,6']);

      keyDownUp('arrowup');

      expect(`
        |   ║   :       : # |
        |   ║   :       :   |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,6 from: -3,6 to: -3,6']);

      keyDownUp('arrowleft');

      expect(`
        |   ║   : #   # :   |
        |   ║   :       :   |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,4 from: -3,4 to: -3,4']);

      keyDownUp('arrowleft');

      expect(`
        |   ║ # :       :   |
        |   ║   :       :   |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,0 from: -3,0 to: -3,0']);

      keyDownUp('arrowleft');

      expect(`
        | # ║   :       :   |
        |   ║   :       :   |
        |   ║   :       :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,-1 from: -3,-1 to: -3,-1']);
    });

    it('should be possible to move the focus vertically when some columns are hidden (autoWrap on)', () => {
      const hot = handsontable({
        data: createSpreadsheetData(1, 7),
        colHeaders: true,
        rowHeaders: true,
        navigableHeaders: true,
        autoWrapCol: true,
        autoWrapRow: true,
        nestedHeaders: [
          ['A1', { label: 'B1', colspan: 5 }, 'G1'],
          ['A2', { label: 'B2', colspan: 4 }, 'F2', 'G2'],
          ['A3', { label: 'B3', colspan: 2 }, { label: 'D3', colspan: 2 }, 'F3', 'G3'],
        ],
      });

      const hidingMap = hot.columnIndexMapper.createAndRegisterIndexMap('my-hiding-map', 'hiding');

      hidingMap.setValueAtIndex(0, true); // Hide column that contains cells A{n}
      hidingMap.setValueAtIndex(2, true); // Hide column that contains cells C{n}
      hidingMap.setValueAtIndex(4, true); // Hide column that contains cells F{n}
      hot.render();

      selectCell(-3, -1);
      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        | # ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,-1 from: -2,-1 to: -2,-1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        | # ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,-1 from: -1,-1 to: -1,-1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        | # ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,-1 from: 0,-1 to: 0,-1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║ #   #   # :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,1 from: -3,1 to: -3,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║ #   # :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,1 from: -2,1 to: -2,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║ # :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,1 from: -1,1 to: -1,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║ - :   :   :   |
        |===:===:===:===:===|
        | - ║ # :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,1 from: 0,1 to: 0,1']);

      keyDownUp('arrowdown');

      expect(`
        |   ║ #   #   # :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,3 from: -3,3 to: -3,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║ #   # :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,3 from: -2,3 to: -2,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   : # :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,3 from: -1,3 to: -1,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   : - :   :   |
        |===:===:===:===:===|
        | - ║   : # :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,3 from: 0,3 to: 0,3']);

      keyDownUp('arrowdown');

      expect(`
        |   ║ #   #   # :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,5 from: -3,5 to: -3,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       : # :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,5 from: -2,5 to: -2,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   : # :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,5 from: -1,5 to: -1,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   : - :   |
        |===:===:===:===:===|
        | - ║   :   : # :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,5 from: 0,5 to: 0,5']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           : # |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,6 from: -3,6 to: -3,6']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   : # |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,6 from: -2,6 to: -2,6']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   :   : # |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,6 from: -1,6 to: -1,6']);

      keyDownUp('arrowdown');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   :   : - |
        |===:===:===:===:===|
        | - ║   :   :   : # |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,6 from: 0,6 to: 0,6']);

      keyDownUp('arrowdown');

      expect(`
        | # ║           :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,-1 from: -3,-1 to: -3,-1']);
    });

    it('should be possible to move the focus horizontally when some columns are hidden (autoWrap on)', () => {
      const hot = handsontable({
        data: createSpreadsheetData(1, 7),
        colHeaders: true,
        rowHeaders: true,
        navigableHeaders: true,
        autoWrapCol: true,
        autoWrapRow: true,
        nestedHeaders: [
          ['A1', { label: 'B1', colspan: 5 }, 'G1'],
          ['A2', { label: 'B2', colspan: 4 }, 'F2', 'G2'],
          ['A3', { label: 'B3', colspan: 2 }, { label: 'D3', colspan: 2 }, 'F3', 'G3'],
        ],
      });

      const hidingMap = hot.columnIndexMapper.createAndRegisterIndexMap('my-hiding-map', 'hiding');

      hidingMap.setValueAtIndex(0, true); // Hide column that contains cells A{n}
      hidingMap.setValueAtIndex(2, true); // Hide column that contains cells C{n}
      hidingMap.setValueAtIndex(4, true); // Hide column that contains cells F{n}
      hot.render();

      selectCell(-3, -1);
      keyDownUp('arrowright');

      expect(`
        |   ║ #   #   # :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,1 from: -3,1 to: -3,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║           : # |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,6 from: -3,6 to: -3,6']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        | # ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,-1 from: -2,-1 to: -2,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║ #   # :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,1 from: -2,1 to: -2,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       : # :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,5 from: -2,5 to: -2,5']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   : # |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,6 from: -2,6 to: -2,6']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        | # ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,-1 from: -1,-1 to: -1,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║ # :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,1 from: -1,1 to: -1,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   : # :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,3 from: -1,3 to: -1,3']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   : # :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,5 from: -1,5 to: -1,5']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   :   : # |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,6 from: -1,6 to: -1,6']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        | # ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,-1 from: 0,-1 to: 0,-1']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║ - :   :   :   |
        |===:===:===:===:===|
        | - ║ # :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,1 from: 0,1 to: 0,1']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   : - :   :   |
        |===:===:===:===:===|
        | - ║   : # :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,3 from: 0,3 to: 0,3']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   : - :   |
        |===:===:===:===:===|
        | - ║   :   : # :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,5 from: 0,5 to: 0,5']);

      keyDownUp('arrowright');

      expect(`
        |   ║           :   |
        |   ║       :   :   |
        |   ║   :   :   : - |
        |===:===:===:===:===|
        | - ║   :   :   : # |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,6 from: 0,6 to: 0,6']);

      keyDownUp('arrowright');

      expect(`
        | # ║           :   |
        |   ║       :   :   |
        |   ║   :   :   :   |
        |===:===:===:===:===|
        |   ║   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,-1 from: -3,-1 to: -3,-1']);
    });

    it('should keep the selected column coordinates untouched when the focus moves up from the cells to nested headers', () => {
      handsontable({
        data: createSpreadsheetData(1, 7),
        colHeaders: true,
        rowHeaders: true,
        navigableHeaders: true,
        nestedHeaders: [
          ['A1', { label: 'B1', colspan: 5 }, 'G1'],
          ['A2', { label: 'B2', colspan: 4 }, 'F2', 'G2'],
          ['A3', { label: 'B3', colspan: 2 }, { label: 'D3', colspan: 2 }, 'F3', 'G3'],
        ],
      });

      selectCell(0, 4);

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : -   - :   :   |
        |===:===:===:===:===:===:===:===|
        | - ║   :   :   :   : # :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: 0,4 from: 0,4 to: 0,4']);

      keyDownUp('arrowup');

      expect(`
        |   ║   :                   :   |
        |   ║   :               :   :   |
        |   ║   :       : #   # :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,4 from: -1,4 to: -1,4']);

      keyDownUp('arrowup');

      expect(`
        |   ║   :                   :   |
        |   ║   : #   #   #   # :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -2,4 from: -2,4 to: -2,4']);

      keyDownUp('arrowup');

      expect(`
        |   ║   : #   #   #   #   # :   |
        |   ║   :               :   :   |
        |   ║   :       :       :   :   |
        |===:===:===:===:===:===:===:===|
        |   ║   :   :   :   :   :   :   |
      `).toBeMatchToSelectionPattern();
      expect(getSelectedRange()).toEqualCellRange(['highlight: -3,4 from: -3,4 to: -3,4']);
    });
  });
});
