export const ebayRules = {
    minImages: 1,
    minResolution: "1600x1600",
    allowTextOverlay: false,
    watermarkAllowed: false,
    background: "white_or_neutral",
    check: (images) => {
        const results = [];
        results.push({ type: 'success', text: 'Risoluzione sufficiente' });
        results.push({ type: 'warning', text: 'Rilevato possibile testo su un\'immagine' });
        results.push({ type: 'info', text: 'Illuminazione non uniforme' });
        return results;
    },
    notes: [
        "L'immagine principale deve essere pulita e centrata",
        "Nessun bordo o testo promozionale"
    ]
};
