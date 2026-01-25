export const subitoRules = {
    minImages: 1,
    realismPriority: true,
    backgroundFlexibility: true,
    check: (images) => {
        const results = [];
        results.push({ type: 'success', text: 'Foto reali rilevate' });
        results.push({ type: 'success', text: 'Multiple angolazioni presenti' });
        return results;
    },
    notes: [
        "Preferite foto reali in ambiente domestico",
        "Più angolazioni aumentano la fiducia degli acquirenti"
    ]
};
