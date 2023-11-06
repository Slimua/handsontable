describe('CopyPaste', () => {
  const id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
    // Installing spy stabilizes the tests. Without that on CI and real browser there are some
    // differences in results.
    spyOn(document, 'execCommand');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('`afterCopy` hook', () => {
    it('should be called with coords and dataset points to the cells only', () => {
      const afterCopySpy = jasmine.createSpy('afterCopy');

      handsontable({
        data: createSpreadsheetData(5, 5),
        colHeaders: true,
        copyPaste: true,
        afterCopy: afterCopySpy,
      });

      const copyEvent = getClipboardEvent();
      const plugin = getPlugin('CopyPaste');

      selectCell(1, 2, 3, 4);

      plugin.copyCellsOnly();
      plugin.onCopy(copyEvent); // emulate native "copy" event

      /* eslint-disable indent */
      expect(copyEvent.clipboardData.getData('text/html')).toBe(
        '<meta name="generator" content="Handsontable"/>' +
        '<style type="text/css">td{white-space:normal}br{mso-data-placement:same-cell}</style>' +
        '<table>' +
        '<!--StartFragment-->' +
          '<tbody>' +
            '<tr>' +
              '<td>C2</td>' +
              '<td>D2</td>' +
              '<td>E2</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C3</td>' +
              '<td>D3</td>' +
              '<td>E3</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C4</td>' +
              '<td>D4</td>' +
              '<td>E4</td>' +
            '</tr>' +
          '</tbody>' +
          '<!--EndFragment-->' +
        '</table>',
      );
      /* eslint-enable */
      expect(afterCopySpy.calls.argsFor(0)[0].getMetaInfo()).toEqual({
        data: [['C2', 'D2', 'E2'], ['C3', 'D3', 'E3'], ['C4', 'D4', 'E4']]
      });
    });

    it('should be called with coords and dataset points to the cells and the first column headers ' +
      'nearest the cells (single-line column headers configuration)', () => {
      const afterCopySpy = jasmine.createSpy('afterCopy');

      handsontable({
        data: createSpreadsheetData(5, 5),
        colHeaders: true,
        copyPaste: true,
        afterCopy: afterCopySpy,
      });

      const copyEvent = getClipboardEvent();
      const plugin = getPlugin('CopyPaste');

      selectCell(1, 2, 3, 4);

      plugin.copyWithColumnHeaders();
      plugin.onCopy(copyEvent); // emulate native "copy" event

      /* eslint-disable indent */
      expect(copyEvent.clipboardData.getData('text/html')).toBe(
        '<meta name="generator" content="Handsontable"/>' +
        '<style type="text/css">td{white-space:normal}br{mso-data-placement:same-cell}</style>' +
        '<table>' +
        '<!--StartFragment-->' +
          '<thead>' +
            '<tr>' +
              '<th>C</th>' +
              '<th>D</th>' +
              '<th>E</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr>' +
              '<td>C2</td>' +
              '<td>D2</td>' +
              '<td>E2</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C3</td>' +
              '<td>D3</td>' +
              '<td>E3</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C4</td>' +
              '<td>D4</td>' +
              '<td>E4</td>' +
            '</tr>' +
          '</tbody>' +
        '<!--EndFragment-->' +
        '</table>',
      );
      /* eslint-enable */
      expect(afterCopySpy.calls.argsFor(0)[0].getMetaInfo()).toEqual({
        colHeaders: ['C', 'D', 'E'],
        data: [['C2', 'D2', 'E2'], ['C3', 'D3', 'E3'], ['C4', 'D4', 'E4']],
      });
    });

    it('should be called with coords and dataset points to the cells and the first column headers ' +
      'nearest the cells (multi-line column headers configuration)', () => {
      const afterCopySpy = jasmine.createSpy('afterCopy');

      handsontable({
        data: createSpreadsheetData(5, 5),
        colHeaders: true,
        copyPaste: true,
        afterGetColumnHeaderRenderers(renderers) {
          renderers.length = 0;
          renderers.push((renderedColumnIndex, TH) => {
            TH.innerText = this.getColHeader(renderedColumnIndex, 0);
          });
          renderers.push((renderedColumnIndex, TH) => {
            TH.innerText = this.getColHeader(renderedColumnIndex, 1);
          });
        },
        afterCopy: afterCopySpy,
      });

      const copyEvent = getClipboardEvent();
      const plugin = getPlugin('CopyPaste');

      selectCell(1, 2, 3, 4);

      plugin.copyWithColumnHeaders();
      plugin.onCopy(copyEvent); // emulate native "copy" event

      expect(copyEvent.clipboardData.getData('text/html')).toBe(
        '<meta name="generator" content="Handsontable"/>' +
        '<style type="text/css">td{white-space:normal}br{mso-data-placement:same-cell}</style>' +
        '<table>' +
        '<!--StartFragment-->' +
          '<thead>' +
            '<tr>' +
              '<th>C</th>' +
              '<th>D</th>' +
              '<th>E</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr>' +
              '<td>C2</td>' +
              '<td>D2</td>' +
              '<td>E2</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C3</td>' +
              '<td>D3</td>' +
              '<td>E3</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C4</td>' +
              '<td>D4</td>' +
              '<td>E4</td>' +
            '</tr>' +
          '</tbody>' +
        '<!--EndFragment-->' +
        '</table>',
      );
      expect(afterCopySpy.calls.argsFor(0)[0].getMetaInfo()).toEqual({
        colHeaders: ['C', 'D', 'E'],
        data: [['C2', 'D2', 'E2'], ['C3', 'D3', 'E3'], ['C4', 'D4', 'E4']]
      });
    });

    it('should be called with coords and dataset points to the cells and all column header layers', () => {
      const afterCopySpy = jasmine.createSpy('afterCopy');

      handsontable({
        data: createSpreadsheetData(5, 5),
        colHeaders: true,
        copyPaste: true,
        afterGetColumnHeaderRenderers(renderers) {
          renderers.length = 0;
          renderers.push((renderedColumnIndex, TH) => {
            TH.innerText = this.getColHeader(renderedColumnIndex, 0);
          });
          renderers.push((renderedColumnIndex, TH) => {
            TH.innerText = this.getColHeader(renderedColumnIndex, 1);
          });
          renderers.push((renderedColumnIndex, TH) => {
            TH.innerText = this.getColHeader(renderedColumnIndex, 2);
          });
        },
        afterCopy: afterCopySpy,
      });

      const copyEvent = getClipboardEvent();
      const plugin = getPlugin('CopyPaste');

      selectCell(1, 2, 3, 3);

      plugin.copyWithAllColumnHeaders();
      plugin.onCopy(copyEvent); // emulate native "copy" event

      expect(copyEvent.clipboardData.getData('text/html')).toBe(
        '<meta name="generator" content="Handsontable"/>' +
        '<style type="text/css">td{white-space:normal}br{mso-data-placement:same-cell}</style>' +
        '<table>' +
        '<!--StartFragment-->' +
          '<thead>' +
            '<tr>' +
              '<th>C</th>' +
              '<th>D</th>' +
            '</tr>' +
            '<tr>' +
              '<th>C</th>' +
              '<th>D</th>' +
            '</tr>' +
            '<tr>' +
              '<th>C</th>' +
              '<th>D</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            '<tr>' +
              '<td>C2</td>' +
              '<td>D2</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C3</td>' +
              '<td>D3</td>' +
            '</tr>' +
            '<tr>' +
              '<td>C4</td>' +
              '<td>D4</td>' +
            '</tr>' +
          '</tbody>' +
        '<!--EndFragment-->' +
        '</table>',
      );

      expect(afterCopySpy.calls.argsFor(0)[0].getMetaInfo()).toEqual({
        nestedHeaders: [['C', 'D'], ['C', 'D'], ['C', 'D']],
        data: [['C2', 'D2'], ['C3', 'D3'], ['C4', 'D4']]
      });
    });
  });
});
