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
    
    settings.pages.forEach((page, index) => {
        // Eintrag für eine Seite im Navigations-Container
        compPages.pageContainer({
            parent: els.containerPages,
            page,
            index
        })
    })
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
