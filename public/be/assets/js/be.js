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
    const timerID = (Math.random()*1e17).toString(36)
console.time('renderPages_'+timerID)
    const pgsStr = settings.pagesStructured;
    els.containerPages.innerHTML = '';
console.timeLog('renderPages_'+timerID)

    settings.pages.forEach((page, index) => {
console.timeLog('renderPages_'+timerID)
        // console.log(page);
        if (page) {
            page.hasChildren = false;
            // Eintrag für eine Seite im Navigations-Container
            // Elemente erzeugen und in ein Objekt schreiben
            // Die Komponente liefert ein Objekt mit dem Container und dem Container für Kindelemente
            pgsStr[page.id] = compPages.pageContainer({
                parent: els.containerPages,
                page,
                index,
                renderPages,
            })
        }
    })
console.timeLog('renderPages_'+timerID)
    // Checken, welche Seiten Kinder hat und welche nicht
    settings.pages.forEach(page => {
        if (page.parent) {
            pgsStr[page.parent].container.classList.add('hasChildren');
        }
    })
console.timeLog('renderPages_'+timerID)

    // console.log(pgsStr);

    // Anhand der ID ineinander verschachteln
    settings.pages.forEach((page, index) => {
        if (page.parent) {
            // Wenn die Page ein parent hat,
            // Dann wird die Page in den Kinder-Container eingehängt
            pgsStr[page.parent].elChildren.append(pgsStr[page.id].container)
        }
    });


console.timeLog('renderPages_'+timerID)
    // Zuletzt geladene Seite anzeigen
    let activePageID = localStorage.getItem('activePageID');
    if (activePageID) {
        settings.activePageID = activePageID;
        ajax.openSinglePage();

        // Seite im Menü hervorheben
        let el = document.querySelector(`[data-pageid="${activePageID}"]`);
        if (el) {
            el.classList.add('open');
            const activateAndParent = id => {
                // console.log(id);
                let page = settings.pages.find(page => page.id == id);
                if (page) {
                    // console.log(pgsStr, id);
                    pgsStr[id].container.classList.add('opened');
                    if (page.parent) {
                        activateAndParent(page.parent)
                    }
                }
            }
            activateAndParent(activePageID);
        }
    }

    console.timeLog('renderPages_'+timerID)
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
