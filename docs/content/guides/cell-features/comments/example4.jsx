import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

export const ExampleComponent = () => {
  return (
    <HotTable
      data={[
        ['', 'Tesla', 'Toyota', 'Honda', 'Ford'],
        ['2018', 10, 11, 12, 13, 15, 16],
        ['2019', 10, 11, 12, 13, 15, 16],
        ['2020', 10, 11, 12, 13, 15, 16],
      ]}
      rowHeaders={true}
      colHeaders={true}
      contextMenu={true}
      comments={{
        // on mouseover, wait 2 seconds before the comment box displays
        displayDelay: 2000,
      }}
      cell={[
        { row: 1, col: 1, comment: { value: 'Some comment' } },
      ]}
      height="auto"
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation"
    />
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example4'));
/* end:skip-in-preview */