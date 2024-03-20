import { defineComponent } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';

/* start:skip-in-preview */
import { createApp } from 'vue';

// register Handsontable's modules
registerAllModules();

const ExampleComponent = defineComponent({
  data() {
    return {
      hotSettings: {
        startRows: 5,
        startCols: 5,
        colHeaders: true,
        stretchH: 'all',
        autoWrapRow: true,
        autoWrapCol: true,
        licenseKey: 'non-commercial-and-evaluation'
      },
      id: 'my-custom-id',
      className: 'my-custom-classname',
      style: 'height: 142px; overflow: hidden; border: 1px solid red;'
    };
  },
  components: {
    HotTable,
  }
});

export default ExampleComponent;

const app = createApp(ExampleComponent);

app.mount('#example1');
/* end:skip-in-preview */
