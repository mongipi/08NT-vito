// 08 Natural Technology — JS locale vanilla, senza framework.
document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if(toggle && menu){
    toggle.addEventListener('click', function(){
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-gallery]').forEach(function(gallery){
    const main = gallery.querySelector('[data-gallery-main]');
    gallery.querySelectorAll('[data-gallery-thumb]').forEach(function(btn){
      btn.addEventListener('click', function(){
        const src = btn.getAttribute('data-src');
        const alt = btn.getAttribute('data-alt') || '';
        if(main && src){ main.src = src; main.alt = alt; }
      });
    });
  });

  document.querySelectorAll('form[data-local-form]').forEach(function(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      alert('Modulo locale dimostrativo. Per inviare davvero, collegare un servizio email o backend.');
    });
  });

  document.querySelectorAll('[data-blog-carousel]').forEach(function(carousel){
    const section = carousel.closest('section');
    const prev = section && section.querySelector('[data-carousel-prev]');
    const next = section && section.querySelector('[data-carousel-next]');
    const step = function(){ return Math.max(260, carousel.clientWidth * 0.75); };
    if(prev) prev.addEventListener('click', function(){ carousel.scrollBy({left:-step(), behavior:'smooth'}); });
    if(next) next.addEventListener('click', function(){ carousel.scrollBy({left:step(), behavior:'smooth'}); });
  });

  initLanguageSwitch();
});

// Supporto pagina Qualità/Brand integrata: scroll interno alle sezioni.
window.scrollToSection = function(id, btn){
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
  if (btn) {
    document.querySelectorAll('.brand-integrated .nl').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
  }
};

const SITE_LANGUAGES = {
  it:'🇮🇹', en:'🇬🇧', es:'🇪🇸', fr:'🇫🇷', de:'🇩🇪', pt:'🇵🇹'
};
const SITE_LANGUAGE_ASSETS = {
  it:'assets/img/flags/it.png',
  en:'assets/img/flags/gb.png',
  es:'assets/img/flags/es.png',
  fr:'assets/img/flags/fr.png',
  de:'assets/img/flags/de.png',
  pt:'assets/img/flags/pt.png'
};

