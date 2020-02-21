import { define, awaitScript } from 'vl-ui-core';

import { VlExampleOne } from 'vl-ui-example/dist/vl-example.js';
import { VlExampleOther } from 'vl-ui-example/dist/vl-example-other.js';

Promise.all([
    awaitScript('vl-map-openlayers', 'dependency/script-from-dependency.js')
]).then(() => {
    define('vl-example', VlExample);
    define('vl-example-other', VlExampleOther);
});

export {
	VlExampleOne, 
	VlExampleOther
}