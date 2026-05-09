
let intervalId = null;

export function stopTimer() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

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