const TRANSLATIONS = {
  en:{
    'Home':'Home','Prodotti':'Products','Shop':'Shop','Qualità 08':'08 Quality','Blog':'Blog','Contatti':'Contacts','Area Rivenditori':'Retailer Area','Azienda':'Company','Legale':'Legal','Privacy policy':'Privacy policy','Cookie policy':'Cookie policy','Note legali':'Legal notes','Made in Italy':'Made in Italy','Scopri i prodotti':'Discover products','Scopri →':'Discover →','Richiedi catalogo':'Request catalogue','Integratori alimentari':'Food supplements','L\'':'The','Eccellenza':'Excellence','come Standard.':'as Standard.','Integratori alimentari italiani formulati con ingredienti selezionati, ricerca e attenzione ai dettagli. 08 Natural Technology nasce per trasformare qualità, trasparenza e cura formulativa in una promessa quotidiana di benessere.':'Italian food supplements formulated with selected ingredients, research and attention to detail. 08 Natural Technology turns quality, transparency and formulation care into a daily wellness promise.','Novità prodotto':'New product','Formula premium quotidiana.':'Daily premium formula.','90 capsule · 90 giorni':'90 capsules · 90 days','30 capsule · 30 giorni':'30 capsules · 30 days','Scopri la novità →':'Discover the new product →','ECCELLENZA ITALIA':'ITALIAN EXCELLENCE','INGREDIENTI DI ALTA QUALITÀ':'HIGH-QUALITY INGREDIENTS','RICERCA E INNOVAZIONE':'RESEARCH AND INNOVATION','BENESSERE E RISULTATI CONCRETI':'WELLNESS AND TANGIBLE RESULTS','Identità italiana, cura del dettaglio e standard elevati in ogni scelta.':'Italian identity, attention to detail and high standards in every choice.','Materie prime selezionate con attenzione e formule coerenti.':'Carefully selected raw materials and coherent formulas.','Soluzioni nutrizionali moderne, pensate per esigenze reali.':'Modern nutritional solutions designed for real needs.','Prodotti chiari, mirati e facili da inserire nella routine quotidiana.':'Clear, targeted products that are easy to include in the daily routine.','Chi siamo':'About us','Lettera del Fondatore':'Founder\'s Letter','Un sogno diventato':'A dream turned into','promessa quotidiana.':'a daily promise.','Le nostre formule':'Our formulas','Prodotti pensati':'Products designed','per esigenze reali.':'for real needs.','Menopausa Complex':'Menopause Complex','Capelli, Pelle & Unghie':'Hair, Skin & Nails','Microcircolo Superior':'Microcirculation Superior','Multivitaminico & Minerali':'Multivitamin & Minerals','Supporto naturale al benessere femminile nel periodo della menopausa, con ingredienti selezionati.':'Natural support for female wellbeing during menopause, with selected ingredients.','Per capelli forti, pelle luminosa e unghie sane.':'For strong hair, radiant skin and healthy nails.','Per il sistema venoso e linfatico. Utile per gambe pesanti e stanche, gonfiore alle caviglie e gambe, fragilità capillare, ritenzione idrica e vene varicose.':'For the venous and lymphatic system. Useful for heavy and tired legs, swollen ankles and legs, capillary fragility, water retention and varicose veins.','Formula premium per chi desidera il massimo ogni giorno. Un concentrato di vitamine, minerali e nutrienti innovativi.':'A premium formula for those who want the best every day. A concentrate of vitamins, minerals and innovative nutrients.','Formula Avanzata':'Advanced Formula','Azione Giorno & Notte':'Day & Night Action','Formula Nutrizionale Mirata':'Targeted Nutritional Formula','Complesso Flavonoico Avanzato':'Advanced Flavonoid Complex','Complesso Nutrizionale Avanzato':'Advanced Nutritional Complex','Approfondimenti':'Insights','Dal blog 08.':'From the 08 blog.','Diventa rivenditore 08 Natural Technology.':'Become an 08 Natural Technology retailer.','Farmacie, parafarmacie, erboristerie e partner commerciali possono richiedere catalogo e informazioni di fornitura.':'Pharmacies, parapharmacies, herbal shops and commercial partners can request the catalogue and supply information.'
  },
  es:{'Home':'Inicio','Prodotti':'Productos','Shop':'Tienda','Qualità 08':'Calidad 08','Blog':'Blog','Contatti':'Contactos','Area Rivenditori':'Área distribuidores','Scopri i prodotti':'Ver productos','Integratori alimentari':'Complementos alimenticios','Eccellenza':'Excelencia','come Standard.':'como Estándar.','Novità prodotto':'Novedad','Formula premium quotidiana.':'Fórmula premium diaria.','Scopri la novità →':'Descubre la novedad →','ECCELLENZA ITALIA':'EXCELENCIA ITALIANA','INGREDIENTI DI ALTA QUALITÀ':'INGREDIENTES DE ALTA CALIDAD','RICERCA E INNOVAZIONE':'INVESTIGACIÓN E INNOVACIÓN','BENESSERE E RISULTATI CONCRETI':'BIENESTAR Y RESULTADOS CONCRETOS','Chi siamo':'Quiénes somos','Lettera del Fondatore':'Carta del fundador','Le nostre formule':'Nuestras fórmulas','Prodotti pensati':'Productos pensados','per esigenze reali.':'para necesidades reales.','Supporto naturale al benessere femminile nel periodo della menopausa, con ingredienti selezionati.':'Apoyo natural al bienestar femenino durante la menopausia, con ingredientes seleccionados.','Per capelli forti, pelle luminosa e unghie sane.':'Para cabello fuerte, piel luminosa y uñas sanas.','Formula Avanzata':'Fórmula avanzada','Azione Giorno & Notte':'Acción Día y Noche','Formula Nutrizionale Mirata':'Fórmula nutricional dirigida','Complesso Flavonoico Avanzato':'Complejo flavonoide avanzado','Complesso Nutrizionale Avanzato':'Complejo nutricional avanzado','Approfondimenti':'Artículos','Dal blog 08.':'Del blog 08.','Diventa rivenditore 08 Natural Technology.':'Conviértete en distribuidor 08 Natural Technology.','Richiedi catalogo':'Solicitar catálogo'},
  fr:{'Home':'Accueil','Prodotti':'Produits','Shop':'Boutique','Qualità 08':'Qualité 08','Blog':'Blog','Contatti':'Contacts','Area Rivenditori':'Espace revendeurs','Scopri i prodotti':'Découvrir les produits','Integratori alimentari':'Compléments alimentaires','Eccellenza':'Excellence','come Standard.':'comme Standard.','Novità prodotto':'Nouveauté produit','Formula premium quotidiana.':'Formule premium quotidienne.','Scopri la novità →':'Découvrir la nouveauté →','ECCELLENZA ITALIA':'EXCELLENCE ITALIENNE','INGREDIENTI DI ALTA QUALITÀ':'INGRÉDIENTS DE HAUTE QUALITÉ','RICERCA E INNOVAZIONE':'RECHERCHE ET INNOVATION','BENESSERE E RISULTATI CONCRETI':'BIEN-ÊTRE ET RÉSULTATS CONCRETS','Chi siamo':'À propos','Lettera del Fondatore':'Lettre du fondateur','Le nostre formule':'Nos formules','Prodotti pensati':'Produits conçus','per esigenze reali.':'pour des besoins réels.','Supporto naturale al benessere femminile nel periodo della menopausa, con ingredienti selezionati.':'Soutien naturel au bien-être féminin pendant la ménopause, avec des ingrédients sélectionnés.','Per capelli forti, pelle luminosa e unghie sane.':'Pour des cheveux forts, une peau lumineuse et des ongles sains.','Formula Avanzata':'Formule avancée','Azione Giorno & Notte':'Action Jour & Nuit','Formula Nutrizionale Mirata':'Formule nutritionnelle ciblée','Complesso Flavonoico Avanzato':'Complexe flavonoïde avancé','Complesso Nutrizionale Avanzato':'Complexe nutritionnel avancé','Approfondimenti':'Articles','Dal blog 08.':'Du blog 08.','Diventa rivenditore 08 Natural Technology.':'Devenez revendeur 08 Natural Technology.','Richiedi catalogo':'Demander le catalogue'},
  de:{'Home':'Startseite','Prodotti':'Produkte','Shop':'Shop','Qualità 08':'08 Qualität','Blog':'Blog','Contatti':'Kontakt','Area Rivenditori':'Händlerbereich','Scopri i prodotti':'Produkte entdecken','Integratori alimentari':'Nahrungsergänzungsmittel','Eccellenza':'Exzellenz','come Standard.':'als Standard.','Novità prodotto':'Produktneuheit','Formula premium quotidiana.':'Tägliche Premium-Formel.','Scopri la novità →':'Neuheit entdecken →','ECCELLENZA ITALIA':'ITALIENISCHE EXZELLENZ','INGREDIENTI DI ALTA QUALITÀ':'HOCHWERTIGE INHALTSSTOFFE','RICERCA E INNOVAZIONE':'FORSCHUNG UND INNOVATION','BENESSERE E RISULTATI CONCRETI':'WOHLBEFINDEN UND KONKRETE ERGEBNISSE','Chi siamo':'Über uns','Lettera del Fondatore':'Brief des Gründers','Le nostre formule':'Unsere Formeln','Prodotti pensati':'Produkte entwickelt','per esigenze reali.':'für echte Bedürfnisse.','Supporto naturale al benessere femminile nel periodo della menopausa, con ingredienti selezionati.':'Natürliche Unterstützung für das weibliche Wohlbefinden in der Menopause, mit ausgewählten Inhaltsstoffen.','Per capelli forti, pelle luminosa e unghie sane.':'Für kräftiges Haar, strahlende Haut und gesunde Nägel.','Formula Avanzata':'Fortschrittliche Formel','Azione Giorno & Notte':'Tag-&-Nacht-Wirkung','Formula Nutrizionale Mirata':'Gezielte Nährstoffformel','Complesso Flavonoico Avanzato':'Fortschrittlicher Flavonoid-Komplex','Complesso Nutrizionale Avanzato':'Fortschrittlicher Nährstoffkomplex','Approfondimenti':'Beiträge','Dal blog 08.':'Aus dem 08 Blog.','Diventa rivenditore 08 Natural Technology.':'Werden Sie Händler von 08 Natural Technology.','Richiedi catalogo':'Katalog anfordern'},
  pt:{'Home':'Início','Prodotti':'Produtos','Shop':'Loja','Qualità 08':'Qualidade 08','Blog':'Blog','Contatti':'Contactos','Area Rivenditori':'Área de revendedores','Scopri i prodotti':'Ver produtos','Integratori alimentari':'Suplementos alimentares','Eccellenza':'Excelência','come Standard.':'como Padrão.','Novità prodotto':'Novidade','Formula premium quotidiana.':'Fórmula premium diária.','Scopri la novità →':'Descobrir a novidade →','ECCELLENZA ITALIA':'EXCELÊNCIA ITALIANA','INGREDIENTI DI ALTA QUALITÀ':'INGREDIENTES DE ALTA QUALIDADE','RICERCA E INNOVAZIONE':'PESQUISA E INOVAÇÃO','BENESSERE E RISULTATI CONCRETI':'BEM-ESTAR E RESULTADOS CONCRETOS','Chi siamo':'Quem somos','Lettera del Fondatore':'Carta do fundador','Le nostre formule':'As nossas fórmulas','Prodotti pensati':'Produtos pensados','per esigenze reali.':'para necessidades reais.','Supporto naturale al benessere femminile nel periodo della menopausa, con ingredienti selezionati.':'Apoio natural ao bem-estar feminino durante a menopausa, com ingredientes selecionados.','Per capelli forti, pelle luminosa e unghie sane.':'Para cabelos fortes, pele luminosa e unhas saudáveis.','Formula Avanzata':'Fórmula avançada','Azione Giorno & Notte':'Ação Dia & Noite','Formula Nutrizionale Mirata':'Fórmula nutricional direcionada','Complesso Flavonoico Avanzato':'Complexo flavonoide avançado','Complesso Nutrizionale Avanzato':'Complexo nutricional avançado','Approfondimenti':'Artigos','Dal blog 08.':'Do blog 08.','Diventa rivenditore 08 Natural Technology.':'Torne-se revendedor 08 Natural Technology.','Richiedi catalogo':'Solicitar catálogo'}
};


