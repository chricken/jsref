'use strict';

import dom from './dom.js';
import settings from './settings.js';
import ajax from './ajax.js';

const els = settings.elements;
const parent = dom.$('main');

const components = {
    setActiveLink() {
        dom.$$('.link').forEach(link => link.classList.remove('current'));
        dom.$('.id_' + settings.currentID).classList.add('current');
        dom.$('.id_' + settings.currentID).classList.add('open');
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

        const link = dom.create({
            type: 'a',
            content: page.title,
            parent: container,
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    dom.$('title').innerHTML = page.title;
                    settings.currentID = page.id;
                    settings.currentPageName = page.title;

                    components.setActiveLink();

                    callback(page.id);
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

        return { container, link, containerChildren };
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
        let text = content.text.replaceAll('\t', '');

        const container = dom.create({
            classes: ['container', 'code'],
            parent
        })

        dom.create({
            type: 'p',
            parent: container,
            textContent: text
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

    contents(contents) {
        parent.innerHTML = '';
        // Im Menü den richtigen Link auf 'current' setzen
        components.setActiveLink();
        let inPageLinks = dom.$('.current>.inPageLinks');
        inPageLinks.innerHTML = '';

        dom.create({
            type:'h1',
            content: settings.currentPageName,
            parent: parent
        })

        contents.content.forEach(
            content => {
                const contentEl = components[content.type](content);

                // Links zu den Überschriften generieren
                if (content.type == 'header' || content.type == 'subheader') {
                    const containerLink = dom.create({
                        parent: inPageLinks,
                        classes: ['inPageLink']
                    })
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
                                console.log(contentEl);
                                contentEl.scrollIntoView();
                                document.documentElement.scrollTop -= 15;
                            }
                        }
                    })
                }
            }
        )
    }
}

export default components;