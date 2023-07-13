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

    setTitle(){
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
            dataset:{
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

        return dom.create({
            type: 'h2',
            content: content.text,
            parent
        })

    },

    subheader(content) {
        // console.log('subheader', content);

        return dom.create({
            type: 'h3',
            content: content.text,
            parent
        })

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
                content: `${link.title} (${link.url})`,
                attr: {
                    href: link.url,
                    target: '_blank'
                }
            })
        })

        components.timestamps(content, container);
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
                const contentEl = components[content.type](content);
                
                // console.log(contentEl);

                // Links zu den Überschriften generieren
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