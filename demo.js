import '../node_modules/prismjs/prism.js';
import '../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js';
import {VlElement, define} from "../node_modules/vl-ui-core/vl-core.js";

(() => {
  const id = 'demo-style';
  addStyle();
  addMetaTagForMobileDevices();

  function addStyle() {
    if (!document.head.querySelector('#' + id)) {
      var style = getStyle();
      document.head.appendChild(style);
    }
  }

  function getStyle() {
    var link = document.createElement('link');
    link.setAttribute('id', id);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'demo.css');
    return link;
  }

  function addMetaTagForMobileDevices() {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width');
    document.head.appendChild(meta);
  }
})();

/**
 * VlDemoPagina
 * @class
 * @classdesc Demo pagina helper class. Voegt H1 header toe en een te kiezen link.
 * Elke template onder deze demo pagina zal omgevormd worden naar een voorbeeld code en de uitgevoerde code.
 *
 * @property {string} data-vl-title - Attribuut wordt gebruikt als titel van de demo pagina.
 * @property {string} data-vl-link - Attribuut wordt gebruikt als link naar webuniversum.
 * @property {string} <template data-vl-title=...> - Attribuut wordt gebruikt als titel van het voorbeeld.
 */
export class VlDemoPagina extends VlElement(HTMLElement) {

  connectedCallback() {
    const title = document.createElement('H1');
    title.innerHTML = this.getAttribute('data-vl-title');
    this.insertBefore(title, this.firstChild);
    const p = document.createElement('p');
    p.innerHTML = `<a href="${this.getAttribute('data-vl-link')}">Meer voorbeelden en documentatie</a>`;
    title.after(p);
    this.querySelectorAll(':scope > template').forEach(VlDemoPagina._addDemo);
  }

  static _addDemo(template) {
    const div = document.createElement('DIV');
    div.innerHTML = `
        <h2>${template.getAttribute('data-vl-title')}</h2>
        <pre>
            <code class="line-numbers language-markup">${VlDemoPagina.__encodeHTML(template.innerHTML)}</code>
        </pre>
        <div class="demo">
              ${template.innerHTML}
        </div>`;
    template.after(div);
    template.remove();
  }

  static __encodeHTML(str) {
    return str.replace(/[\u00A0-\u9999<>&](?!#)/gim, function(i) {
      return '&#' + i.charCodeAt(0) + ';';
    });
  }
}

define('vl-demo-pagina', VlDemoPagina);