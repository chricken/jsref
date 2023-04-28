'use strict';

import settings from '../settings.js';
import dom from '/assets/js/dom.js';

const content = {
    paragraph(el) {

        el.forEach(p => {
            // console.log(p);
            const container = dom.create({
                classes: ['container', 'containerParagraph'],
                parent: settings.elements.containerContent
            })
            dom.create({
                type: 'textarea',
                value: p,
                parent: container,
            })
        })
    },

    renderPageContent(data) {
        settings.elements.containerContent.innerHTML = '';
        console.log(data);
        data.content.forEach(el => {

            switch (el.type) {
                case 'paragraph':
                    content.paragraph(el.text)
                    break;
                default:
                    break;
            }
        })

    }
}

export default content;