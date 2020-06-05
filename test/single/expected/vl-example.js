/* eslint-disable no-unused-vars */
import {vlElement, define} from '/node_modules/vl-ui-core/dist/vl-core.js';
import '/node_modules/vl-ui-button/dist/vl-button.js';
import '/node_modules/@govflanders/vl-ui-core/dist/js/core.js';
import '/node_modules/@govflanders/vl-ui-util/dist/js/util.js';
import '/node_modules/vl-ui-example/lib/external-library.js';
import '/node_modules/vl-ui-example/lib/external-library-2.js';
import 'https://prod.widgets.burgerprofiel.vlaanderen.be/api/v1/node_modules/@govflanders/vl-widget-polyfill/dist/index.js';
import 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js';
import {analytics} from '/node_modules/vl-ui-example/src/non-vl.js';
import {dependency} from '/node_modules/vl-ui-example/src/non-vl-2.js';

export class VlExample extends vlElement(HTMLElement) {
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
