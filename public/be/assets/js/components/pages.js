'use strict';

import dom from '/assets/js/dom.js';
import ajax from '../ajax.js';
import settings from '../settings.js';

class Page {
    constructor({
        parent = ''
    }) {
        let id = (Math.random() * 1e17).toString(36);
        while (settings.pages.find(val => val.id == id)) {
            id = (Math.random() * 1e17).toString(36);
        }

        this.id = id;
        this.author = '';
        this.crDate = Date.now();
        this.chDate = Date.now();
        this.overview = '';
        this.parent = parent;
        this.title = '';
        this.visible = false;
    }
}
const pages = {
    createNewPage(newIndex, parentID, callback) {
        // Neue Seite erzeugen
        let newPage = new Page({
            parent: parentID
        });

        localStorage.setItem('activePageID', newPage.id);

        // Neue Seitendatei anlegen
        ajax.createPageFile(newPage.id);

        // Neue Seite in Liste eintragen
        settings.pages.splice(newIndex, 0, newPage);

        // Pages sichern, dann neu rendern
        ajax.savePages().then(
            callback
        ).then(
            () => {
                let el = settings.pagesStructured[newPage.id].container;
                el.classList.add('open');
                el.querySelector('.inputHeader').focus();
            }
        )
    },

    pageDetails({
        parent = false,
        page = {},
    } = {}) {

        // Seitenauswahl füllen.
        // Muss hier oben sein, um aufgerufen werden zu können.
        const fillPages = pages => {
            // Seiten zur Auswahl hinzufügen
            elSelectShowContentOf.innerHTML = '';
            pages.forEach(page => {
                dom.create({
                    type: 'option',
                    parent: elSelectShowContentOf,
                    content: `${page.title} <span style="font-size:.5em">(${page.id})</span>`,
                    attr: {
                        value: page.id
                    }
                })
            })
        }

        // Container für Details, die ausgeblendet werden können
        const details = dom.create({
            parent,
            classes: ['details']
        })

        // Opener
        dom.create({
            type: 'span',
            parent: details,
            content: '⯈',
            classes: ['opener', 'transit'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    parent.classList.toggle('opened')
                }
            }
        })

        // Title
        dom.create({
            parent: details,
            type: 'input',
            value: page.title,
            classes: ['inputHeader'],
            attr: {
                type: 'text'
            },
            listeners: {
                input(evt) {
                    page.title = evt.target.value;
                    page.chDate = Date.now();
                },
                change() {
                    ajax.savePages();
                }
            }
        })

        // ID
        dom.create({
            classes: ['info'],
            content: `ID: ${page.id}`,
            parent: details
        })

        // Zeige Inhalt von anderer Seite
        dom.create({
            type: 'span',
            parent: details,
            content: 'Zeige Inhalt von: '
        })

        let elSelectShowContentOf = dom.create({
            type: 'select',
            parent: details,
            listeners: {
                change() {
                    console.log(elSelectShowContentOf.value);
                    page.showContentOf = elSelectShowContentOf.value;
                }
            }
        })

        // Filter für "Zeige Inhalt von Seite"
        dom.create({
            type: 'input',
            classes: ['showActive'],
            attr: {
                type: 'text',
                placeholder: 'Filter',
            },
            parent: details,
            listeners: {
                input(evt) {
                    let val = evt.target.value;
                    let pages = settings.pages.filter(page => {
                        if (page.id.includes(val))
                            return true;
                        if (page.title.toLowerCase().includes(val.toLowerCase()))
                            return true;
                        return false;
                    });
                    // console.log(pages);
                    fillPages(pages);
                }
            }
        })

        // Option für "keine Seite gewählt"
        dom.create({
            type: 'option',
            parent: elSelectShowContentOf,
            content: 'keine',
            attr: {
                value: ''
            },
        })


        fillPages([...settings.pages])


        if (page.showContentOf && page.showContentOf != '') {
            elSelectShowContentOf.value = page.showContentOf;
        }


        // CreationDate
        dom.create({
            classes: ['info'],
            content: `Creation Date: ${new Date(page.crDate).toLocaleString()}`,
            parent: details
        })

        // Change Date
        dom.create({
            classes: ['info'],
            content: `Last Change: ${new Date(page.chDate).toLocaleString()}`,
            parent: details
        })

        // Checkbox Visible
        const containerCB = dom.create({
            class: ['cb'],
            parent: details
        })

        dom.create({
            type: 'span',
            parent: containerCB,
            content: 'Is Visible?'
        })

        let cbVisible = dom.create({
            type: 'input',
            parent: containerCB,
            attr: {
                type: 'checkbox',
            },
            listeners: {
                change(evt) {
                    page.visible = evt.target.checked;
                    page.chDate = Date.now();
                    ajax.savePages();
                }
            }
        })
        if (page.visible) cbVisible.checked = true;
        return details
    },

    pageContainer({
        parent = false,
        page = {},
        index = false,
        renderPages = () => { },
    } = {}) {

        // console.log(page);

        // Container für einen Menüeintrag
        const container = dom.create({
            parent,
            classes: ['container', 'containerPage'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    dom.$$('aside .containerPage').forEach(el => {
                        el.classList.remove('open')
                    })
                    container.classList.add('open');
                    settings.activePageID = page.id;
                    localStorage.setItem('activePageID', page.id);
                    ajax.openSinglePage();
                },
                mouseenter(evt) {
                    evt.stopPropagation();
                    container.classList.add('hover')
                },
                mouseleave(evt) {
                    dom.$$('aside .containerPage')
                    evt.stopPropagation();
                    container.classList.remove('hover')
                }
            },
            attr: {
                'data-pageid': page.id
            }
        })

        // container.style.borderLeftColor = `hsl(${~~(Math.random()*360)},100%,40%)`;

        dom.create({
            parent: container,
            classes: ['kante']
        })

        page.moveMe && container.classList.add('moveMe');
        page.visible || container.classList.add('hidden');

        // Title
        const header = dom.create({
            parent: container,
            classes: ['divHeader'],
        })

        // Opener
        dom.create({
            type: 'span',
            parent: header,
            content: '⯈',
            classes: ['opener', 'transit'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    console.log(container);
                    container.classList.toggle('opened')
                }
            }
        })

        dom.create({
            type: 'span',
            parent: header,
            content: page.title,
            classes: ['headerContent']
        })

        let details = pages.pageDetails({
            parent: container,
            page
        })

        // Buttons
        let containerBtns = dom.create({
            parent: details
        })

        let btnSave = dom.create({
            type: 'button',
            parent: containerBtns,
            content: '🖫',
            classes: ['btnHighlight'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    ajax.savePages().then(
                        renderPages
                    )
                }
            }
        })

        // Andere Buttons
        containerBtns = dom.create({
            content: 'Erzeugen: ',
            classes: ['containerBtns', 'btnShy'],
            parent: container
        })

        // Neue Page ÜBER dieser
        dom.create({
            type: 'button',
            parent: containerBtns,
            content: '⇗',
            classes: ['btnShy'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    pages.createNewPage(index, page.parent, renderPages);
                }
            }
        })

        // Neue Seite UNTER dieser
        dom.create({
            type: 'button',
            parent: containerBtns,
            content: '⇘',
            classes: ['btnShy'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    pages.createNewPage(index + 1, page.parent, renderPages);
                }
            }
        })

        // Neue Seite IN dieser
        dom.create({
            type: 'button',
            parent: containerBtns,
            content: '⇒',
            classes: ['btnShy'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    pages.createNewPage(index + 1, page.id, renderPages);
                }
            }
        })

        // Diese Seite entfernen
        dom.create({
            type: 'button',
            parent: containerBtns,
            content: '✖',
            classes: ['btnShy'],
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    if (confirm(`Seite "${page.title}" wirklich löschen?\nACHTUNG: Diese Aktion kann nicht zurückgenommen werden!`)) {
                        settings.pages.splice(index, 1);
                        ajax.savePages().then(
                            renderPages
                        );
                    }
                }
            }
        })

        containerBtns = dom.create({
            content: 'Copy Paste: ',
            classes: ['containerBtns'],
            parent: container
        })

        // Diese Seite entfernen
        dom.create({
            type: 'button',
            parent: containerBtns,
            content: '✂',
            classes: ['btnShy'],
            listeners: {
                click(evt) {
                    // moveMe bedeutet: Dieses Element wird verschoben
                    // Allen cutOut-Elementen die Klasse entfernen
                    settings.pages.forEach(page => page.moveMe = false);
                    page.moveMe = true;
                    evt.stopPropagation();
                    // console.log(page);
                    settings.cutPage = page;
                    renderPages();
                }
            }
        })
        // Testen, ob die Seite eingefügt werden darf
        let canBePasted = true;
        if (!settings.cutPage) canBePasted = false;
        // Sichergehen, dass ein Element nicht ein eigenes Kind-Element verschoben wird
        const checkID = page => {

            if (settings.cutPage.id == page.id) canBePasted = false;
            // Eltern-Element prüfen, ob hier eine Übereinstimmung vorliegt
            if (page.parent) checkID(settings.pages.find(val => val.id == page.parent));
        }
        checkID(page);

        // ÜBER diese einfügen
        if (canBePasted) {
            dom.create({
                type: 'button',
                parent: containerBtns,
                content: '⇗',
                classes: ['btnShy'],
                listeners: {
                    click(evt) {
                        evt.stopPropagation();
                        // Seite ausschneiden
                        settings.pages = settings.pages.filter(
                            page => page != settings.cutPage
                        );
                        // An der richtigen Stelle neu einfügen
                        let newIndex = settings.pages.indexOf(page);
                        settings.pages.splice(newIndex, 0, settings.cutPage);
                        // Eltern-ID übertragen
                        settings.cutPage.parent = page.parent;
                        settings.cutPage.moveMe = false;
                        settings.cutPage = false;
                        // Speichern
                        ajax.savePages().then(
                            renderPages
                        )
                    }
                }
            })

            // UNTER diese verschieben
            dom.create({
                type: 'button',
                parent: containerBtns,
                content: '⇘',
                classes: ['btnShy'],
                listeners: {
                    click(evt) {
                        evt.stopPropagation();
                        // Seite ausschneiden
                        settings.pages = settings.pages.filter(
                            page => page != settings.cutPage
                        );
                        // An der richtigen Stelle neu einfügen
                        let newIndex = settings.pages.indexOf(page);
                        settings.pages.splice(newIndex + 1, 0, settings.cutPage);
                        // Eltern-ID übertragen
                        settings.cutPage.parent = page.parent;
                        settings.cutPage.moveMe = false;
                        settings.cutPage = false;
                        // Speichern
                        ajax.savePages().then(
                            renderPages
                        )
                    }
                }
            })

            // IN diese einfügen
            dom.create({
                type: 'button',
                parent: containerBtns,
                content: '⇒',
                classes: ['btnShy'],
                listeners: {
                    click(evt) {
                        evt.stopPropagation();
                        // Seite ausschneiden
                        settings.pages = settings.pages.filter(
                            page => page != settings.cutPage
                        );
                        // An der richtigen Stelle neu einfügen
                        // let newIndex = settings.pages.indexOf(page);
                        // Neues Element ans Ende des Array hängen hat den Effekt, dass die Seite als letztes gefunden und in das Parent-Element eingehängt wird.
                        settings.pages.push(settings.cutPage);
                        // Eltern-ID übertragen
                        settings.cutPage.parent = page.id;
                        settings.cutPage.moveMe = false;
                        settings.cutPage = false;
                        // Speichern
                        console.log(settings.pages);
                        ajax.savePages().then(
                            renderPages
                        )
                    }
                }
            })
            /*
            dom.create({
                type: 'button',
                parent: details,
                content: '⎘',
                classes: ['btnShy'],
                listeners: {
                    click(evt) {
                        evt.stopPropagation();
                        settings.cutPage.parent = page.id;
                        renderPages();

                    }
                }
            })
            */
        }

        // Kinder-Elemente
        let elChildren = dom.create({
            parent: container,
            classes: ['childrenContainer']
        })

        return { container, elChildren };

    }
}

export default pages;