'use strict';

import dom from './dom.js';
import settings from './settings.js';

const els = settings.elements;

const components = {
    navLink(page, parent) {
        // console.log(parent);
        const container = dom.create({
            classes: ['link'],
            parent
        })

        const link = dom.create({
            type: 'a',
            content: page.title,
            parent: container
        })

        return container;
    }
}

export default components;