/**
 * @fileoverview מודול הטיימר — ספירה לאחור עם תצוגת DOM ו-callback בפקיעת הזמן.
 * @module taimer
 */

/**
 * מזהה ה-interval הפעיל; null אם אין טיימר פועל.
 * @type {number|null}
 */
let intervalId = null;

/**
 * עוצר את הטיימר הפעיל אם קיים, ומאפס את המזהה.
 * בטוח לקריאה גם כשאין טיימר פעיל.
 *
 * @returns {void}
 *
 * @example
 * stopTimer(); // עוצר את הטיימר הנוכחי (אם יש)
 */
export function stopTimer() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

/**
 * מפעיל ספירה לאחור ומעדכן את אלמנט `#taimer` ב-DOM בכל שנייה.
 * כאשר הזמן מגיע לאפס — עוצר את עצמו ומפעיל את ה-callback.
 * אם טיימר אחר פועל, עוצר אותו תחילה (רק טיימר אחד פעיל בכל זמן נתון).
 *
 * @param {number}         seconds  - מספר השניות לספירה לאחור (ערכים שליליים מטופלים כ-0).
 * @param {function(): void} onExpire - פונקציה שתופעל בפקיעת הזמן.
 * @returns {void}
 *
 * @example
 * Timer(10, () => {
 *   console.log("הזמן נגמר!");
 * });
 */
export function Timer(seconds, onExpire) {
    stopTimer(); // תמיד עוצר טיימר קודם לפני שמתחיל חדש

    let timeLeft = Math.max(0, Number(seconds) || 0);
    const taimerElement = document.getElementById("taimer");

    if (taimerElement) {
        taimerElement.innerText = String(timeLeft);
    }

    intervalId = setInterval(() => {
        timeLeft -= 1;

        if (taimerElement) {
            taimerElement.innerText = String(Math.max(0, timeLeft));
        }

        if (timeLeft <= 0) {
            stopTimer();
            if (typeof onExpire === "function") {
                onExpire();
            }
        }
    }, 1000);
}