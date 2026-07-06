08 NATURAL TECHNOLOGY — SITO STATICO LOCALE

Contenuto pacchetto:
- index.html: homepage
- prodotti/: catalogo e 4 schede prodotto
- metodo/: pagina Qualità 08
- blog/: pagina blog + 4 articoli
- b2b/: area rivenditori
- contatti/: pagina contatti con form locale dimostrativo
- privacy/, cookie/, note-legali/: pagine legali locali predisposte
- assets/css/style.css: stile principale consolidato
- assets/css/brand-page.css: stile specifico per la sezione Qualità 08 integrata
- assets/js/main.js: menu mobile, switch lingua, gallery prodotto e form demo
- assets/img/: logo, favicon, bandiere, icone e immagini prodotto effettivamente usate

Uso locale:
1. Estrai lo ZIP.
2. Apri index.html con il browser.
3. Modifica testi, misure e colori da assets/css/style.css.
4. Modifica contenuti direttamente nei file HTML.

Nota tecnica:
Il sito è statico e locale. Non richiede Next.js, Vercel, Tailwind CDN o dipendenze remote obbligatorie.

Aggiornamento v19:
- Rimossa la pagina nascosta brand/index.html perché sostituita da Qualità 08.
- Puliti tutti i tag script con attributo defer corretto.
- Consolidato il CSS principale rimuovendo blocchi storici duplicati.
- Eliminati asset non usati dopo verifica automatica dei riferimenti locali.
- Audit finale eseguito con 0 errori bloccanti e 0 warning.

Aggiornamento v20:
- Migliorata la meccanica dello switch lingue.
- Corretto il problema dei testi che restavano in inglese passando alle altre lingue.
- Allineate le traduzioni principali ES/FR/DE/PT alle 86 chiavi gestite dallo switch, con copertura completa della home esclusi brand, contatti e dati aziendali volutamente invariati.
- Aggiunto fallback pulito al testo italiano originale per evitare residui della lingua precedente.
