'use strict';

import settings from '../settings.js';
import dom from '/assets/js/dom.js';
import ajax from '/be/assets/js/ajax.js';

const content = {
    data: {},
    addContentGedoens(parent) {
        
    },
    plusParagraph(index, parent) {
        // Header erzeugen
        dom.create({
            type: 'button',
            content: '+ Header',
            classes:['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, { type: 'header', text: '' });
                    content.renderPageContent(content.data);
                }
            }
        })
        // Subheader erzeugen
        dom.create({
            type: 'button',
            content: '+ Subheader',
            classes:['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, { type: 'subheader', text: '' });
                    content.renderPageContent(content.data);
                }
            }
        })
        // Paragraph erzeugen
        dom.create({
            type: 'button',
            content: '+ Text',
            classes:['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, { type: 'paragraph', text: '' });
                    content.renderPageContent(content.data);
                }
            }
        })
        // Code erzeugen
        dom.create({
            type: 'button',
            content: '+ Code',
            classes:['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, { type: 'code', text: '' });
                    content.renderPageContent(content.data);
                }
            }
        })
    },

    // Button, um einen neuen Absatz zu erzeugen
    minusParagraph(index, parent) {
        dom.create({
            type: 'button',
            content: '- Paragraph',
            parent,
            classes:['rot'],
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 1);
                    content.renderPageContent(content.data);
                }
            }
        })
    },
    
    // Button, um den Inhalt zu speichern
    saveContent(parent) {
        dom.create({
            type: 'button',
            content: 'Save Content',
            classes:['yellow'],
            parent,
            listeners: {
                click() {
                    ajax.savePageFile(content.data)
                }
            }
        })
    },

    paragraph(el, index) {
        const container = dom.create({
            classes: ['container', 'containerParagraph'],
            parent: settings.elements.containerContent
        })

        dom.create({
            type: 'textarea',
            value: el.text,
            parent: container,
            listeners: {
                input(evt) {
                    el.text = evt.target.value;
                    // console.log(el);
                }
            }
        })

        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch', 'containerBtns'],
            parent: container
        })
        content.minusParagraph(index, container)
        content.plusParagraph(index + 1, container)
        content.saveContent(container);

    },

    code(el, index) {
        const container = dom.create({
            classes: ['container', 'containerCode'],
            parent: settings.elements.containerContent
        })

        dom.create({
            type: 'textarea',
            value: el.text,
            parent: container,
            listeners: {
                input(evt) {
                    el.text = evt.target.value;
                    // console.log(el);
                }
            }
        })

        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch'],
            parent: container
        })
        content.minusParagraph(index, container)
        content.plusParagraph(index + 1, container)
        content.saveContent(container);

    },

    header(el, index) {
        const container = dom.create({
            classes: ['container', 'containerHeader'],
            parent: settings.elements.containerContent
        })

        dom.create({
            type: 'input',
            value: el.text,
            parent: container,
            attr: {
                type: 'text'
            },
            listeners: {
                input(evt) {
                    el.text = evt.target.value;
                    // console.log(el);
                }
            }
        })

        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch', 'containerBtns'],
            parent: container
        })
        content.minusParagraph(index, container)
        content.plusParagraph(index + 1, container)
        content.saveContent(container);
    },

    subheader(el, index) {
        const container = dom.create({
            classes: ['container', 'containerSubheader'],
            parent: settings.elements.containerContent
        })

        dom.create({
            type: 'input',
            value: el.text,
            parent: container,
            attr: {
                type: 'text'
            },
            listeners: {
                input(evt) {
                    el.text = evt.target.value;
                    // console.log(el);
                }
            }
        })

        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch', 'containerBtns'],
            parent: container
        })
        content.minusParagraph(index, container)
        content.plusParagraph(index + 1, container)
        content.saveContent(container);
    },

    renderPageContent() {
        settings.elements.containerContent.innerHTML = '';

        const container = dom.create({
            classes: ['container', 'containerBtns'],
            parent: settings.elements.containerContent
        })

        content.plusParagraph(0, container);
        content.saveContent(container);

        settings.pageData.content.forEach((el, index) => {
            content[el.type](el, index);
        })

    }
}

export default content;