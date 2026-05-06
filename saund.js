// sound.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// מפת התדרים של התווים (9 תדרים עבור 9 הכפתורים)
export const notes = [
    261.63, // do
    293.66, // re
    329.63, // mi
    349.23, // fa
    392.00, // sol
    440.00, // la
    493.88, // si
    523.25, // do גבוה
    587.33  // re גבוה
];

export function playNote(frequency) {
    // דואג שהסאונד יעבוד גם אחרי שהדפדפן משהה אותו
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    // גרימת דעיכה לצליל כדי שלא יישמע קטוע
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    oscillator.stop(audioCtx.currentTime + 0.5);
}