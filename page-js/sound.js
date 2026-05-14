/**
 * @fileoverview מודול הצליל — יצירת AudioContext וניגון צלילים סינוסואידליים.
 * AudioContext נוצר בעצלתיים (lazy) בלחיצה הראשונה כדי לעקוף חסימת דפדפן.
 * @module sound
 */

/**
 * מופע ה-AudioContext הגלובלי; null עד הניגון הראשון.
 * @type {AudioContext|null}
 */
let audioCtx = null;

/**
 * מחזיר את ה-AudioContext הקיים, או יוצר חדש אם עדיין לא נוצר.
 * משתמש ב-`webkitAudioContext` כ-fallback לדפדפנים ישנים יותר.
 *
 * @returns {AudioContext} מופע ה-AudioContext הפעיל.
 *
 * @example
 * const ctx = getAudioCtx();
 * console.log(ctx.state); // "running" | "suspended"
 */
export function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

/**
 * תדרי הצלילים (Hz) המתאימים לתשעת תאי המשחק.
 * כל אינדקס מתאים לתא: 0 = תא 1, 8 = תא 9.
 *
 * @constant {number[]}
 * @example
 * playNote(notes[0]); // מנגן דו (C4) עבור תא 1
 */
export const notes = [
    261.63, // דו  (C4)
    293.66, // רה  (D4)
    329.63, // מי  (E4)
    349.23, // פה  (F4)
    392.00, // סול (G4)
    440.00, // לה  (A4)
    493.88, // סי  (B4)
    523.25, // דו גבוה (C5)
    587.33  // רה גבוה (D5)
];

/**
 * מנגן צליל סינוסואידלי בתדר נתון למשך כחצי שנייה עם fade-out.
 * אם ה-AudioContext מושהה, מחדש אותו לפני הניגון.
 *
 * @param {number} frequency - תדר הצליל בהרץ (Hz).
 * @returns {void}
 *
 * @example
 * playNote(440); // מנגן לה (A4)
 * playNote(notes[2]); // מנגן מי (E4) — תא 3
 */
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