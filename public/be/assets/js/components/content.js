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
            classes: ['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, {
                        type: 'header',
                        crDate: Date.now(),
                        chDate: Date.now(),
                        text: ''
                    });
                    content.renderPageContent(content.data);
                }
            }
        })
        // Subheader erzeugen
        dom.create({
            type: 'button',
            content: '+ Subheader',
            classes: ['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, {
                        type: 'subheader',
                        crDate: Date.now(),
                        chDate: Date.now(),
                        text: ''
                    });
                    content.renderPageContent(content.data);
                }
            }
        })
        // Paragraph erzeugen
        dom.create({
            type: 'button',
            content: '+ Text',
            classes: ['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, {
                        type: 'paragraph',
                        crDate: Date.now(),
                        chDate: Date.now(),
                        text: ''
                    });
                    content.renderPageContent(content.data);
                }
            }
        })
        // Code erzeugen
        dom.create({
            type: 'button',
            content: '+ Code',
            classes: ['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, {
                        type: 'code',
                        crDate: Date.now(),
                        chDate: Date.now(),
                        text: ''
                    });
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
            classes: ['rot'],
            listeners: {
                click() {
                    if (confirm('Soll der Abschnitt wirklich gelöscht werden?\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
                        settings.pageData.content.splice(index, 1);
                        content.renderPageContent(content.data);
                    }
                }
            }
        })
    },

    // Button, um den Inhalt zu speichern
    saveContent(parent) {
        dom.create({
            type: 'button',
            content: 'Save Content',
            classes: ['yellow'],
            parent,
            listeners: {
                click() {
                    ajax.savePageFile(content.data)
                }
            }
        })
    },

    // Auswahl, welche Art von Element dies ist
    selectType(el, parent) {

        dom.create({
            type: 'span',
            content: 'Select type',
            parent
        })

        const select = dom.create({
            type: 'select',
            parent,
            listeners: {
                change() {
                    el.type = select.value;
                    console.log(el);
                }
            }
        })

        let types = ['header', 'subheader', 'paragraph', 'code'];
        types.forEach(type => {
            dom.create({
                type: 'option',
                parent: select,
                content: type
            })
        })
        select.value = el.type;

    },

    // Move up and down
    moveUpDown(el, parent, index) {
        if (index > 0) {
            dom.create({
                type: 'button',
                content: '⇑',
                parent,
                listeners: {
                    click() {
                        let cutOut = settings.pageData.content.splice(index, 1)[0];
                        settings.pageData.content.splice(index - 1, 0, cutOut);
                        ajax.savePageFile(content.data);
                        content.renderPageContent();
                    }
                }
            })
        }

        if (index < settings.pageData.content.length - 1) {
            dom.create({
                type: 'button',
                content: '⇓',
                parent,
                listeners: {
                    click() {
                        let cutOut = settings.pageData.content.splice(index, 1)[0];
                        settings.pageData.content.splice(index + 1, 0, cutOut);
                        ajax.savePageFile(content.data)
                        content.renderPageContent();
                    }
                }
            })
        }
    },

    // Timestamps, um die Aktualität einzuschätzen
    timestamps(el, parent) {

        const elTimestamp = dom.create({
            parent,
            classes: ['timestamps']
        })

        if (el.crDate) {
            dom.create({
                parent: elTimestamp,
                type: 'span',
                content: `Created: ${new Date(el.crDate).toLocaleDateString()}`
            })
        }
        if (el.crDate) {
            dom.create({
                parent: elTimestamp,
                type: 'span',
                content: `Last Changed: ${new Date(el.chDate).toLocaleDateString()}`
            })
        }
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
                    el.chDate = Date.now();
                    console.log(el);
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

        content.timestamps(el, container);

        // Elemente, um den Typ und die Position zu steuern
        const containerControl = dom.create({
            classes: ['container'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);

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
                    el.chDate = Date.now();
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

        content.timestamps(el, container);

        // Elemente, um den Typ und die Position zu steuern
        const containerControl = dom.create({
            classes: ['container'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);

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
                    el.chDate = Date.now();
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

        content.timestamps(el, container);

        // Elemente, um den Typ und die Position zu steuern
        const containerControl = dom.create({
            classes: ['container'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);
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
                    el.chDate = Date.now();
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

        content.timestamps(el, container);

        // Elemente, um den Typ und die Position zu steuern
        const containerControl = dom.create({
            classes: ['container'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);
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