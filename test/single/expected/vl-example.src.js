import { VlElement, define } from 'vl-ui-core';
import '@govflanders/vl-ui-util/dist/js/util.min.js';
import 'vl-ui-example/dist/accordion.js';
import 'https://prod.widgets.burgerprofiel.vlaanderen.be/api/v1/node_modules/@govflanders/vl-widget-polyfill/dist/index.js';
import 'vl-ui-button';
import { analytics } from 'vl-ui-example/src/analytics.js';

export class VlExample extends VlElement(HTMLElement) {
    constructor() {
        super(`
            <style>
.example{color: black;}
.example{color: black;}
.dependency{color: red;}
.dependency{color: red;}
            </style>
            <div>
        		example
            </div>
        `);
    }

}
