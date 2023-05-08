'use strict';

const ajax = {
    loadPages(){
        return fetch('/data/pages.json').then(
            res => res.json()
        )
    }
}

export default ajax;