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
});