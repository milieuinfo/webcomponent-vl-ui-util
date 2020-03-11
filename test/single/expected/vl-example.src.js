import { VlElement, define } from 'vl-ui-core';
import 'vl-ui-button';
import '@govflanders/vl-ui-core/dist/js/core.js';
import '@govflanders/vl-ui-util/dist/js/util.js';
import 'vl-ui-example/lib/external-library.js';
import 'vl-ui-example/lib/external-library-2.js';
import 'https://prod.widgets.burgerprofiel.vlaanderen.be/api/v1/node_modules/@govflanders/vl-widget-polyfill/dist/index.js';
import "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
import { analytics } from 'vl-ui-example/src/non-vl.js';
import { dependency } from 'vl-ui-example/src/non-vl-2.js';

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
