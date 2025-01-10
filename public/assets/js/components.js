'use strict';

import dom from './dom.js';
import settings from './settings.js';
import ajax from './ajax.js';
import helpers from './helpers.js';

const els = settings.elements;
const parent = dom.$('main');

const components = {
    setActiveLink() {
        dom.$$('.link').forEach(link => {
            link.classList.remove('current')
            link.classList.remove('open')
        });
        const currentLink = dom.$('.id_' + settings.currentID);
        currentLink.classList.add('current');

        // Alle Elternelemente ggf öffen
        const openLink = el => {

            // öffnen, falls es ein link-Element ist
            if (el.classList.contains('link')) el.classList.add('open');

            // Eltern-Element prüfen
            if (el.parentElement) openLink(el.parentElement);
        }
        openLink(currentLink);
    },

    setTitle() {
        let page = helpers.deepSearch(settings.pages, 'id', settings.currentID);
        settings.currentPageName = page.title;
        dom.$('title').innerHTML = page.title;
    },

    // NAVIGATION
    navLink(page, parent, callback) {
        // console.log(parent);
        const container = dom.create({
            classes: ['link', 'id_' + page.id],
            parent,
        })
        // console.log(settings.currentID, page.id);

        container.dataset.page_id = page.id;

        const elLink = dom.create({
            type: 'a',
            content: page.title,
            parent: container,
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    settings.currentID = page.id;
                    // settings.currentPageName = page.title;

                    // Links öffnen
                    components.setTitle();
                    components.setActiveLink();

                    // Adressleiste anpassen
                    window.history.pushState(null, null, `?id=${page.id}`);

                    callback(page.id, page.showContentOf);
                }
            }
        })

        dom.create({
            classes: ['inPageLinks'],
            parent: container
        })

        const containerChildren = dom.create({
            classes: ['children'],
            parent: container
        })

        return { container, elLink, containerChildren };
    },

    linkExtender(parent) {
        const container = dom.create({
            classes: ['extender'],
            parent
        })
        dom.create({
            // content: '+',
            classes: ['iconPlus'],
            parent: container
        })
        dom.create({
            // content: '-',
            classes: ['iconMinus'],
            parent: container
        })
        // Die Klasse wird in der index.js umgeschaltet
        return container;
    },

    // CONTENT
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

    paragraph(content) {
        // console.log('paragraph', content.text);

        let text = content.text.replaceAll('\n', '<br />');
        // Für einige im Code liegenden Zeilenumbrüche das <br>-Tag entfernen
        text = text.replaceAll('<br>', '<br />');
        text = text.replaceAll('<br /><br />', '<br />');
        text = text.replaceAll('<td><br />', '<td>');
        text = text.replaceAll('</td><br />', '</td>');
        text = text.replaceAll('<tr><br />', '<tr>');
        text = text.replaceAll('</tr><br />', '</tr>');
        text = text.replaceAll('<ul><br />', '<ul>');
        text = text.replaceAll('<ul><br>', '<ul>');
        text = text.replaceAll('</li><br />', '</li>');
        text = text.replaceAll('</li><br>', '</li>');

        // console.log('paragraph', text);

        const container = dom.create({
            classes: ['container', 'paragraph'],
            parent
        })

        dom.create({
            type: 'p',
            parent: container,
            content: text
        })

        components.timestamps(content, container);

    },

    code(content) {
        // let text = content.text;
        let text = content.text.replaceAll('\t', '');
        text = text.replaceAll(' ', '&nbsp;');
        text = text.replaceAll('\n', '<br />');
        const container = dom.create({
            classes: ['container', 'code'],
            parent
        })

        // console.log(text);

        const elText = dom.create({
            type: 'p',
            parent: container,
            content: text,
            dataset: {
                content: text
            }
            // textContent: text,
        })

        // settings.observerTextWriting.observe(elText);

        components.timestamps(content, container);

    },

    terminal(content) {
        // let text = content.text;
        let text = content.text.replaceAll('\t', '');
        text = text.replaceAll(' ', '&nbsp;');
        text = text.replaceAll('\n', '<br />');
        const container = dom.create({
            classes: ['container', 'terminal'],
            parent
        })

        // console.log(text);

        dom.create({
            type: 'p',
            parent: container,
            content: text,
            // textContent: text,
        })

        components.timestamps(content, container);

    },

    header(content) {
        // console.log('header', content);

        const container = dom.create({
            type: 'h2',
            content: content.text,
            parent
        })

        dom.create({
            type: 'p',
            content: content.text.length + ' Zeichen',
            // parent: container
        })

        return container;
    },

    subheader(content) {
        // console.log('subheader', content);

        const container = dom.create({
            type: 'h3',
            content: content.text,
            parent
        })

        dom.create({
            type: 'p',
            content: content.text.length + ' Zeichen',
            // parent: container
        })

        return container;
    },

    image(content) {
        const container = dom.create({
            parent,
            classes: ['container', 'image']
        })

        const elImage = dom.create({
            type: 'img',
            parent: container,
            attr: {
                src: `/assets/img/uploads/${content.filename}`
            },
            classes: ['contentImage']
        })

        // Bildbreite eintragen
        console.log(content.width);
        if (content.width) elImage.setAttribute('width', String(content.width));

        if (content.subtext) {
            dom.create({
                parent: container,
                type: 'p',
                content: content.subtext
            })
        }

        components.timestamps(content, container);
    },

    // Elemente für Linksammlungen im Content
    links(content) {
        const container = dom.create({
            parent,
            classes: ['container', 'links']
        })
        // console.log(content);
        content.links.forEach(link => {
            dom.create({
                type: 'a',
                parent: container,
                content: `${link.title} (<b>${link.url}</b>)`,
                attr: {
                    href: link.url,
                    target: '_blank'
                }
            })
        })

        components.timestamps(content, container);
    },

    hint(content) {

        let text = content.text.replaceAll('\n', '<br />');
        // Für einige im Code liegenden Zeilenumbrüche das <br>-Tag entfernen
        text = text.replaceAll('<br>', '<br />');
        text = text.replaceAll('<br /><br />', '<br />');
        text = text.replaceAll('<td><br />', '<td>');
        text = text.replaceAll('</td><br />', '</td>');
        text = text.replaceAll('<tr><br />', '<tr>');
        text = text.replaceAll('</tr><br />', '</tr>');
        text = text.replaceAll('<ul><br />', '<ul>');
        text = text.replaceAll('<ul><br>', '<ul>');
        text = text.replaceAll('</li><br />', '</li>');
        text = text.replaceAll('</li><br>', '</li>');

        // console.log('paragraph', text);

        const container = dom.create({
            classes: ['container', 'hint'],
            parent
        })

        dom.create({
            type: 'p',
            parent: container,
            content: text
        })

        dom.create({
            classes:['icon', 'hint'],
            parent: container,
            content: '!'
        })
        // components.timestamps(content, container);

    },

    funfact(content) {

        let text = content.text.replaceAll('\n', '<br />');
        // Für einige im Code liegenden Zeilenumbrüche das <br>-Tag entfernen
        text = text.replaceAll('<br>', '<br />');
        text = text.replaceAll('<br /><br />', '<br />');
        text = text.replaceAll('<td><br />', '<td>');
        text = text.replaceAll('</td><br />', '</td>');
        text = text.replaceAll('<tr><br />', '<tr>');
        text = text.replaceAll('</tr><br />', '</tr>');
        text = text.replaceAll('<ul><br />', '<ul>');
        text = text.replaceAll('<ul><br>', '<ul>');
        text = text.replaceAll('</li><br />', '</li>');
        text = text.replaceAll('</li><br>', '</li>');

        // console.log('paragraph', text);

        const container = dom.create({
            classes: ['container', 'funfact'],
            parent
        })

        dom.create({
            type: 'p',
            parent: container,
            content: text
        })

        dom.create({
            classes:['icon', 'funfact'],
            parent: container,
        })
        // components.timestamps(content, container);

    },

    // Element, das die letzten Änderungen anzeigen soll
    lastChanges(callback) {

        dom.create({
            type: 'h3',
            content: `Änderungen der letzten ${settings.daysToBeNew} Tage`,
            parent
        })
        const container = dom.create({
            parent,
            classes: ['container', 'image']
        })

        settings.lastChanges.forEach(page => {
            // console.log(page);
            let containerLink = dom.create({
                type: 'p',
                parent: container,
                content: `${page.title} (${page.lastChange} Tag${page.lastChange == 1 ? '' : 'e'})`,
                classes: ['innerLink', 'transit'],
                listeners: {
                    click(evt) {
                        // ajax.loadContents(page.id)
                        evt.stopPropagation();
                        settings.currentID = page.id;
                        // settings.currentPageName = page.title;

                        // Links öffnen
                        components.setTitle();
                        components.setActiveLink();

                        // Adressleiste anpassen
                        window.history.pushState(null, null, `?id=${page.id}`);

                        callback(page.id);
                    }
                }
            })

        })

    },

    suche(callback) {
        // suche
        const inputSearch = dom.create({
            type: 'input',
            parent: els.containerSearch,
            attr: {
                placeholder: 'Suchstring'
            },
            listeners: {
                input: () => callback(inputSearch.value)
            }
        })

        // SendButton
        dom.create({
            type: 'button',
            parent: els.containerSearch,
            content: 'send',
            listeners: {
                click: () => callback(inputSearch.value)
            }
        })
    },

    // Ergebnisse der Suche
    searchResults(found, searchVal, callback) {

        found.forEach(page => {
            let count = JSON.stringify(page);
            count = count.toLowerCase()
            count = count.split(searchVal.toLowerCase()).length - 1
            page.count = count;
        })

        found.sort((a, b) => b.count - a.count)

        // console.log(found, searchVal);

        found.forEach(page => {
            const containerLink = dom.create({
                parent: els.containerSearchResults,
                classes: ['link'],
                /*                
                attr: {
                    href: `/?id=${page.id}`
                }
                */
                listeners: {
                    click() {
                        callback(page.id)
                    }
                }
            })
            dom.create({
                type: 'h4',
                content: page.title,
                parent: containerLink
            })
            dom.create({
                content: `Fundstellen: ${page.count}`,
                parent: containerLink
            })


        })
    },

    contents() {
        parent.innerHTML = '';

        // Im Menü den richtigen Link auf 'current' setzen
        components.setActiveLink();
        components.setTitle();
        let inPageLinks = dom.$('.current>.inPageLinks');
        inPageLinks.innerHTML = '';
        els.subnav.innerHTML = '';

        dom.create({
            type: 'h1',
            content: settings.currentPageName,
            parent: parent
        })

        settings.page.content.forEach(
            content => {
                console.log(content.type);
                const contentEl = components[content.type](content);

                // Links zu den Überschriften ins Submenü einfügen
                if (content.type == 'header' || content.type == 'subheader') {
                    // Submenü füllen
                    const containerLink = dom.create({
                        parent: els.subnav,
                        classes: ['inPageLink']
                    })

                    // Content füllen
                    dom.create({
                        parent: containerLink,
                        content:
                            // Nur die ersten Zeichen sollen sichtbar sein
                            (content.text.length < settings.maxLengthInPageHeader)
                                ? content.text
                                : content.text.substr(0, settings.maxLengthInPageHeader - 2) + '...',
                        type: 'a',
                        listeners: {
                            click(evt) {
                                // console.log(contentEl);
                                contentEl.scrollIntoView();
                                document.documentElement.scrollTop -= 50;
                            }
                        }
                    })
                }
            }
        )
    }
}

export default components;