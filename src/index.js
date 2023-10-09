class Quiz {
    constructor(name, themes){
        this.name = name;
        this.themes = themes;
    }
}

class Theme {
    constructor (name, questions){
        this.name = name;
        this.questions = questions;
    }
}

class Question {
    constructor(text, cost, answers){
        this.text = text;
        this.cost = cost;
        this.answers = answers;
    }
}

class Answer {
    constructor(text, isItRight){
        this.text = text;
        this.isItRight = isItRight;
    }
}

const getRandomIndex = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

window.addEventListener("load", () => {
    const icons = ["chameleon.svg", "toucan.svg", "sloth.svg"];
    const $icon = document.createElement("link")
    const index = getRandomIndex(0, icons.length)
    $icon.setAttribute("rel", "shortcut icon")
    $icon.setAttribute("href", `icons/${icons[index]}`)
    document.head.appendChild($icon)

    const $data = document.getElementsByTagName("tbody")[0]
    const $save = document.getElementById("save")
    const $load = document.getElementById("load")

    const ans1 = new Answer ("a", true)
    const ans2 = new Answer ("b", false)
    const question = new Question("question?", 100, [ans1, ans2])
    const theme = new Theme ("Name", [question])
    const quiz = new Quiz("nova hra", [theme])

    for (let i = 0; i < quiz.themes.length; i++) {
        const element = quiz.themes[i];
        const $tr = document.createElement("tr")
        const $td = document.createElement("td")
        $td.innerHTML = element.name
        $tr.append($td)

        for (let j = 0; j < element.questions.length; j++) {
            const $td = document.createElement("td")   
            $td.innerHTML=element.questions[j].cost   
            $tr.append($td)
        }

        $data.append($tr)
        
    }


    $load.addEventListener("click", async () => {
        const [fileHandler] = await window.showOpenFilePicker({
            id: "json-data",
            multiple: false,
            startIn: "documents",
            types: [{ description: "JSON documents", accept: { "application/json": ".json" } }],
            excludeAcceptAllOption: false
        })

        const file = await fileHandler.getFile()
        const content = await file.text()
        $data.value = content
    })

    $save.addEventListener("click", async () => {
        const fileHandler = await window.showSaveFilePicker({
            id: "json-data",
            suggestedName: "quiz.json",
            startIn: "documents",
            types: [{ description: "JSON documents", accept: { "application/json": ".json" } }],
            excludeAcceptAllOption: false
        })

        const content = $data.value
        const file = await fileHandler.createWritable()
        await file.write(content)
        await file.close()
    })
});