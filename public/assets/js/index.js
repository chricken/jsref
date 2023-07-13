'use strict';

// IMPORT
import settings from './settings.js';
import ajax from './ajax.js';
import dom from './dom.js';
import components from './components.js';
import helpers from './helpers.js';

// KONSTANTEN / VARIABLEN
const els = settings.elements;

// FUNKTIONEN
const domMapping = () => {
    els.nav = dom.$('nav');
    els.subnav = dom.$('subnav inner');
    els.main = dom.$('main');
    els.footer = dom.$('footer');
}

const appendEventlisteners = () => {
    window.addEventListener('scroll', handleScroll);
}

// Navigation verschieben, um weiterhin sichtbar zu sein
const handleScroll = () => {
    // console.log(document.documentElement.scrollTop);
    // let pos = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    // els.subnav.style.marginTop = pos + 'px';
}

// Navigationslinks ineinander verschachteln
const parentize = arrPages => {
    // Pages leeren
    settings.pages = [];

    // console.log(arrPages);
    arrPages.forEach(page => {
        if (!page.parent) {
            // Wenn Kein Eltern-Element eingetragen ist, hänge diese Seite direkt in das globale pages-Element ein
            settings.pages.push(page);
        } else {
            // Wenn ein Eltern-Element eingetragen ist, hänge diese Seite als Child dort ein
            let parent = arrPages.find(el => el.id == page.parent);
            parent.children.push(page);
        }
    })
}

const anyChildrenVisible = page => {
    return page.children.some(el => el.visible);
}

const renderNav = () => {
    // Funktion, um Element anzulegen
    const createLink = (page, parent) => {
        // console.log(page);
        if (page.visible) {
            // Navigationslink erzeugen. Die Rückgabewerte sind der Container und das a-Tag (Link)
            const { container, elLink, containerChildren } = components.navLink(page, parent, refreshContents);

            // Wenn es Kinder hat, das plus/minus-Symbol einblenden und die Kinder iterieren
            if (anyChildrenVisible(page)) {
                const extender = components.linkExtender(container);
                // Kinder iterieren
                page.children.forEach(page => createLink(page, containerChildren));
                extender.addEventListener('click', () =>
                    container.classList.toggle('open')
                )
            }
        }
    }

    // console.log(settings.pages);
    settings.pages.forEach(page => createLink(page, els.nav));

}


const refreshPages = () => {
    return ajax.loadPages().then(
        res => {
            // Leeres Kind-Array anlegen
            res.pages.map(page => page.children = [])

            // Seite als geschlossen markieren
            res.pages.map(page => page.open = false)
            return res;
        }
    ).then(
        res => {
            parentize(res.pages);
            return res;
        }
    ).then(
        renderNav
    )
}

const refreshContents = (pageID, loadID) => {
    // Wenn eine loadID übergeben wurde, soll die geladen werden.
    // Das soll die Möglichkeit eröffnen, die Inhalt einer anderen Seite zu laden
    ajax.loadContents(loadID || pageID).then(
        result => settings.page = result
    ).then(
        () => settings.currentID = pageID
    ).then(
        components.contents
    ).catch(
        console.warn
    )
}

const init = () => {
    domMapping();
    appendEventlisteners();
    refreshPages().then(
        () => {
            let query = window.location.search;
            if (query === '') {
                refreshContents(123);
            } else {
                // Wenn die Seite neu geladen wird, soll auf Basis der Adressleiste die Seite
                // oder die Seite, deren Inhalt angezeigt werden soll, geladen werden

                // Herausfinden, welche Seite gerade geladen ist
                query = query.substring(1);
                query = query.split('&');
                let objQuery = {};
                query.forEach(val => {
                    val = val.split('=');
                    objQuery[val[0]] = val[1];
                })
                
                // objQuery.id enthält die ID der aktuellen Seite
                // Aus den Pages die Seite picken
                let currentID = objQuery.id;
                let currentPage = false;

                // Rekursive Funktion, die alle Kinder nach der ID durchsucht
                const findID = twig => {
                    if (twig.id == currentID) {
                        currentPage = twig
                    } else {
                        if (twig.children) {
                            twig.children.forEach(findID)
                        }
                    }
                }

                // Rekursion starten. Seite mit der ID suchen
                settings.pages.forEach(findID)

                if (currentPage.showContentOf && currentPage.showContentOf != '') {
                    refreshContents(currentPage.id, currentPage.showContentOf);
                } else {
                    refreshContents(currentPage.id);
                }
            }
        }

    ).catch(
        console.warn
    )
}

// INIT
init();