// Integrazioni v20: parità traduzioni home/footer per lingue ES/FR/DE/PT.
// Le chiavi mancanti non rimangono più nella lingua precedente: tornano sempre al testo italiano originale.
const TRANSLATION_PATCHES = {
  es:{
    'Azienda':'Empresa','Legale':'Legal','Privacy policy':'Política de privacidad','Cookie policy':'Política de cookies','Note legali':'Notas legales','Made in Italy':'Hecho en Italia','Scopri →':'Descubre →','L\'':'La',
    'Integratori alimentari italiani formulati con ingredienti selezionati, ricerca e attenzione ai dettagli. 08 Natural Technology nasce per trasformare qualità, trasparenza e cura formulativa in una promessa quotidiana di benessere.':'Complementos alimenticios italianos formulados con ingredientes seleccionados, investigación y atención al detalle. 08 Natural Technology nace para transformar calidad, transparencia y cuidado formulativo en una promesa diaria de bienestar.',
    '90 capsule · 90 giorni':'90 cápsulas · 90 días','30 capsule · 30 giorni':'30 cápsulas · 30 días',
    'Identità italiana, cura del dettaglio e standard elevati in ogni scelta.':'Identidad italiana, cuidado del detalle y altos estándares en cada elección.',
    'Materie prime selezionate con attenzione e formule coerenti.':'Materias primas cuidadosamente seleccionadas y fórmulas coherentes.',
    'Soluzioni nutrizionali moderne, pensate per esigenze reali.':'Soluciones nutricionales modernas, pensadas para necesidades reales.',
    'Prodotti chiari, mirati e facili da inserire nella routine quotidiana.':'Productos claros, específicos y fáciles de integrar en la rutina diaria.',
    'Un sogno diventato':'Un sueño convertido en','promessa quotidiana.':'promesa diaria.',
    'Menopausa Complex':'Menopausia Complex','Capelli, Pelle & Unghie':'Cabello, Piel y Uñas','Microcircolo Superior':'Microcirculación Superior','Multivitaminico & Minerali':'Multivitamínico y Minerales',
    'Per il sistema venoso e linfatico. Utile per gambe pesanti e stanche, gonfiore alle caviglie e gambe, fragilità capillare, ritenzione idrica e vene varicose.':'Para el sistema venoso y linfático. Útil para piernas pesadas y cansadas, hinchazón de tobillos y piernas, fragilidad capilar, retención de líquidos y varices.',
    'Formula premium per chi desidera il massimo ogni giorno. Un concentrato di vitamine, minerali e nutrienti innovativi.':'Fórmula premium para quienes desean lo máximo cada día. Un concentrado de vitaminas, minerales y nutrientes innovadores.',
    'Farmacie, parafarmacie, erboristerie e partner commerciali possono richiedere catalogo e informazioni di fornitura.':'Farmacias, parafarmacias, herbolarios y socios comerciales pueden solicitar el catálogo e información de suministro.'
  },
  fr:{
    'Azienda':'Entreprise','Legale':'Mentions légales','Privacy policy':'Politique de confidentialité','Cookie policy':'Politique relative aux cookies','Note legali':'Mentions légales','Made in Italy':'Fabriqué en Italie','Scopri →':'Découvrir →','L\'':'L’',
    'Integratori alimentari italiani formulati con ingredienti selezionati, ricerca e attenzione ai dettagli. 08 Natural Technology nasce per trasformare qualità, trasparenza e cura formulativa in una promessa quotidiana di benessere.':'Compléments alimentaires italiens formulés avec des ingrédients sélectionnés, de la recherche et une attention aux détails. 08 Natural Technology transforme qualité, transparence et soin formulatif en une promesse quotidienne de bien-être.',
    '90 capsule · 90 giorni':'90 gélules · 90 jours','30 capsule · 30 giorni':'30 gélules · 30 jours',
    'Identità italiana, cura del dettaglio e standard elevati in ogni scelta.':'Identité italienne, soin du détail et standards élevés dans chaque choix.',
    'Materie prime selezionate con attenzione e formule coerenti.':'Matières premières soigneusement sélectionnées et formules cohérentes.',
    'Soluzioni nutrizionali moderne, pensate per esigenze reali.':'Solutions nutritionnelles modernes, pensées pour des besoins réels.',
    'Prodotti chiari, mirati e facili da inserire nella routine quotidiana.':'Produits clairs, ciblés et faciles à intégrer dans la routine quotidienne.',
    'Un sogno diventato':'Un rêve devenu','promessa quotidiana.':'une promesse quotidienne.',
    'Menopausa Complex':'Ménopause Complex','Capelli, Pelle & Unghie':'Cheveux, Peau et Ongles','Microcircolo Superior':'Microcirculation Superior','Multivitaminico & Minerali':'Multivitamines et Minéraux',
    'Per il sistema venoso e linfatico. Utile per gambe pesanti e stanche, gonfiore alle caviglie e gambe, fragilità capillare, ritenzione idrica e vene varicose.':'Pour le système veineux et lymphatique. Utile pour les jambes lourdes et fatiguées, le gonflement des chevilles et des jambes, la fragilité capillaire, la rétention d’eau et les varices.',
    'Formula premium per chi desidera il massimo ogni giorno. Un concentrato di vitamine, minerali e nutrienti innovativi.':'Formule premium pour ceux qui recherchent le meilleur chaque jour. Un concentré de vitamines, minéraux et nutriments innovants.',
    'Farmacie, parafarmacie, erboristerie e partner commerciali possono richiedere catalogo e informazioni di fornitura.':'Pharmacies, parapharmacies, herboristeries et partenaires commerciaux peuvent demander le catalogue et les informations d’approvisionnement.'
  },
  de:{
    'Azienda':'Unternehmen','Legale':'Rechtliches','Privacy policy':'Datenschutzerklärung','Cookie policy':'Cookie-Richtlinie','Note legali':'Rechtliche Hinweise','Made in Italy':'Hergestellt in Italien','Scopri →':'Entdecken →','L\'':'Die',
    'Integratori alimentari italiani formulati con ingredienti selezionati, ricerca e attenzione ai dettagli. 08 Natural Technology nasce per trasformare qualità, trasparenza e cura formulativa in una promessa quotidiana di benessere.':'Italienische Nahrungsergänzungsmittel, formuliert mit ausgewählten Inhaltsstoffen, Forschung und Liebe zum Detail. 08 Natural Technology verwandelt Qualität, Transparenz und sorgfältige Formulierung in ein tägliches Wohlbefinden-Versprechen.',
    '90 capsule · 90 giorni':'90 Kapseln · 90 Tage','30 capsule · 30 giorni':'30 Kapseln · 30 Tage',
    'Identità italiana, cura del dettaglio e standard elevati in ogni scelta.':'Italienische Identität, Liebe zum Detail und hohe Standards bei jeder Entscheidung.',
    'Materie prime selezionate con attenzione e formule coerenti.':'Sorgfältig ausgewählte Rohstoffe und stimmige Formulierungen.',
    'Soluzioni nutrizionali moderne, pensate per esigenze reali.':'Moderne Ernährungslösungen, entwickelt für reale Bedürfnisse.',
    'Prodotti chiari, mirati e facili da inserire nella routine quotidiana.':'Klare, gezielte Produkte, die sich leicht in die tägliche Routine integrieren lassen.',
    'Un sogno diventato':'Ein Traum wurde zu','promessa quotidiana.':'einem täglichen Versprechen.',
    'Menopausa Complex':'Menopause Complex','Capelli, Pelle & Unghie':'Haare, Haut & Nägel','Microcircolo Superior':'Mikrozirkulation Superior','Multivitaminico & Minerali':'Multivitamin & Mineralstoffe',
    'Per il sistema venoso e linfatico. Utile per gambe pesanti e stanche, gonfiore alle caviglie e gambe, fragilità capillare, ritenzione idrica e vene varicose.':'Für das Venen- und Lymphsystem. Hilfreich bei schweren und müden Beinen, Schwellungen an Knöcheln und Beinen, Kapillarfragilität, Wassereinlagerungen und Krampfadern.',
    'Formula premium per chi desidera il massimo ogni giorno. Un concentrato di vitamine, minerali e nutrienti innovativi.':'Premium-Formel für alle, die jeden Tag das Maximum wünschen. Ein Konzentrat aus Vitaminen, Mineralstoffen und innovativen Nährstoffen.',
    'Farmacie, parafarmacie, erboristerie e partner commerciali possono richiedere catalogo e informazioni di fornitura.':'Apotheken, Parapharmazien, Kräuterläden und Geschäftspartner können Katalog und Lieferinformationen anfordern.'
  },
  pt:{
    'Azienda':'Empresa','Legale':'Legal','Privacy policy':'Política de privacidade','Cookie policy':'Política de cookies','Note legali':'Notas legais','Made in Italy':'Fabricado em Itália','Scopri →':'Descobrir →','L\'':'A',
    'Integratori alimentari italiani formulati con ingredienti selezionati, ricerca e attenzione ai dettagli. 08 Natural Technology nasce per trasformare qualità, trasparenza e cura formulativa in una promessa quotidiana di benessere.':'Suplementos alimentares italianos formulados com ingredientes selecionados, pesquisa e atenção aos detalhes. A 08 Natural Technology nasce para transformar qualidade, transparência e cuidado formulativo numa promessa diária de bem-estar.',
    '90 capsule · 90 giorni':'90 cápsulas · 90 dias','30 capsule · 30 giorni':'30 cápsulas · 30 dias',
    'Identità italiana, cura del dettaglio e standard elevati in ogni scelta.':'Identidade italiana, cuidado com os detalhes e padrões elevados em cada escolha.',
    'Materie prime selezionate con attenzione e formule coerenti.':'Matérias-primas cuidadosamente selecionadas e fórmulas coerentes.',
    'Soluzioni nutrizionali moderne, pensate per esigenze reali.':'Soluções nutricionais modernas, pensadas para necessidades reais.',
    'Prodotti chiari, mirati e facili da inserire nella routine quotidiana.':'Produtos claros, direcionados e fáceis de integrar na rotina diária.',
    'Un sogno diventato':'Um sonho transformado em','promessa quotidiana.':'uma promessa diária.',
    'Menopausa Complex':'Menopausa Complex','Capelli, Pelle & Unghie':'Cabelo, Pele e Unhas','Microcircolo Superior':'Microcirculação Superior','Multivitaminico & Minerali':'Multivitamínico e Minerais',
    'Per il sistema venoso e linfatico. Utile per gambe pesanti e stanche, gonfiore alle caviglie e gambe, fragilità capillare, ritenzione idrica e vene varicose.':'Para o sistema venoso e linfático. Útil para pernas pesadas e cansadas, inchaço nos tornozelos e pernas, fragilidade capilar, retenção de líquidos e varizes.',
    'Formula premium per chi desidera il massimo ogni giorno. Un concentrato di vitamine, minerali e nutrienti innovativi.':'Fórmula premium para quem deseja o máximo todos os dias. Um concentrado de vitaminas, minerais e nutrientes inovadores.',
    'Farmacie, parafarmacie, erboristerie e partner commerciali possono richiedere catalogo e informazioni di fornitura.':'Farmácias, parafarmácias, ervanárias e parceiros comerciais podem solicitar o catálogo e informações de fornecimento.'
  }
};
Object.keys(TRANSLATION_PATCHES).forEach(function(lang){
  TRANSLATIONS[lang] = Object.assign({}, TRANSLATIONS[lang] || {}, TRANSLATION_PATCHES[lang]);
});


