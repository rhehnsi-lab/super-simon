// sound.js

// 1. יצירת האובייקט המרכזי שמנהל את כל האודיו בדפדפן )
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 2. מערך תדרים (בהרץ) המייצג סולם מוזיקלי עבור 9 הכפתורים בלוח
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

// 3. הפונקציה המרכזית שמייצרת את הצליל
export function playNote(frequency) {

    // בדיקה: אם הדפדפן השהה את הסאונד (הגנה נגד רעש אוטומטי), אנחנו מעירים אותו
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // א. יצירת האוסילטור (Oscillator) - הרכיב שמייצר את גל הקול הגולמי
    const oscillator = audioCtx.createOscillator();

    // ב. יצירת ה-GainNode - הרכיב ששולט על עוצמת הקול (הווליום)
    const gainNode = audioCtx.createGain();

    // ג. הגדרת סוג הגל - 'sine' מייצר צליל נקי ורך (דומה לחליל)
    oscillator.type = 'sine';

    // ד. קביעת התדר (התו) שיתנגן לפי הפרמטר שהפונקציה קיבלה
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // ה. "חיווט" הרכיבים: האוסילטור מתחבר לווליום, והווליום מתחבר לרמקולים (destination)
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // ו. התחלת יצירת הצליל בזיכרון
    oscillator.start();

    // ז. יצירת "מעטפת צליל" (Envelope) - כדי שהצליל לא ייקטע בפתאומיות:
    // 1. קביעת עוצמה מקסימלית (1) בזמן הנוכחי
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);

    // 2. דעיכה הדרגתית של העוצמה עד לאפס תוך 0.5 שניות (יוצר אפקט של פריטה)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);

    // ח. הפסקת פעולת האוסילטור בדיוק כשהדעיכה מסתיימת כדי לחסוך במשאבי מעבד
    oscillator.stop(audioCtx.currentTime + 0.5);
}