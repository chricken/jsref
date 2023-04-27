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
    pageContainer({
        parent = false,
        page = {},
        index = false,
        renderPages = () => { },
    } = {}) {

        // console.log(page);

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
                    ajax.openSinglePage();
                },
                mouseenter(evt) {
                    evt.stopPropagation();
                    /*
                    console.log(evt.target);
                    dom.$$('aside .containerPage').forEach(el => {
                        el.classList.remove('hover')
                    })
                    */
                    container.classList.add('hover')
                },
                mouseleave(evt) {
                    dom.$$('aside .containerPage')
                    evt.stopPropagation();
                    container.classList.remove('hover')
                }
            }
        })

        // Title
        dom.create({
            parent: container,
            content: page.title,
            classes: ['divHeader'],
        })

        // Container für Details, die ausgeblendet werden können
        const details = dom.create({
            parent: container,
            classes: ['details']
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

        // Eingabefeld für Übersichtstext
        dom.create({
            type: 'textarea',
            parent: details,
            value: page.overview,
            listeners: {
                input(evt) {
                    page.overview = evt.target.value;
                    page.chDate = Date.now();
                },
                change() {
                    ajax.savePages();
                }
            }
        })

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


        // Buttons
        let btnSave = dom.create({
            type: 'button',
            parent: details,
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
        const containerBtn = dom.create({
            classes: ['containerBtns'],
            parent: container
        })

        // Neue Page ÜBER dieser
        dom.create({
            type: 'button',
            parent: details,
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
            parent: details,
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
            parent: details,
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
            parent: details,
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

        // Kinder-Elemente
        let elChildren = dom.create({
            parent: container,
            classes: ['childrenContainer']
        })

        return { container, elChildren };

    }
}

export default pages;