// v20.1: copertura completa testi principali della home.
const TRANSLATION_HOME_PATCHES = {
  en:{
    'Vai al contenuto':'Skip to content','Lingua':'Language','08 Natural Technology | Prodotti':'08 Natural Technology | Products',
    '90 capsule':'90 capsules','90 giorni':'90 days','60 capsule · 30 giorni':'60 capsules · 30 days',
    'Una soluzione nutrizionale completa, pensata per accompagnare la routine quotidiana con qualità e praticità.':'A complete nutritional solution designed to support the daily routine with quality and practicality.',
    '“Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita.”':'“For us, wellbeing is not just a word: it is energy, balance, serenity and quality of life.”',
    'nasce dal desiderio di creare integratori alimentari curati nei dettagli, con formule comprensibili, ingredienti selezionati e un\'identità italiana riconoscibile.':'was born from the desire to create food supplements cared for in every detail, with understandable formulas, selected ingredients and a recognizable Italian identity.',
    'Non volevamo realizzare semplicemente prodotti, ma costruire un marchio capace di trasmettere fiducia, attenzione e rispetto verso chi ogni giorno sceglie di prendersi cura di sé.':'We did not simply want to make products, but to build a brand capable of conveying trust, attention and respect to those who choose to take care of themselves every day.',
    'Scienza':'Science','Nutrizione':'Nutrition','Microcircolo':'Microcirculation','Ricerca':'Research',
    'Vitamina C liposomiale vs tradizionale: perché la biodisponibilità cambia tutto':'Liposomal vs traditional Vitamin C: why bioavailability changes everything',
    'Non tutta la Vitamina C è uguale. La forma liposomiale raggiunge le cellule in modo radicalmente diverso.':'Not all Vitamin C is the same. The liposomal form reaches cells in a radically different way.',
    'Mela Annurca: il superfood italiano per capelli forti e pelle luminosa':'Annurca Apple: the Italian superfood for strong hair and radiant skin',
    'Un frutto della tradizione campana diventato protagonista della nutraceutica moderna.':'A fruit from the Campania tradition that has become a protagonist of modern nutraceuticals.',
    'Gambe pesanti in estate: come supportare il microcircolo giorno per giorno':'Heavy legs in summer: how to support microcirculation day by day',
    'Il caldo aumenta la sensazione di pesantezza. Scopri i meccanismi e le strategie di supporto.':'Heat increases the feeling of heaviness. Discover the mechanisms and support strategies.',
    'CoQ10 e Pterostilbene: la sinergia anti-aging spiegata dalla ricerca scientifica':'CoQ10 and Pterostilbene: the anti-aging synergy explained by scientific research',
    'Due molecole, un obiettivo: rallentare i processi ossidativi cellulari.':'Two molecules, one goal: slowing down cellular oxidative processes.',
    '12 maggio 2026 · 6 min di lettura':'12 May 2026 · 6 min read','16 maggio 2026 · 5 min di lettura':'16 May 2026 · 5 min read','18 maggio 2026 · 5 min di lettura':'18 May 2026 · 5 min read','20 maggio 2026 · 6 min di lettura':'20 May 2026 · 6 min read','© 2026 08 Natural Technology · Tutti i diritti riservati':'© 2026 08 Natural Technology · All rights reserved','Tel. 080 303 1103':'Tel. 080 303 1103'
  },
  es:{
    'Vai al contenuto':'Ir al contenido','Lingua':'Idioma','08 Natural Technology | Prodotti':'08 Natural Technology | Productos',
    '90 capsule':'90 cápsulas','90 giorni':'90 días','60 capsule · 30 giorni':'60 cápsulas · 30 días',
    'Una soluzione nutrizionale completa, pensata per accompagnare la routine quotidiana con qualità e praticità.':'Una solución nutricional completa, pensada para acompañar la rutina diaria con calidad y practicidad.',
    '“Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita.”':'“Para nosotros, el bienestar no es solo una palabra: es energía, equilibrio, serenidad y calidad de vida.”',
    'nasce dal desiderio di creare integratori alimentari curati nei dettagli, con formule comprensibili, ingredienti selezionati e un\'identità italiana riconoscibile.':'nace del deseo de crear complementos alimenticios cuidados al detalle, con fórmulas comprensibles, ingredientes seleccionados y una identidad italiana reconocible.',
    'Non volevamo realizzare semplicemente prodotti, ma costruire un marchio capace di trasmettere fiducia, attenzione e rispetto verso chi ogni giorno sceglie di prendersi cura di sé.':'No queríamos simplemente crear productos, sino construir una marca capaz de transmitir confianza, atención y respeto a quienes cada día eligen cuidarse.',
    'Scienza':'Ciencia','Nutrizione':'Nutrición','Microcircolo':'Microcirculación','Ricerca':'Investigación',
    'Vitamina C liposomiale vs tradizionale: perché la biodisponibilità cambia tutto':'Vitamina C liposomal vs tradicional: por qué la biodisponibilidad lo cambia todo',
    'Non tutta la Vitamina C è uguale. La forma liposomiale raggiunge le cellule in modo radicalmente diverso.':'No toda la vitamina C es igual. La forma liposomal llega a las células de una manera radicalmente diferente.',
    'Mela Annurca: il superfood italiano per capelli forti e pelle luminosa':'Manzana Annurca: el superalimento italiano para cabello fuerte y piel luminosa',
    'Un frutto della tradizione campana diventato protagonista della nutraceutica moderna.':'Una fruta de la tradición campana convertida en protagonista de la nutracéutica moderna.',
    'Gambe pesanti in estate: come supportare il microcircolo giorno per giorno':'Piernas pesadas en verano: cómo apoyar la microcirculación día a día',
    'Il caldo aumenta la sensazione di pesantezza. Scopri i meccanismi e le strategie di supporto.':'El calor aumenta la sensación de pesadez. Descubre los mecanismos y las estrategias de apoyo.',
    'CoQ10 e Pterostilbene: la sinergia anti-aging spiegata dalla ricerca scientifica':'CoQ10 y pterostilbeno: la sinergia antiedad explicada por la investigación científica',
    'Due molecole, un obiettivo: rallentare i processi ossidativi cellulari.':'Dos moléculas, un objetivo: ralentizar los procesos oxidativos celulares.',
    '12 maggio 2026 · 6 min di lettura':'12 de mayo de 2026 · 6 min de lectura','16 maggio 2026 · 5 min di lettura':'16 de mayo de 2026 · 5 min de lectura','18 maggio 2026 · 5 min di lettura':'18 de mayo de 2026 · 5 min de lectura','20 maggio 2026 · 6 min di lettura':'20 de mayo de 2026 · 6 min de lectura','© 2026 08 Natural Technology · Tutti i diritti riservati':'© 2026 08 Natural Technology · Todos los derechos reservados','Tel. 080 303 1103':'Tel. 080 303 1103'
  },
  fr:{
    'Vai al contenuto':'Aller au contenu','Lingua':'Langue','08 Natural Technology | Prodotti':'08 Natural Technology | Produits',
    '90 capsule':'90 gélules','90 giorni':'90 jours','60 capsule · 30 giorni':'60 gélules · 30 jours',
    'Una soluzione nutrizionale completa, pensata per accompagnare la routine quotidiana con qualità e praticità.':'Une solution nutritionnelle complète, conçue pour accompagner la routine quotidienne avec qualité et praticité.',
    '“Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita.”':'« Pour nous, le bien-être n’est pas un simple mot : c’est énergie, équilibre, sérénité et qualité de vie. »',
    'nasce dal desiderio di creare integratori alimentari curati nei dettagli, con formule comprensibili, ingredienti selezionati e un\'identità italiana riconoscibile.':'naît du désir de créer des compléments alimentaires soignés dans les moindres détails, avec des formules compréhensibles, des ingrédients sélectionnés et une identité italienne reconnaissable.',
    'Non volevamo realizzare semplicemente prodotti, ma costruire un marchio capace di trasmettere fiducia, attenzione e rispetto verso chi ogni giorno sceglie di prendersi cura di sé.':'Nous ne voulions pas simplement créer des produits, mais construire une marque capable de transmettre confiance, attention et respect à ceux qui choisissent chaque jour de prendre soin d’eux.',
    'Scienza':'Science','Nutrizione':'Nutrition','Microcircolo':'Microcirculation','Ricerca':'Recherche',
    'Vitamina C liposomiale vs tradizionale: perché la biodisponibilità cambia tutto':'Vitamine C liposomale vs traditionnelle : pourquoi la biodisponibilité change tout',
    'Non tutta la Vitamina C è uguale. La forma liposomiale raggiunge le cellule in modo radicalmente diverso.':'Toutes les vitamines C ne se valent pas. La forme liposomale atteint les cellules d’une manière radicalement différente.',
    'Mela Annurca: il superfood italiano per capelli forti e pelle luminosa':'Pomme Annurca : le superaliment italien pour des cheveux forts et une peau lumineuse',
    'Un frutto della tradizione campana diventato protagonista della nutraceutica moderna.':'Un fruit de la tradition campanienne devenu un protagoniste de la nutraceutique moderne.',
    'Gambe pesanti in estate: come supportare il microcircolo giorno per giorno':'Jambes lourdes en été : comment soutenir la microcirculation au quotidien',
    'Il caldo aumenta la sensazione di pesantezza. Scopri i meccanismi e le strategie di supporto.':'La chaleur augmente la sensation de lourdeur. Découvrez les mécanismes et les stratégies de soutien.',
    'CoQ10 e Pterostilbene: la sinergia anti-aging spiegata dalla ricerca scientifica':'CoQ10 et ptérostilbène : la synergie anti-âge expliquée par la recherche scientifique',
    'Due molecole, un obiettivo: rallentare i processi ossidativi cellulari.':'Deux molécules, un objectif : ralentir les processus oxydatifs cellulaires.',
    '12 maggio 2026 · 6 min di lettura':'12 mai 2026 · 6 min de lecture','16 maggio 2026 · 5 min di lettura':'16 mai 2026 · 5 min de lecture','18 maggio 2026 · 5 min di lettura':'18 mai 2026 · 5 min de lecture','20 maggio 2026 · 6 min di lettura':'20 mai 2026 · 6 min de lecture','© 2026 08 Natural Technology · Tutti i diritti riservati':'© 2026 08 Natural Technology · Tous droits réservés','Tel. 080 303 1103':'Tél. 080 303 1103'
  },
  de:{
    'Vai al contenuto':'Zum Inhalt springen','Lingua':'Sprache','08 Natural Technology | Prodotti':'08 Natural Technology | Produkte',
    '90 capsule':'90 Kapseln','90 giorni':'90 Tage','60 capsule · 30 giorni':'60 Kapseln · 30 Tage',
    'Una soluzione nutrizionale completa, pensata per accompagnare la routine quotidiana con qualità e praticità.':'Eine vollständige Ernährungslösung, entwickelt, um die tägliche Routine mit Qualität und Praktikabilität zu begleiten.',
    '“Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita.”':'„Für uns ist Wohlbefinden nicht nur ein Wort: Es ist Energie, Gleichgewicht, Gelassenheit und Lebensqualität.“',
    'nasce dal desiderio di creare integratori alimentari curati nei dettagli, con formule comprensibili, ingredienti selezionati e un\'identità italiana riconoscibile.':'entstand aus dem Wunsch, Nahrungsergänzungsmittel mit Liebe zum Detail, verständlichen Formeln, ausgewählten Inhaltsstoffen und einer erkennbaren italienischen Identität zu schaffen.',
    'Non volevamo realizzare semplicemente prodotti, ma costruire un marchio capace di trasmettere fiducia, attenzione e rispetto verso chi ogni giorno sceglie di prendersi cura di sé.':'Wir wollten nicht einfach Produkte herstellen, sondern eine Marke aufbauen, die Vertrauen, Aufmerksamkeit und Respekt gegenüber Menschen vermittelt, die sich jeden Tag um sich selbst kümmern.',
    'Scienza':'Wissenschaft','Nutrizione':'Ernährung','Microcircolo':'Mikrozirkulation','Ricerca':'Forschung',
    'Vitamina C liposomiale vs tradizionale: perché la biodisponibilità cambia tutto':'Liposomales vs traditionelles Vitamin C: Warum Bioverfügbarkeit alles verändert',
    'Non tutta la Vitamina C è uguale. La forma liposomiale raggiunge le cellule in modo radicalmente diverso.':'Nicht jedes Vitamin C ist gleich. Die liposomale Form erreicht die Zellen auf grundlegend andere Weise.',
    'Mela Annurca: il superfood italiano per capelli forti e pelle luminosa':'Annurca-Apfel: das italienische Superfood für kräftiges Haar und strahlende Haut',
    'Un frutto della tradizione campana diventato protagonista della nutraceutica moderna.':'Eine Frucht aus der kampanischen Tradition, die zu einem Protagonisten der modernen Nutraceutik geworden ist.',
    'Gambe pesanti in estate: come supportare il microcircolo giorno per giorno':'Schwere Beine im Sommer: Wie man die Mikrozirkulation Tag für Tag unterstützt',
    'Il caldo aumenta la sensazione di pesantezza. Scopri i meccanismi e le strategie di supporto.':'Hitze verstärkt das Schweregefühl. Entdecken Sie die Mechanismen und Unterstützungsstrategien.',
    'CoQ10 e Pterostilbene: la sinergia anti-aging spiegata dalla ricerca scientifica':'CoQ10 und Pterostilben: die Anti-Aging-Synergie aus wissenschaftlicher Sicht',
    'Due molecole, un obiettivo: rallentare i processi ossidativi cellulari.':'Zwei Moleküle, ein Ziel: oxidative Zellprozesse verlangsamen.',
    '12 maggio 2026 · 6 min di lettura':'12. Mai 2026 · 6 Min. Lesezeit','16 maggio 2026 · 5 min di lettura':'16. Mai 2026 · 5 Min. Lesezeit','18 maggio 2026 · 5 min di lettura':'18. Mai 2026 · 5 Min. Lesezeit','20 maggio 2026 · 6 min di lettura':'20. Mai 2026 · 6 Min. Lesezeit','© 2026 08 Natural Technology · Tutti i diritti riservati':'© 2026 08 Natural Technology · Alle Rechte vorbehalten','Tel. 080 303 1103':'Tel. 080 303 1103'
  },
  pt:{
    'Vai al contenuto':'Ir para o conteúdo','Lingua':'Idioma','08 Natural Technology | Prodotti':'08 Natural Technology | Produtos',
    '90 capsule':'90 cápsulas','90 giorni':'90 dias','60 capsule · 30 giorni':'60 cápsulas · 30 dias',
    'Una soluzione nutrizionale completa, pensata per accompagnare la routine quotidiana con qualità e praticità.':'Uma solução nutricional completa, pensada para acompanhar a rotina diária com qualidade e praticidade.',
    '“Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita.”':'“Para nós, o bem-estar não é apenas uma palavra: é energia, equilíbrio, serenidade e qualidade de vida.”',
    'nasce dal desiderio di creare integratori alimentari curati nei dettagli, con formule comprensibili, ingredienti selezionati e un\'identità italiana riconoscibile.':'nasce do desejo de criar suplementos alimentares cuidados ao detalhe, com fórmulas compreensíveis, ingredientes selecionados e uma identidade italiana reconhecível.',
    'Non volevamo realizzare semplicemente prodotti, ma costruire un marchio capace di trasmettere fiducia, attenzione e rispetto verso chi ogni giorno sceglie di prendersi cura di sé.':'Não queríamos simplesmente criar produtos, mas construir uma marca capaz de transmitir confiança, atenção e respeito a quem escolhe cuidar de si todos os dias.',
    'Scienza':'Ciência','Nutrizione':'Nutrição','Microcircolo':'Microcirculação','Ricerca':'Pesquisa',
    'Vitamina C liposomiale vs tradizionale: perché la biodisponibilità cambia tutto':'Vitamina C lipossomal vs tradicional: porque a biodisponibilidade muda tudo',
    'Non tutta la Vitamina C è uguale. La forma liposomiale raggiunge le cellule in modo radicalmente diverso.':'Nem toda a vitamina C é igual. A forma lipossomal chega às células de uma forma radicalmente diferente.',
    'Mela Annurca: il superfood italiano per capelli forti e pelle luminosa':'Maçã Annurca: o superalimento italiano para cabelos fortes e pele luminosa',
    'Un frutto della tradizione campana diventato protagonista della nutraceutica moderna.':'Um fruto da tradição da Campânia que se tornou protagonista da nutracêutica moderna.',
    'Gambe pesanti in estate: come supportare il microcircolo giorno per giorno':'Pernas pesadas no verão: como apoiar a microcirculação no dia a dia',
    'Il caldo aumenta la sensazione di pesantezza. Scopri i meccanismi e le strategie di supporto.':'O calor aumenta a sensação de peso. Descubra os mecanismos e as estratégias de apoio.',
    'CoQ10 e Pterostilbene: la sinergia anti-aging spiegata dalla ricerca scientifica':'CoQ10 e pterostilbeno: a sinergia anti-aging explicada pela investigação científica',
    'Due molecole, un obiettivo: rallentare i processi ossidativi cellulari.':'Duas moléculas, um objetivo: abrandar os processos oxidativos celulares.',
    '12 maggio 2026 · 6 min di lettura':'12 de maio de 2026 · 6 min de leitura','16 maggio 2026 · 5 min di lettura':'16 de maio de 2026 · 5 min de leitura','18 maggio 2026 · 5 min di lettura':'18 de maio de 2026 · 5 min de leitura','20 maggio 2026 · 6 min di lettura':'20 de maio de 2026 · 6 min de leitura','© 2026 08 Natural Technology · Tutti i diritti riservati':'© 2026 08 Natural Technology · Todos os direitos reservados','Tel. 080 303 1103':'Tel. 080 303 1103'
  }
};
Object.keys(TRANSLATION_HOME_PATCHES).forEach(function(lang){
  TRANSLATIONS[lang] = Object.assign({}, TRANSLATIONS[lang] || {}, TRANSLATION_HOME_PATCHES[lang]);
});

