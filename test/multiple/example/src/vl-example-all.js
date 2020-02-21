import { define, awaitScript } from '/node_modules/vl-ui-core/dist/vl-core.js';

import { VlExampleOne } from "/src/vl-example.js";
import { VlExampleOther } from "/src/vl-example-other.js";

Promise.all([
    awaitScript('vl-map-openlayers', '/node_modules/dependency/script-from-dependency.js')
]).then(() => {
    define('vl-example', VlExample);
    define('vl-example-other', VlExampleOther);
});

export {
	VlExampleOne, 
	VlExampleOther
}