'use strict';

import dom from '/assets/js/dom.js';
import ajax from './ajax.js';
import settings from './settings.js';

// Components
import compPages from './components/pages.js';

const els = settings.elements;

// FUNKTIONEN
const domMapping = () => {
    els.containerPages = dom.$('aside');
    els.containerContent = dom.$('main');
}

const appendEventlisteners = () => {

}

const renderPages = () => {

    const pgsStr = settings.pagesStructured;
    els.containerPages.innerHTML = '';

    settings.pages.forEach((page, index) => {

        // Eintrag für eine Seite im Navigations-Container
        // Elemente Erzeugen und in ein Objekt schreiben
        // Die Komponente liefert ein Objekt mit dem Container und dem Container für Kindelemente
        pgsStr[page.id] = compPages.pageContainer({
            parent: els.containerPages,
            page,
            index,
            renderPages,
        })
    })
    // Anhand der ID ineinander verschachteln
    settings.pages.forEach((page, index) => {
        if (page.parent) {
            // Wenn die Page ein parent hat,
            // Dann wird die Page in den Kinder-Container eingehängt
            pgsStr[page.parent].elChildren.append(pgsStr[page.id].container)
        }

    });
    // Object.entries(pgsStr).forEach(([key, val]) => {
    // console.log(key, val);

    // })
}

const loadPages = () => {
    els.containerPages.innerHTML = '';

    ajax
        .getJSON(settings.urlPages)
        .then(res => settings.pages = res.pages)
        .then(renderPages)
}

const init = () => {
    domMapping();
    appendEventlisteners();
    loadPages();
}

// INIT
init();
