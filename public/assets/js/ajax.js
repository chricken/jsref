'use strict';

const ajax = {
    loadPages(){
        return fetch('/data/pages.json').then(
            res => res.json()
        )
    },
    loadContents(pageID){
        return fetch(`/data/pages/${pageID}.json`).then(
            res => res.json()
        )
    }
}

export default ajax;