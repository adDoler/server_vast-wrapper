import AdblockDetector from "../src/adblock-detector";

const spanEl = document.getElementById("result");

new AdblockDetector().check().then((result) => {
    console.timeEnd("result");
    console.log(result);
    spanEl!.textContent = `Блокировщик${result ? "" : " не"} обнаружен`;
    spanEl!.style.color = result ? "red" : "green";
});
