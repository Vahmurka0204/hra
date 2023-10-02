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

    const $data = document.getElementById("data")
    const $save = document.getElementById("save")
    const $load = document.getElementById("load")

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