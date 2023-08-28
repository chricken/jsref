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

        // Terminalbefehl erzeugen
        dom.create({
            type: 'button',
            content: '+ Terminal',
            classes: ['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, {
                        type: 'terminal',
                        crDate: Date.now(),
                        chDate: Date.now(),
                        text: ''
                    });
                    content.renderPageContent(content.data);
                }
            }
        })

        // Links erzeugen
        dom.create({
            type: 'button',
            content: '+ Links',
            classes: ['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, {
                        type: 'links',
                        crDate: Date.now(),
                        chDate: Date.now(),
                        links: []
                    });
                    content.renderPageContent(content.data);
                }
            }
        })

        // Bild erzeugen
        dom.create({
            type: 'button',
            content: '+ Img',
            classes: ['green'],
            parent,
            listeners: {
                click() {
                    settings.pageData.content.splice(index, 0, {
                        type: 'image',
                        crDate: Date.now(),
                        chDate: Date.now(),
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
        return dom.create({
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

        let types = ['header', 'subheader', 'paragraph', 'code', 'terminal'];
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

    // ABSATZ
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
                    // c    onsole.log(el);
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
            classes: ['container', 'control'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);

    },

    // CODE
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
            classes: ['container', 'control'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);

    },

    // Terminal
    terminal(el, index) {
        const container = dom.create({
            classes: ['container', 'containerTerminal'],
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
            classes: ['container', 'control'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);

    },

    // HEADER
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
            classes: ['container', 'control'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);
    },

    // SUBHEADER
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
            classes: ['container', 'control'],
            parent: container
        })
        content.selectType(el, containerControl);
        content.moveUpDown(el, containerControl, index);
    },

    // LINK
    singleLink(link, parent, allLinks, index) {
        const container = dom.create({
            parent,
            classes: 'container'
        })
        // Link-Eingaben
        dom.create({
            type: 'input',
            value: link.title,
            parent: container,
            attr: {
                placeholder: 'Title'
            },
            listeners: {
                input(evt) {
                    link.title = evt.target.value;
                }
            }
        })
        dom.create({
            type: 'span',
            content: ' - ',
            parent: container,
        })
        dom.create({
            type: 'input',
            value: link.url,
            parent: container,
            attr: {
                placeholder: 'URL'
            },
            styles: {
                width: '300px'
            },
            listeners: {
                input(evt) {
                    link.url = evt.target.value;
                }
            }
        })

        // Button zum Entfernen        
        dom.create({
            type: 'span',
            content: ' - ',
            parent: container,
        })

        dom.create({
            type: 'button',
            content: 'delete',
            parent: container,
            listeners: {
                click() {
                    allLinks.splice(index, 1);
                    content.renderPageContent();
                }
            }
        })
    },

    // LINKS
    links(el, index) {
        const container = dom.create({
            classes: ['container', 'containerLinks'],
            parent: settings.elements.containerContent
        })

        dom.create({
            content: 'Links',
            type: 'h5',
            parent: container
        })

        // Links iterieren
        const containerLinks = dom.create({
            parent: container
        })

        // Button für einen neuen Link
        dom.create({
            parent: container,
            type: 'button',
            content: 'New Link',
            listeners: {
                click() {
                    // Neuen Link anlegen
                    el.links.push({
                        title: '',
                        url: ''
                    });

                    content.renderPageContent();
                }
            }
        })

        el.links.forEach((link, index) => {
            content.singleLink(link, containerLinks, el.links, index);
        })


        // Neues Element hierunter anlegen
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
            classes: ['container', 'control'],
            parent: container
        })
        // console.log(containerControl);
        // Linklisten können nicht umgewandelt werden
        // content.selectType(el, containerControl);

        content.moveUpDown(el, containerControl, index);

    },

    // Image
    image(el, index) {
        const container = dom.create({
            classes: ['container', 'containerSubheader'],
            parent: settings.elements.containerContent
        })

        dom.create({
            type: 'h5',
            content: 'Image',
            parent: container
        })

        // Bild als Vorschau
        if (el.filename) {
            dom.create({
                type: 'img',
                attr: {
                    src: `/assets/img/uploads/${el.filename}`
                },
                parent: container,
                classes: 'contentImg'
            })
        }

        // Platzhalter
        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch', 'containerBtns'],
            parent: container
        })

        // Formular, um den Upload sauber und einfach zu erledigen
        const myForm = dom.create({
            parent: container,
            type: 'form',
            listeners: {
                submit(evt) {
                    evt.preventDefault();
                }
            }
        })
        dom.create({
            type: 'input',
            parent: myForm,
            attr: {
                type: 'file',
                name: 'upload',
            },
            listeners: {
                change(evt) {
                    // console.log(evt.target.files[0].name);
                    elSaveContent.disabled = true;
                    fetch('/uploadImg', {
                        method: 'post',
                        body: new FormData(myForm)
                    }).then(
                        res => res.json()
                    ).then(
                        res => {
                            if (res.status == 'ok') {
                                el.filename = res.filename;
                                elSaveContent.removeAttribute('disabled')
                                content.renderPageContent(content.data);
                            }
                        }
                    ).catch(
                        console.warn
                    )
                }
            }
        })

        // Platzhalter
        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch', 'containerBtns'],
            parent: container
        })

        dom.create({
            type: 'input',
            parent: container,
            value: el.subtext,
            listeners: {
                input(evt) {
                    el.subtext = evt.target.value
                }
            },
            attr: {
                placeholder: 'Subtext'
            },
            styles: {
                width: '400px'
            }
        })

        // Platzhalter
        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch', 'containerBtns'],
            parent: container
        })

        dom.create({
            type: 'input',
            parent: container,
            value: el.width,
            listeners: {
                input(evt) {
                    el.width = evt.target.value
                }
            },
            attr: {
                placeholder: 'width'
            }
        })

        // Platzhalter
        dom.create({
            type: 'p',
            classes: ['platzhalter', 'umbruch', 'containerBtns'],
            parent: container
        })


        content.minusParagraph(index, container)
        content.plusParagraph(index + 1, container)
        const elSaveContent = content.saveContent(container);

        content.timestamps(el, container);

        // Elemente, um den Typ und die Position zu steuern
        const containerControl = dom.create({
            classes: ['container'],
            parent: container
        })
        // Ein Image nachträglich zu ändern macht keinen Sinn, da die Daten nicht sinnvoll übertragen werden können
        // content.selectType(el, containerControl);
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

        // Interval zum Speichern der Pagedaten
        if (settings.saveIntervalID !== false) {
            clearInterval(settings.saveIntervalID)
        }
        settings.saveIntervalID = setInterval(
            ajax.savePageFile,
            1000 * 60,
            content.data
        )

        settings.pageData.content.forEach((el, index) => {
            content[el.type](el, index);
        })

    }
}

export default content;