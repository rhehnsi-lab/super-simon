let interval;
export const Timer = (time, onExpire) => {
    clearInterval(interval);
    let currentTime = time;
    const mins = document.getElementById("taimer");
    if (mins) mins.innerText = currentTime;

    interval = setInterval(() => {
        currentTime--;
        if (mins) mins.innerText = currentTime;
        if (currentTime <= 0) {
            clearInterval(interval);
            if (typeof onExpire === "function") onExpire();
        }
    }, 1000);
};