import AdblockDetector from "../src/adblock-detector";

AdblockDetector.check().then((result) => {
    setTimeout(() => {

        const spanEl = document.getElementById("result");
        spanEl!.textContent = `Блокировщик${result ? "" : " не"} обнаружен`;
        spanEl!.style.color = result ? "red" : "green";
    }, 1000);
});
alert("hi");
