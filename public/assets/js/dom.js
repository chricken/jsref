'use strict';

const dom = {
    create({
        content = '',
        textContent = '',
        type = 'div',
        parent = false,
        classes = false,
        attr = {},
        listeners = {},
        styles = {},
        amEnde = true,
        value = false,
    } = {}) {
        let neu = document.createElement(type);
        if (content) neu.innerHTML = content;
        if (textContent) neu.innerText = textContent;
        if (value) neu.value = value;
        if(classes){
            if (Array.isArray(classes)) neu.className = classes.join(' ');
            else neu.className = classes;

        }

        Object.entries(attr).forEach(el => neu.setAttribute(...el));
        Object.entries(listeners).forEach(el => neu.addEventListener(...el));
        Object.entries(styles).forEach(style => neu.style[style[0]] = style[1]);

        if (parent) {
            if (!amEnde) parent.prepend(neu);
            else parent.append(neu);
        }

        return neu;
    },

    $(selector) {
        return document.querySelector(selector);
    },

    $$(selector) {
        return [...document.querySelectorAll(selector)];
    },

}

export default dom;