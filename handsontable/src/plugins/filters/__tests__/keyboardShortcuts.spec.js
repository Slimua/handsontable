describe('Filters keyboard shortcut', () => {
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

  describe('"Alt" + "A"', () => {
    it('should remove filters condition from all columns (without any selection)', () => {
      handsontable({
        data: getDataForFilters().splice(0, 10),
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
      });

      const plugin = getPlugin('filters');

      plugin.addCondition(1, 'contains', ['a'], 'conjunction');
      plugin.addCondition(2, 'contains', ['a'], 'conjunction');
      plugin.addCondition(4, 'begins_with', ['green'], 'conjunction');
      plugin.filter();

      listen();
      keyDownUp(['alt', 'a']);

      expect(plugin.conditionCollection.getFilteredColumns().length).toBe(0);
      expect(getSelected()).toBeUndefined();
    });

    it('should remove filters condition from all columns (cell is selected)', () => {
      handsontable({
        data: getDataForFilters().splice(0, 10),
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
      });

      const plugin = getPlugin('filters');

      plugin.addCondition(1, 'contains', ['a'], 'conjunction');
      plugin.addCondition(2, 'contains', ['a'], 'conjunction');
      plugin.addCondition(4, 'begins_with', ['green'], 'conjunction');
      plugin.filter();

      selectCell(1, 3);
      keyDownUp(['alt', 'a']);

      expect(plugin.conditionCollection.getFilteredColumns().length).toBe(0);
      expect(getSelectedRange()).toEqualCellRange(['highlight: 1,3 from: 1,3 to: 1,3']);
    });

    it('should remove filters condition from all columns (column header is selected)', () => {
      handsontable({
        data: getDataForFilters().splice(0, 10),
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
        navigableHeaders: true,
      });

      const plugin = getPlugin('filters');

      plugin.addCondition(1, 'contains', ['a'], 'conjunction');
      plugin.addCondition(2, 'contains', ['a'], 'conjunction');
      plugin.addCondition(4, 'begins_with', ['green'], 'conjunction');
      plugin.filter();

      selectCell(-1, 3);
      keyDownUp(['alt', 'a']);

      expect(plugin.conditionCollection.getFilteredColumns().length).toBe(0);
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,3 from: -1,3 to: -1,3']);
    });

    it('should remove filters condition from all columns (row header is selected)', () => {
      handsontable({
        data: getDataForFilters().splice(0, 10),
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
        navigableHeaders: true,
      });

      const plugin = getPlugin('filters');

      plugin.addCondition(1, 'contains', ['a'], 'conjunction');
      plugin.addCondition(2, 'contains', ['a'], 'conjunction');
      plugin.addCondition(4, 'begins_with', ['green'], 'conjunction');
      plugin.filter();

      selectCell(3, -1);
      keyDownUp(['alt', 'a']);

      expect(plugin.conditionCollection.getFilteredColumns().length).toBe(0);
      expect(getSelectedRange()).toEqualCellRange(['highlight: 3,-1 from: 3,-1 to: 3,-1']);
    });

    it('should remove filters condition from all columns (corner is selected)', () => {
      handsontable({
        data: getDataForFilters().splice(0, 10),
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
        navigableHeaders: true,
      });

      const plugin = getPlugin('filters');

      plugin.addCondition(1, 'contains', ['a'], 'conjunction');
      plugin.addCondition(2, 'contains', ['a'], 'conjunction');
      plugin.addCondition(4, 'begins_with', ['green'], 'conjunction');
      plugin.filter();

      selectCell(-1, -1);
      keyDownUp(['alt', 'a']);

      expect(plugin.conditionCollection.getFilteredColumns().length).toBe(0);
      expect(getSelectedRange()).toEqualCellRange(['highlight: -1,-1 from: -1,-1 to: -1,-1']);
    });
  });
});
