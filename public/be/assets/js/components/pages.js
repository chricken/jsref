'use strict';

import dom from '/assets/js/dom.js';
import ajax from '../ajax.js';
import settings from '../settings.js';

class Page {
    constructor() {
        let id = (Math.random()*1e17).toString(36);
        while (settings.pages.find(val => val.id == id)) {
            id = (Math.random() * 1e17).toString(36);
        }
        
        this.id = id;
        this.author = '';
        this.crDate = Date.now();
        this.chDate = Date.now();
        this.overview = '';
        this.parent = '';
        this.title = '';
        this.visible = false;
    }
}

const pages = {
    pageContainer({
        parent = false,
        page = {},
        index = false
    } = {}) {

        console.log(page);

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
                    page.title = evt.target.value
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
                    page.overview = evt.target.value
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
                    console.log(page);
                }
            }
        })
        if (page.visible) cbVisible.checked = true;

        // Speichern-Button
        let btnSave = dom.create({
            type: 'button',
            parent: details,
            content: 'Save',
            listeners: {
                click() {
                    evt.stopPropagation();
                    ajax.savePages()
                }
            }
        })

        // Neue Page unter dieser
        let btnNewBelow = dom.create({
            type: 'button',
            parent: container,
            content: '+ below',
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    let newPage = new Page();

                }
            }
        })


    }
}

export default pages;