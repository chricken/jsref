'use strict';

import settings from './settings.js';

const ajax = {
    getJSON(url) {
        return fetch(url).then(
            res => res.json()
        )
    },

    savePages() {
        ajax.getJSON(settings.urlPages).then(
            res => {
                res.pages = settings.pages
                return res
            }
        ).then(
            res => {
                fetch('/savePages', {
                    method: 'post',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(res)
                }).then(
                    res => res.json()
                ).then(
                    console.log
                ).catch(
                    console.warn
                )
            }
        )
    }
}

export default ajax;