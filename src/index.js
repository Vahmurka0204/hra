class Quiz {
    constructor(name, themes) {
        this.name = name;
        this.themes = themes;
    }
}

class Theme {
    constructor(name, questions) {
        this.name = name;
        this.questions = questions;
    }
}

class Question {
    constructor(text, cost, answers) {
        this.text = text;
        this.cost = cost;
        this.answers = answers;
    }
}

class Answer {
    constructor(text, isItRight) {
        this.text = text;
        this.isItRight = isItRight;
    }
}

const getRandomIndex = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

window.addEventListener("load", () => {
    const icons = ["chameleon.svg", "toucan.svg", "sloth.svg"];
    const $icon = document.createElement("link");
    const index = getRandomIndex(0, icons.length);
    $icon.setAttribute("rel", "shortcut icon");
    $icon.setAttribute("href", `icons/${icons[index]}`);
    document.head.appendChild($icon);

    const $tableBody = document.getElementsByTagName("tbody")[0];
    const $save = document.getElementById("save");
    const $load = document.getElementById("load");
    const $new = document.getElementById("new");
    const $modal = document.getElementById("modal");

    function DrawTable(quiz) {
        $tableBody.innerHTML = "";
        for (let i = 0; i < quiz.themes.length; i++) {
            const theme = quiz.themes[i];
            const $tr = document.createElement("tr");
            const $td = document.createElement("td");
            $td.innerHTML = theme.name;
            $td.addEventListener("click", () => {
                const newName = prompt("Nazev temy:");
                if (newName.length > 0) {
                    theme.name = newName;
                    $td.innerHTML = newName;
                    localStorage.setItem("quiz", JSON.stringify(quiz));
                }
            });
            $tr.append($td);

            for (let j = 0; j < theme.questions.length; j++) {
                const $td = document.createElement("td");
                $td.className = "question";
                $td.innerHTML = theme.questions[j].cost;
                $td.addEventListener("click", () => {
                    document.getElementById("theme-cost").innerText = `${theme.name}:${theme.questions[j].cost}`;
                    const question = document.getElementById("question");
                    question.value = theme.questions[j].text;
                    question.addEventListener("change", (e) => {
                        theme.questions[j].text = e.target.value;
                        localStorage.setItem("quiz", JSON.stringify(quiz));
                    });

                    theme.questions[j].answers.forEach((answer, index) => {
                        const $input = document.getElementById(`answer-${index}`);
                        $input.value = answer.text;
                        $input.addEventListener("change", (e) => {
                            answer.text = e.target.value;
                            localStorage.setItem("quiz", JSON.stringify(quiz));
                        });

                        const $radio = document.getElementById(`rb${index}`);
                        $radio.checked = answer.isItRight;
                        $radio.addEventListener("change", () => {
                            theme.questions[j].answers.forEach((ans) => {
                                ans.isItRight = false;
                            });
                            answer.isItRight = true;
                            localStorage.setItem("quiz", JSON.stringify(quiz));
                        });
                    });

                    $modal.classList.add("open");
                    const exits = $modal.querySelectorAll(".modal-exit");
                    exits.forEach(function (exit) {
                        exit.addEventListener("click", function (event) {
                            event.preventDefault();
                            $modal.classList.remove("open");
                        });
                    });
                });
                $tr.append($td);
            }

            $tableBody.append($tr);
        }
    }

    const storedQuiz = localStorage.getItem("quiz");

    if (storedQuiz) {
        DrawTable(JSON.parse(storedQuiz));
    }

    $load.addEventListener("click", async () => {
        const [fileHandler] = await window.showOpenFilePicker({
            id: "json-data",
            multiple: false,
            startIn: "documents",
            types: [{ description: "JSON documents", accept: { "application/json": ".json" } }],
            excludeAcceptAllOption: false
        });

        const file = await fileHandler.getFile();
        const content = await file.text();
        localStorage.setItem("quiz", content);
        DrawTable(JSON.parse(content));
    });

    $save.addEventListener("click", async () => {
        const fileHandler = await window.showSaveFilePicker({
            id: "json-data",
            suggestedName: "kviz.json",
            startIn: "documents",
            types: [{ description: "JSON documents", accept: { "application/json": ".json" } }],
            excludeAcceptAllOption: false
        });

        const content = localStorage.getItem("quiz");
        const file = await fileHandler.createWritable();
        await file.write(content);
        await file.close();
    });

    $new.addEventListener("click", () => {
        const quizName = prompt("Nazev kviza:");
        const numberThemes = parseInt(prompt("Kolik bude témat?"));
        const numberQuestions = parseInt(prompt("Kolik bude otázek v každém tématu?"));

        let quiz = new Quiz(quizName, Array(numberThemes));

        for (let i = 0; i < numberThemes; i++) {
            let qcost = 100;
            const name = "Téma" + (i + 1);

            let theme = new Theme(name, Array(numberQuestions));

            for (let j = 0; j < numberQuestions; j++) {
                let question = new Question("Text otázky", qcost, Array(4));
                qcost += 100;

                for (let k = 0; k < 4; k++) {
                    let answer = new Answer("Varianta " + (k + 1), false);
                    question.answers[k] = answer;
                }

                theme.questions[j] = question;

            }
            quiz.themes[i] = theme;
        }

        localStorage.setItem("quiz", JSON.stringify(quiz));

        DrawTable(quiz);
    });
});