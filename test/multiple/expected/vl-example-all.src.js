import {define, awaitScript} from 'vl-ui-core';

import {VlExampleOne} from '../dist/vl-example.src.js';
import {VlExampleOther} from '../dist/vl-example-other.src.js';

Promise.all([
  awaitScript('vl-map-openlayers', '/node_modules/dependency/script-from-dependency.js'),
]).then(() => {
  define('vl-example', VlExample);
  define('vl-example-other', VlExampleOther);
});

export {
  VlExampleOne,
  VlExampleOther,
};

