export const vintedRules = {
    minImages: 3,
    preferredAspectRatio: "1:1",
    allowTextOverlay: false,
    background: "clean_preferred",
    check: (images) => {
        const results = [];
        if (images.length < 3) results.push({ type: 'error', text: 'Almeno 3 immagini richieste (consigliato 5+)' });
        else results.push({ type: 'success', text: `${images.length} immagini caricate` });

        // Simulazione controlli statici
        results.push({ type: 'warning', text: 'Immagine principale non quadrata' });
        results.push({ type: 'info', text: 'Evita sfondi troppo carichi' });

        return results;
    },
    notes: [
        "L'immagine principale dovrebbe mostrare l'intero prodotto",
        "Evita sfondi disordinati"
    ]
};
