var personList = [];

// Get Excel file and convert to JSON
fetch('cemetryCoords.xlsx')
    .then(res => res.blob())
    .then(blob => {
        const dataFile = new File([blob], "data_file.xlsx");
        parseExcel(dataFile);
    });

parseExcel = function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        workbook.SheetNames.forEach(function(sheetName) {
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            var jsonObject = JSON.stringify(XL_row_object);
            personList = JSON.parse(jsonObject);
            for (let i = 0; i < personList.length; i++) {
                writePersonToMap(personList[i]);
            }
        })

    };

    reader.onerror = function(ex) {
        console.log(ex);
    };

    reader.readAsBinaryString(file);
};

//Map setup

var map = L.map('map').setView([48.701782, 30.574288], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var graveIcon = L.icon({
    iconUrl: 'img/markerIcon.png',

    iconSize: [25, 25], // size of the icon
    iconAnchor: [0, 12.5], // point of the icon which will correspond to marker's location
});

const searchBar = document.getElementById("searchBarInput");
const searchList = document.getElementById("searchList");

searchBar.addEventListener("focusin", () => {
    searchList.classList.add("open");
    outputSearchList(searchBar.value)
});

document.addEventListener("click", () => {
    if (searchList.matches(":hover") || !searchBar.matches(":focus")) {
        searchList.classList.remove("open")
    }
})

searchBar.addEventListener("input", () => {
    outputSearchList(searchBar.value)
})

function outputSearchList(matchString) {
    let matchedList = [];
    searchList.innerHTML = "";
    for (i in personList) {
        if (personList[i]["ПІБ"].toLowerCase().includes(matchString.toLowerCase())) {
            newListPop = document.createElement("p");
            newListPop.innerHTML = `${personList[i]["ПІБ"]} <span>${personList[i]["Роки життя"]}</span>`;
            searchList.appendChild(newListPop);
            matchedList.push([newListPop, i])
        }
    }

    matchedList.forEach(([element, num]) => {
        element.addEventListener("click", () => {
            writePersonToWindow(personList[num])
        })
    })
}

function writePersonToMap(person) {
    var x = person["Координати"].slice(0, 8);
    var y = person["Координати"].slice(11, person.length);
    var marker = L.marker([x, y], {
        icon: graveIcon
    }).addTo(map).on('click', markerClickCall);
    marker.bindTooltip(`${person["ПІБ"]}`)

    function markerClickCall(e) {
        markerClick(e, person)
    }
}

function markerClick(e, person) {
    writePersonToWindow(person)
}

function writePersonToWindow(person) {
    document.getElementById("personCoords").classList.remove("empty");
    var x = person["Координати"].slice(0, 8);
    var y = person["Координати"].slice(11, 20);
    map.flyTo([x, y], 18)
    document.getElementById("personName").innerHTML = person["ПІБ"];
    document.getElementById("personDates").innerHTML = person["Роки життя"];
    document.getElementById("personCemetryName").innerHTML = "<div><span>Цвинтар: </span>" + `${person["Назва цвинтаря"]}</div>`;
    document.getElementById("personText").innerHTML = "<div><span>Примітка: </span>" + `${person["Примітка"]}</div>`;
    document.getElementById("personCoords").innerHTML = "Координати: " + `<span>${person["Координати"]}</span>`;
}

const openPersonWindowBtn = document.querySelector("#personOpenBtn");

openPersonWindowBtn.addEventListener("click", () => {
    document.querySelector("#personWindow").classList.toggle("open")
})