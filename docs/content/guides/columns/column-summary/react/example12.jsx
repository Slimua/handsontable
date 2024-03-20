import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

export const ExampleComponent = () => {
  return (
    <HotTable
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation"
      data={[
        [0.5, 0.5],
        [0.5, 0.5],
        [1, 1],
        [],
        []
      ]}
      colHeaders={true}
      rowHeaders={true}
      columnSummary={[{
          type: 'average',
          destinationRow: 0,
          destinationColumn: 0,
          reversedRowCoords: true
        },
        {
          type: 'average',
          destinationRow: 0,
          destinationColumn: 1,
          reversedRowCoords: true,
          // round this column summary result to two digits after the decimal point
          roundFloat: 2
        }
      ]}
    />
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example12'));
/* end:skip-in-preview */