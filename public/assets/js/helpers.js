'use strict';

const helpers = {
    // Funktion, um ein Array zu durchsuchen, das Objekte enthält, in dem weitere Arrays verschachtelt sind
    deepSearch(arr, searchInKey, searchForValue) {
        let found = false;
        console.log(arr, searchInKey, searchForValue);
        // Rekursive Funktion, um alle Kinder zu durchsuchen
        const search = arr => {
            arr.forEach(el => {
                if (el[searchInKey] == searchForValue) {
                    found = el;
                } else {
                    // Falls es nicht das richtige Element war, suche in den Kindern weiter
                    if (el.children) search(el.children);
                }
            })
        }
        search(arr);
        return found;
    }
}

export default helpers;