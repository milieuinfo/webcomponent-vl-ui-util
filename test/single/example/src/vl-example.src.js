import { VlElement, define } from '/node_modules/vl-ui-core/vl-core.js';
import '/node_modules/@govflanders/vl-ui-util/dist/js/util.min.js';
import '/dist/accordion.js';
import 'https://prod.widgets.burgerprofiel.vlaanderen.be/api/v1/node_modules/@govflanders/vl-widget-polyfill/dist/index.js';
import '/node_modules/vl-ui-button/vl-button.js';
import { analytics } from '/src/analytics.js';

export class VlExample extends VlElement(HTMLElement) {
    constructor() {
        super(`
            <style>
        		@import '/style.css';
        		@import "/style.css";
        		@import '/node_modules/vl-ui-dependency/style.css';
        		@import "/node_modules/vl-ui-dependency/style.css";
            </style>
            <div>
        		example
            </div>
        `);
    }

}