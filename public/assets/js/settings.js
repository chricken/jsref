'use strict';

// Intersection Observer, der Text Zeichen für Zeichen schreiben soll
// Problem: HTML-Code wird nicht interpretiert
const handleIntersectionTextWriting = (entries, observer) => {
    entries.forEach(entry => {
        // Prüfen, ob das Element sichtbar ist
        if (entry.isIntersecting) {
            let target = entry.target;

            // Flag, ob die Animation bereits gestartet wurde. 
            // Soll sicherstellen, dass die Animation für ein Element nur einmal läuft
            if (!target.dataset.isStarted) {
                target.dataset.isStarted = 'true';

                // Funktion, die ein Zeichen überträgt
                const transferChar = () => {
                    let source = target.dataset.content;
                    console.log(source);
                    if (source.length) {
                        let char = source[0];
                        target.innerHTML += char;
                        target.dataset.content = target.dataset.content.substr(1);
                        setTimeout(transferChar, 200);
                    }
                }

                setTimeout(transferChar, 200);
            }
        }
    })
}

const settings = {
    elements: {},
    pages: [],
    currentID: 123,
    currentPageName: '',
    maxLengthInPageHeader: 20,
    observerTextWriting: new IntersectionObserver(handleIntersectionTextWriting)
}

export default settings;