'use strict';

import settings from './settings.js';
import content from './components/content.js';

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
    },

    createPageFile(id) {

        return fetch('/createPageFile', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                id
            })
        }).then(
            res => res.json()
        )

    },

    openSinglePage() {
        let id = settings.activePageID;
        fetch('/getSinglePage', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id })
        }).then(
            res => res.json()
        ).then(
            res => {
                console.log(res);
                content.renderPageContent(res.payload)
            }
        )
    },
}

export default ajax;