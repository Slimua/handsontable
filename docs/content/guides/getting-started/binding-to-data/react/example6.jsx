import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

export const ExampleComponent = () => {
  return (
    <HotTable
      data={[]}
      dataSchema={{
        id: null,
        name: {
          first: null,
          last: null
        },
        address: null
      }}
      startRows={5}
      startCols={4}
      colHeaders={['ID', 'First Name', 'Last Name', 'Address']}
      height="auto"
      width="auto"
      columns={[
        { data: 'id' },
        { data: 'name.first' },
        { data: 'name.last' },
        { data: 'address' }
      ]}
      minSpareRows={1}
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation"
    />
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example6'));
/* end:skip-in-preview */