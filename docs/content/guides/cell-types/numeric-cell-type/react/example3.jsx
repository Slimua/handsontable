import { HotTable, HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import numbro from 'numbro';
import jaJP from 'numbro/languages/ja-JP';
import trTR from 'numbro/languages/tr-TR';
import 'handsontable/dist/handsontable.full.min.css';

// register Handsontable's modules
registerAllModules();

// register the languages you need
numbro.registerLanguage(jaJP);
numbro.registerLanguage(trTR);

// define formats
const formatJP = {
  pattern: '0,0.00 $',
  culture: 'ja-JP',
};

const formatTR = {
  pattern: '0,0.00 $',
  culture: 'tr-TR',
};

export const ExampleComponent = () => {
  return (
    <HotTable
      data={[
        {
          productName: 'Product A',
          JP_price: 1450.32,
          TR_price: 202.14,
        },
        {
          productName: 'Product B',
          JP_price: 2430.22,
          TR_price: 338.86,
        },
        {
          productName: 'Product C',
          JP_price: 3120.10,
          TR_price: 435.20,
        },
      ]}
      autoRowSize={false}
      autoColumnSize={false}
      columnSorting={true}
      colHeaders={['Product name', 'Price in Japan', 'Price in Turkey']}
      height="auto"
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation"
    >
      <HotColumn data="productName" type="text" width="120" />
      <HotColumn data="JP_price" type="numeric" numericFormat={formatJP} width="120" />
      <HotColumn data="TR_price" type="numeric" numericFormat={formatTR} width="120" />
    </HotTable>
  );
};

/* start:skip-in-preview */
ReactDOM.render(<ExampleComponent />, document.getElementById('example3'));
/* end:skip-in-preview */