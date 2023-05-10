'use strict';

import dom from './dom.js';
import settings from './settings.js';
import ajax from './ajax.js';

const els = settings.elements;
const parent = dom.$('main');

const components = {
    // NAVIGATION
    navLink(page, parent, callback) {
        // console.log(parent);
        const container = dom.create({
            classes: ['link'],
            parent,
        })

        container.dataset.pageid = page.id;

        const link = dom.create({
            type: 'a',
            content: page.title,
            parent: container,
            listeners: {
                click(evt) {
                    evt.stopPropagation();
                    // container.classList.toggle('open');
                    console.log(page.id);
                    callback(page.id);
                }
            }
        })

        return { container, link };
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
        // console.log('paragraph', content);

        let text = content.text.replaceAll('\n', '<br />');

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
        console.log('code', content);

        let text = content.text.replaceAll('\t', '');
        console.log(text);

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

        dom.create({
            type: 'h2',
            content: content.text,
            parent
        })

    },
    subheader(content) {
        // console.log('subheader', content);

        dom.create({
            type: 'h3',
            content: content.text,
            parent
        })

    },
    contents(contents) {
        parent.innerHTML = '';
        contents.content.forEach(
            content => components[content.type](content)
        )

    }
}

export default components;