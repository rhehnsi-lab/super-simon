const audio=new (window.AudioContext||window.webkitAudioContext)();
function playNote(freq) {// יצירת מתנד (Oscillator) - זה הרכיב שיוצר את גל הקול
    const oscillator = audioCtx.createOscillator();
    // יצירת כפתור עוצמה (Gain Node) כדי לשלוט בדעיכת הצליל
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine'; // סוג הגל (sine, square, sawtooth, triangle)
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    // גרימת דעיכה לצליל כדי שלא יישמע קטוע מדי
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
    oscillator.stop(audioCtx.currentTime + 1);
}

// מפת התדרים של התווים (בהרצים)
const notes = {
    'do': 261.63,
    're': 293.66,
    'mi': 329.63,
    'fa': 349.23,
    'sol': 392.00,
    'la': 440.00,
    'si': 493.88
}; 