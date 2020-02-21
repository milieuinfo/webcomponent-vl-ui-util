import { VlElement, define } from '/node_modules/vl-ui-core/dist/vl-core.js';
import '/node_modules/@govflanders/vl-ui-util/dist/js/util.min.js';
import '/node_modules/vl-ui-example/lib/external-library.js';
import 'https://prod.widgets.burgerprofiel.vlaanderen.be/api/v1/node_modules/@govflanders/vl-widget-polyfill/dist/index.js';
import '/node_modules/vl-ui-button/dist/vl-button.js';
import { analytics } from '/node_modules/vl-ui-example/src/non-vl.js';

export class VlExample extends VlElement(HTMLElement) {
    constructor() {
        super(`
            <style>
        		@import '/node_modules/vl-ui-example/dist/style.css';
        		@import '/node_modules/vl-ui-example/dist/style.css';
        		@import '/node_modules/vl-ui-dependency/dist/style.css';
        		@import "/node_modules/vl-ui-dependency/dist/style.css";
            </style>
            <div>
        		example
            </div>
        `);
    }

}