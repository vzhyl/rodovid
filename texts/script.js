const listObj = document.getElementById("resList");
const searchBar = document.getElementById("searchBar");
const searchObj = document.getElementById("search");
const outputObj = document.getElementById("textOutput");
const backBtn = document.getElementById("backBtn");

var fileArray;
fetch("data/text_database.json")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        fileArray = data;
        outputList(data, "");
    });

searchBar.addEventListener("input", () => {
    outputList(fileArray, searchBar.value);
});

function outputList(data, matchStr) {
    listObj.innerHTML = "";
    var eventList = [];

    for (el in data) {
        if (el.toLowerCase().includes(matchStr.toLowerCase())) {
            var newListElement = document.createElement("div");
            newListElement.classList.add("resObj");

            var fileLink = document.createElement("a");
            fileLink.innerHTML = el;
            eventList.push([fileLink, `data/${data[el]["Файл"]}`]);

            newListElement.append(fileLink);

            var containerElement = document.createElement("div");
            containerElement.innerHTML += `<p><span>${data[el]["Дата створення"]}</span> ${data[el]["Автор"]}</p>`;

            var markersUl = document.createElement("ul");

            for (marker in data[el]["Маркери"]) {
                var markersLi = document.createElement("li");
                markersLi.innerHTML = data[el]["Маркери"][marker];
                markersUl.append(markersLi);
            }

            containerElement.append(markersUl);
            newListElement.append(containerElement);

            listObj.appendChild(newListElement);
        }
    }
    eventList.forEach(([obj, link]) => {
        obj.addEventListener("click", function() {
            scrollToTop(goToText, link);
        });
    });
}
let mediaMatch = window.matchMedia("(min-width: 1100px)");

function goToText(textLink) {
    searchBar.value = "";

    fetch(textLink)
        .then((res) => res.text())
        .then((mdText) => {
            var converter = new showdown.Converter(),
                text = mdText,
                html = converter.makeHtml(text);
            outputObj.innerHTML = html;

            imgSettings();
        })
        .catch((e) => console.error(e));

    document.body.classList.toggle("open");
}

function goBackBtn() {
    document.body.classList.toggle("open");
    setTimeout(function() {
        outputObj.innerHTML = ""
    }, 750)
}

function scrollToTop() {
    let func = arguments[0];
    let funcArgs = [];
    for (let argN = 0; argN < arguments.length - 1; argN++) {
        funcArgs.push(arguments[argN + 1]);
    }

    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (window.scrollY == 0) {
        func(funcArgs);
    } else {
        setTimeout(function() {
            func(funcArgs);
        }, 750);
    }
}

function imgSettings() {
    var allImgs = document.getElementsByTagName("img");
    for (let i = 0; i < allImgs.length; i++) {
        allImgs[i].addEventListener("click", function() {
            window.open(allImgs[i].src);
        });
        allImgs[i].title = "Відкрити в повноекранному режимі";
    }
}