function checkVisibility() {
    observerCheck().then((res) => {
        if (res === null) {
            fpsMeter().then((f) => {
                console.log(f)
            })
        } else if (res === false)
            console.log("элемент скрыт");
    })
}

function observerCheck() {
    return new Promise((resolve) => {

        const observer = new IntersectionObserver(([entri]) => {
            console.log(entri.isVisible);
            if (entri.isVisible === undefined) {
                clearTimeout(timeoutId);
                resolve(null)
            }
            if (entri.isIntersecting) {
                clearTimeout(timeoutId);
                resolve(entri.isVisible);
            }
        }, {
            rootMargin: "0px",
            threshold: [0, 0.12, 0.25, 0.37, 0.5, 0.75, 1],
            trackVisibility: true,
            delay: 100
        });
        
        observer.observe(document.body);

        const timeoutId = setTimeout(() => {
            resolve(false);
        }, 1000);
    })   
}

function fpsMeter() {
    let prevTime = Date.now(),
        frames = 0;

    return new Promise((resolve) => {
        let requestAnimationFrameId;
        let timeoutId;
        let isChangeFrame = false;

        function loop() {
            isChangeFrame = true;
            const time = Date.now();
            frames++;

            if (time > prevTime + 50) {
                let fps = Math.round((frames * 1000) / (time - prevTime));
                prevTime = time;
                frames = 0;

                if (fps < 5) {
                    clearTimeout(timeoutId);
                    cancelAnimationFrame(requestAnimationFrameId);
                    resolve(false);
                }

                console.info('FPS: ', fps);
            }

            requestAnimationFrameId = requestAnimationFrame(loop);
        }

        timeoutId = setTimeout(() => {
            cancelAnimationFrame(requestAnimationFrameId);
            resolve(isChangeFrame ? true : false);
        }, 1000);

        // Start the animation frame loop
        requestAnimationFrameId = requestAnimationFrame(loop);
        console.log('hid');
    });
}

setTimeout(() => {
    checkVisibility();
}, 2000)