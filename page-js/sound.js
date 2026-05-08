// sound.js

// AudioContext נוצר רק בפעם הראשונה שמנגנים — דפדפנים חוסמים יצירה אוטומטית בטעינה
let audioCtx = null;

export function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export const notes = [
    261.63, // דו (C4)
    293.66, // רה (D4)
    329.63, // מי (E4)
    349.23, // פה (F4)
    392.00, // סול (G4)
    440.00, // לה (A4)
    493.88, // סי (B4)
    523.25, // דו גבוה (C5)
    587.33  // רה גבוה (D5)
];

export function playNote(frequency) {
    const ctx = getAudioCtx();

    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    oscillator.stop(ctx.currentTime + 0.5);
}