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
                click() {
                    dom.$$('aside .containerPage').forEach(el => {
                        el.classList.remove('open')
                    })
                    container.classList.add('open')
                }
            }
        })

        // Title
        dom.create({
            parent: container,
            type: 'input',
            value: page.title,
            classes: ['inputHeader'],
            listeners: {
                input(evt) {
                    page.title = evt.target.value;
                    page.chDate = Date.now();
                }
            }
        })

        // Container für Details, die ausgeblendet werden können
        const details = dom.create({
            parent: container,
            classes: ['details']
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
                }
            }
        })
        if (page.visible) cbVisible.checked = true;

        // Kinder-Elemente
        let elChildren = dom.create({
            parent: container,
            classes: ['childrenContainer']
        })

        // Buttons
        let btnSave = dom.create({
            type: 'button',
            parent: details,
            content: 'Save',
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
            parent: containerBtn,
            content: '+ above',
            listeners: {
                click(evt) {
                    evt.stopPropagation();

                    // Neue Seite erzeugen
                    let newPage = new Page({
                        parent: page.parent
                    });

                    // Neue Seite in Liste eintragen
                    settings.pages.splice(index, 0, newPage);

                    // Pages sichern, dann neu rendern
                    ajax.savePages().then(
                        renderPages
                    )
                }
            }
        })

        // Neue Seite UNTER dieser
        dom.create({
            type: 'button',
            parent: containerBtn,
            content: '+ below',
            listeners: {
                click(evt) {
                    evt.stopPropagation();

                    // Neue Seite erzeugen
                    let newPage = new Page({
                        parent: page.parent
                    });

                    // Neue Seite in Liste eintragen
                    settings.pages.splice(index + 1, 0, newPage);

                    // Pages sichern, dann neu rendern
                    ajax.savePages().then(
                        renderPages
                    )
                }
            }
        })

        // Neue Seite IN dieser
        dom.create({
            type: 'button',
            parent: containerBtn,
            content: '+ inside',
            listeners: {
                click(evt) {
                    evt.stopPropagation();

                    // Neue Seite erzeugen
                    let newPage = new Page({
                        parent: page.id
                    });

                    // Neue Seite in Liste eintragen
                    settings.pages.splice(index + 1, 0, newPage);

                    // Pages sichern, dann neu rendern
                    ajax.savePages().then(
                        renderPages
                    )
                }
            }
        })

        // Diese Seite entfernen
        dom.create({
            type: 'button',
            parent: containerBtn,
            content: 'Löschen',
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

        return { container, elChildren };

    }
}

export default pages;