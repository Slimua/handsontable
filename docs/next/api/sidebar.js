const fs = require('fs');
const path = require('path');

const apiHighLevelPages = [
  'introduction',
  'core',
  'pluginHooks',
  'metaSchema'
];

const nonPublicPages = [
  'indexMapper',
  'baseEditor',
  'coords',
  'plugins',
  'multipleSelectionHandles',
  'touchScroll',
  'focusableElement',
];

module.exports = {
  sidebar: [
    ...apiHighLevelPages,
    {
      title: 'Plugins',
      path: `/${path.resolve(__dirname, '../').split('/').pop()}/api/plugins`,
      collapsable: false,
      children: fs.readdirSync(path.join(__dirname, './'))
        .filter(f => !['sidebar', ...nonPublicPages, ...apiHighLevelPages].includes(f.split('.').shift()))
    },
  ]
};
