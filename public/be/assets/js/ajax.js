'use strict';

import settings from './settings.js';

const ajax = {
    getJSON(url) {
        return fetch(url).then(
            res => res.json()
        )
    },

    savePages() {
        return ajax.getJSON(settings.urlPages).then(
            res => {
                res.pages = settings.pages
                return res
            }
        ).then(
            res => {
                return fetch('/savePages', {
                    method: 'post',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(res)
                })
            }
        ).then(
            res => res.json()
        )
    }
}

export default ajax;