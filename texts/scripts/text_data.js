const textObj = document.getElementById("textObj");

var textName = document.getElementById("docTitle").textContent;

goToText(`${textName}/${textName}.md`);

function goToText(textLink) {
    fetch(textLink)
        .then((res) => res.text())
        .then((mdText) => {
            var converter = new showdown.Converter(),
                text = mdText,
                html = converter.makeHtml(text);
            textObj.innerHTML = html;

            imgSettings();
            tableSettings();
        })
        .catch((e) => console.error(e));
}

function imgSettings() {
    let allImgs = document.getElementsByTagName("img");
    for (let i = 0; i < allImgs.length; i++) {
        allImgs[i].addEventListener("click", function() {
            window.open(allImgs[i].src);
        });
        allImgs[i].title = "Відкрити в повноекранному режимі";
    }
}

function tableSettings() {
    let allTables = document.getElementsByClassName("divTable");
    for (let i = 0; i < allTables.length; i++) {
        let rows = allTables[i].getElementsByClassName("row");
        
        for (let j = 0; j < rows.length; j++) {
            let cells = rows[j].getElementsByClassName("cell")

            for (let k = 0; k < cells.length; k++) {
                let cell = cells[k];

                if (cell.innerHTML.startsWith("http")) {
                    let cellLink = cell.innerHTML;
                    cell.innerHTML = `<a href="${cellLink}">Перейти</a>`
                }
            }
        }
    }

    if (window.matchMedia("(max-width: 450px)").matches) {
        for (let i = 0; i < allTables.length; i++) {
            allTables[i].innerHTML = `<i style="text-align:center; color: #a50000">На жаль, на Вашому пристрої таблиці не відображаються</i>`
        }
    }
}