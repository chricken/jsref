'use strict';

import dom from './dom.js';
import settings from './settings.js';

const els = settings.elements;

const components = {
    navLink(page, parent) {
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
            listeners:{
                click(evt){
                    evt.stopPropagation();
                    container.classList.toggle('open');
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
    }
}

export default components;