function initLanguageSwitch(){
  const saved = localStorage.getItem('08nt_lang') || 'it';
  document.querySelectorAll('[data-language-switch]').forEach(function(sw){
    const toggle = sw.querySelector('[data-lang-toggle]');
    if(toggle){
      toggle.addEventListener('click', function(){
        const open = sw.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    sw.querySelectorAll('[data-lang]').forEach(function(btn){
      btn.addEventListener('click', function(){
        const lang = btn.getAttribute('data-lang') || 'it';
        localStorage.setItem('08nt_lang', lang);
        applyLanguage(lang);
        sw.classList.remove('open');
      });
    });
  });
  document.addEventListener('click', function(ev){
    document.querySelectorAll('[data-language-switch].open').forEach(function(sw){
      if(!sw.contains(ev.target)) sw.classList.remove('open');
    });
  });
  applyLanguage(saved);
}

function translateText(lang, key){
  if(lang === 'it') return key;
  if(TRANSLATIONS[lang] && Object.prototype.hasOwnProperty.call(TRANSLATIONS[lang], key)){
    return TRANSLATIONS[lang][key];
  }
  return key;
}

function translateAttributes(lang){
  const attrs = ['aria-label','title','alt','placeholder'];
  document.querySelectorAll('[aria-label],[title],[alt],[placeholder]').forEach(function(el){
    attrs.forEach(function(attr){
      if(!el.hasAttribute(attr)) return;
      const storeKey = '__itAttr_' + attr.replace(/-/g, '_');
      if(!el[storeKey]) el[storeKey] = el.getAttribute(attr);
      const original = el[storeKey] || '';
      const trimmed = original.trim();
      if(!trimmed) return;
      const leading = (original.match(/^\s*/) || [''])[0];
      const trailing = (original.match(/\s*$/) || [''])[0];
      el.setAttribute(attr, leading + translateText(lang, trimmed) + trailing);
    });
  });
}

function applyLanguage(lang){
  if(!SITE_LANGUAGES[lang]) lang = 'it';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang-toggle]').forEach(function(btn){
    const buttonForLang = document.querySelector('[data-lang="' + lang + '"] img');
    if(buttonForLang){
      const src = buttonForLang.getAttribute('src');
      const alt = buttonForLang.getAttribute('alt') || lang;
      btn.innerHTML = '<img src="' + src + '" alt="' + alt + '" class="flag-icon current-flag">';
    } else if(SITE_LANGUAGE_ASSETS[lang]){
      btn.innerHTML = '<img src="' + SITE_LANGUAGE_ASSETS[lang] + '" alt="' + lang + '" class="flag-icon current-flag">';
    } else {
      btn.textContent = SITE_LANGUAGES[lang];
    }
  });
  document.querySelectorAll('[data-lang]').forEach(function(btn){ btn.classList.toggle('active', btn.getAttribute('data-lang') === lang); });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node){
      if(!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if(!parent || ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT','OPTION'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if(parent.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function(node){
    if(!node.__itText) node.__itText = node.nodeValue;
    const original = node.__itText;
    const key = original.trim();
    const leading = (original.match(/^\s*/) || [''])[0];
    const trailing = (original.match(/\s*$/) || [''])[0];
    node.nodeValue = leading + translateText(lang, key) + trailing;
  });
  translateAttributes(lang);
}
