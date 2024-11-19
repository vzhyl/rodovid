const burgerBtn = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");

burgerBtn.addEventListener("click", function() {
    burgerBtn.classList.toggle("open");
    navLinks.classList.toggle("open");
})

if (window.matchMedia("(max-width: 300px)").matches) {
    console.log("Відкрийте на нормальному пристрої...");
    document.body.innerHTML = "";
    var errorTextElement = document.createElement("p");
    errorTextElement.innerHTML = "Відкрийте сайт на комп'ютері";
    errorTextElement.style = "text-align: center";

    document.body.style = "position: fixed; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center";
    document.body.append(errorTextElement);
}