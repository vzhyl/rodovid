const listObj = document.getElementById("resList");
const searchBar = document.getElementById("searchBar");
const searchObj = document.getElementById("search");
const outputObj = document.getElementById("textOutput");
const backBtn = document.getElementById("backBtn");

var fileArray;
fetch("scripts/text_database.json")
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

    for (el in data) {
        if (el.toLowerCase().includes(matchStr.toLowerCase())) {
            var newListElement = document.createElement("div");
            newListElement.classList.add("resObj");

            var fileLink = document.createElement("a");
            fileLink.innerHTML = el;
            fileLink.href = data[el]["Посилання"];

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
}

