/*
    Tier Away is a website that helps users create unique tier lists. No accounts, no hassle.
    Copyright (C) 2024 Cassian Godsted
*/
// declare global variables
// export logic - arrays and upload counter
let zipArray = [];
let textArray = [];
let uploadID = 0;
// image option position logic
let dist = -60;
let setHeight = document.body.offsetHeight
let setWidth = document.body.offsetWidth
// drag logic
let posX;
let posY;
let tempID;
// element that opened menu identifier
let elementConfigure;


// declare settings global variables
let enableURL = localStorage.enableURL
enableURL = "true"
let enableAnimations = localStorage.enableAnimations
if (localStorage.enableAnimations != "false") {
    enableAnimations = "true";
}
let enableKeybinds = localStorage.enableKeybinds
if (localStorage.enableKeybinds != "false") {
    enableKeybinds = "true";
}
let enableElementSettings = localStorage.enableElementSettings
if (localStorage.enableElementSettings != "true") {
    enableElementSettings = "false";
}


// begin luke's fancy tier list class
class TierList {
    constructor() {
        this.tiers = [];
        this.counter = 0;
        this.images = []
        this.imageOptions = ""
    }
    // creates a new tier
    addTier(tier) {
        tier.id = this.counter;
        this.counter++;
        this.tiers.push(tier);
        document.querySelector("tbody").innerHTML += tier.render();
        addListeners();
        closeMenu("plus");
        // update sticky footer on taller viewport from additional tier
        setHeight = document.body.offsetHeight;
        setWidth = document.body.offsetWidth;
        dist = 60;
    }
    // re-renders the tier list when tier order changes
    render() {
        document.querySelector("tbody").innerHTML = ""
        let i = 0
        tierList.tiers.forEach(function (tier) {
            tier.id = i
            document.querySelector("tbody").innerHTML += tierList.tiers[i].render()
            i++;
        })
    }
    removeTierByID(tierID) {
        let q;
        for (q = 0; q < this.tiers.length; q++) {
            if (this.tiers[q].id == tierID) {
                break;
            }
        }
        document.getElementById(tierID).remove();
        this.tiers.splice(q, 1);
        // update sticky footer on shorter viewport from removed tier
        setHeight = document.body.offsetHeight;
        setWidth = document.body.offsetWidth;
        dist = 60;
        this.counter = this.counter - 1;
        clearGhosts()
    }
    addImage(imageID) {
        // this.images.push(document.getElementById(imageID).outerHTML)
    }
    addImageFromData(image) {
        // this.images.push(image)
    }
    removeImage(imageID) {
        // let i = 0;
        // this.images.forEach(element => {
        //     if (element.includes(imageID)) {
        //         console.log(i)
        //     }
        //     i++
        // });
    }
    setImageOptions(imageOptions) {
        this.imageOptions = imageOptions
    }
}


// begin luke's fancy tier class
class Tier {
    constructor(color, suffix, content) {
        if (content == undefined) {
            content = ""
        }
        this.id = null;
        this.color = color;
        this.suffix = suffix;
        this.content = content;
    }
    render() {
        return `<tr id="${this.id}">
        <th onfocusout="renameTier(${this.id})" contenteditable style="background-color: ${this.color};" class="tier${this.suffix} tierheader">${this.suffix}</td>
        <td id="content-${this.id}" class="tiers">${this.content}</td>
        <td data-html2canvas-ignore class="tiersettings">
            <div>
            <div id="tier-move">
                <button title="Click here to move this tier up." class="fa fa-chevron-up fa-2x" onclick="moveTierUp(${this.id})"></button>
                <button title="Click here to delete this tier." class="del-tier fa fa-times fa-2x" onclick="tierList.removeTierByID(${this.id})">
            </button>
                <button title="Click here to move this tier down." class="fa fa-chevron-down fa-2x" onclick="moveTierDown(${this.id})"></button>
            </div>
            </div>
        </td></tr>`;
    }
}

let tierList = new TierList();

// the default tiers, s-f
tierList.addTier(new Tier("#e53e3e", "S"));
tierList.addTier(new Tier("#e8532a", "A"));
tierList.addTier(new Tier("#cba000", "B"));
tierList.addTier(new Tier("#86d300", "C"));
tierList.addTier(new Tier("#32bc53", "D"));
tierList.addTier(new Tier("#009376", "F"));
// add new tier
function addTier() {
    tierName = document.getElementById("add-tier").value;
    tierColour = document.getElementById("add-tier-colour").value;
    // Modify rendered HTML
    tierList.addTier(new Tier(tierColour, tierName));
}
// read image from file upload

// The images created exist initially as elements local to the DOM
// They could be re-represented once dragged into a tier
// UNTIL THEN update the DOM API for tiers with a string "children"
async function uploadImage(imageToRead) {
    resetUploadImagesInfo()
    closeMenu("plus");
    // check if it was triggered by the file upload
    if (imageToRead == "file") {
        let fileLength = document.getElementById(`fileselect`).files.length;
        for (let f = 0; f < fileLength; f++) {
            // add the image to the exportable zip
            zipArray.push({ "id": uploadID, "file": document.getElementById(`fileselect`).files[f] })
            textArray.push({ "id": uploadID, "content": "" })
            // create a blob link for the image
            imageToRead = URL.createObjectURL(document.getElementById(`fileselect`).files[f]);
            imageToRead = await convertImage(imageToRead)
            // turn the image into a draggable div
            document.querySelector("#image-options").innerHTML += `
            <div id='img-${uploadID}' draggable='true' class='potential-drag' style='background-image: url(${imageToRead});' ></div>`;
            tierList.addImage("img-" + uploadID)
            uploadID += 1;
        }
    }
    // check if its a url that needs to be parsed
    else if (imageToRead == "url") {
        imageToRead = document.getElementById('urlselect').value
        imageToRead = await convertImage(imageToRead)
        // turn the image into a draggable div
        document.querySelector("#image-options").innerHTML += `
        <div id='img-${uploadID}' draggable='true' class='potential-drag' style='background-image: url(${imageToRead});' ></div>`;
        tierList.addImage("img-" + uploadID)
        uploadID += 1;
    }
    // /triggered by copy paste 
    else {
        // add the image to the exportable zip
        zipArray.push({ "id": uploadID, "file": imageToRead })
        textArray.push({ "id": uploadID, "content": "" })
        // create a blob link for the image
        imageToRead = URL.createObjectURL(imageToRead);
        // convert to data URI
        imageToRead = await convertImage(imageToRead)
        // turn the image into a draggable div
        document.querySelector("#image-options").innerHTML += `
        <div id='img-${uploadID}' draggable='true' class='potential-drag' style='background-image: url(${imageToRead});' ></div>`;
        tierList.addImage("img-" + uploadID)
        uploadID += 1;

    }
    addListeners()
}

async function convertImage(imageToRead) {
    let blob = await fetch(imageToRead).then(r => r.blob());
    let dataUrl = await new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    }
    );
    return dataUrl

};

// clipboard image upload
document.onpaste = function (event) {
    // read all items from clipboard
    let items = event.clipboardData.items;
    // check items for image data
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") == 0) {
            // upload the image into menu function
            uploadImage(items[i].getAsFile())
        }
    }
}

// creates a draggable text element
function addText() {
    if (document.getElementById("upload-images-info").style.display != "none") {
        document.getElementById("upload-images-info").style.display = "none"
    }
    let text = document.getElementById("text-select").value
    document.querySelector("#image-options").innerHTML += `
        <div onclick="openMenu('element', this)" id="img-${uploadID}" draggable="true" class="potential-drag">
            <p class="drag-text">${text}</p>
        </div>`;
    textArray.push({ "id": uploadID, "content": text })
    uploadID += 1;
    addListeners()
    if (document.getElementById("keep-alive-text").checked == false) {
        closeMenu("plus")
    }
}

// adds the necessary event listeners for the Drag
function addListeners() {
    // find all draggable elements
    let items = document.querySelectorAll('.potential-drag');
    items.forEach(function (item) {
        item.addEventListener('dragstart', startDrag);
        item.addEventListener('dragend', endDrag);
        item.addEventListener('touchstart', startDrag);
        item.addEventListener('touchend', endTouch);
    });
}

// starts the drag process by setting an id on the element being dragged
function startDrag() {
    tempID = this.id;
    this.id = 'dragged';
    closeMenu("element")
}

// ends drag - drag and drop api
function endDrag(e) {
    // find the mouse
    posX = e.clientX;
    posY = e.clientY;
    moveElement()
}

// ends drag - touch api
function endTouch(e) {
    // find the touch
    posX = e.changedTouches[0].clientX
    posY = e.changedTouches[0].clientY
    moveElement()
}

// ends the drag process, deletes the old element, and creates a new one
function moveElement() {
    // check what the mouse is hovering over
    let position = document.elementsFromPoint(posX, posY)
    let draggedSuccess = 0
    position.forEach(function (element) {
        if (element.className == "potential-drag") {
            // If its a TD, we know it has a TR above it
            // copy a representation of the element
            let content = document.getElementById("dragged").outerHTML
            // remove the old id
            content = content.slice(content.search("draggable"))
            // add the new id
            content = `<div onclick="openMenu('element', this)" id=${tempID} ${content}`
            // add it to the array
            element.outerHTML += content
            draggedSuccess = 1
            // update the tier list array
            tierList.tiers.forEach(function (tier) {
                id = tier.id
                tier.content = document.getElementById(`content-${id}`).innerHTML
            })
            // remove the successfully dragged element
            document.getElementById("dragged").remove();
        }
        else if (element.tagName == "TD" && element.className != "tiersettings" && draggedSuccess == 0) { // find a part of the table to insert
            // If its a TD, we know it has a TR above it
            // copy a representation of the element
            let content = document.getElementById("dragged").outerHTML
            // remove the old id
            content = content.slice(content.search("draggable"))
            // add the new id
            content = `<div onclick="openMenu('element', this)" id=${tempID} ${content}`
            // add it to the array
            element.innerHTML += content
            tierList.tiers.forEach(function (tier) {
                id = tier.id
                tier.content = document.getElementById(`content-${id}`).innerHTML
            })
            // remove the successfully dragged element
            document.getElementById("dragged").remove();

        } else if (element.id == "trash") {
            // find element id to be removed
            let trashID = tempID.split("-")[1];
            let i = 0;
            zipArray.forEach(function (element) {
                // match up element id with array id
                if (element.id == trashID) {
                    zipArray.splice(i, 1)
                }
                i++
            })
            document.getElementById("dragged").remove();
        }
    });
    // if an element is dragged to the wrong place it may stay dragged/transculent
    if (document.getElementById('dragged')) {
        document.getElementById("dragged").id = tempID;
    }
    // moved elements lose their event listeners after being dragged
    addListeners();
    // remove image from bottom menu
    tierList.removeImage(tempID)
}

function deleteEverything() {
    zipArray = []
    textArray = []
    let items = document.querySelectorAll('.potential-drag');
    items.forEach(function (item) {
        item.remove()
    });
    resetTierList()
}

function addSelection(select) {
    if (select == "upload") {
        // Add Image from Upload
        document.getElementById("plus").innerHTML =
            `<h2 class="title-header menu-header">
            <i class="fa fa-file-image-o" aria-hidden="true"></i> Add Image from File Upload
        </h2>
        <div id="addimagediv">
            <input multiple onchange="uploadImage('file')" type="file" accept="image/*" id="fileselect" class="input-upload">
        </div>`;
        // Add Image from URL
    } else if (select == "url") {
        document.getElementById("plus").innerHTML =
            `<h2 class="title-header menu-header">Add Image from URL</h2>
        <div id="addurldiv">
            <div id="url-upload"><input type="url" placeholder="http:// example.com/" id="urlselect" class="main-text button-border text-input">
            <button onclick="uploadImage('url')" class="button" id="addtierbutton">Add Image</button></div>
        </div>`;
        // Add Image from Clipboard
    } else if (select == "clip") {
        document.getElementById("plus").innerHTML =
            `<h2 class="title-header menu-header">
            <i class="fa fa-clipboard" aria-hidden="true"></i>
             Add Image from Clipboard
        </h2>
        <div id="addurldiv">
            <p>Paste (ctrl-v/cmd-v) to upload image.</p>
            </div>`;
        // Add Text to Tier List
    } else if (select == "text") {
        document.getElementById("plus").innerHTML =
            `<h2 class="title-header menu-header">
                <i class="fa fa-file-text" aria-hidden="true"></i>
                 Add Text to Tier List
            </h2>
            <div id="addtextdiv">
            
            <div id="text-add">
                <input onfocusin="setFocus(1)" onfocusout="setFocus(0)" type="text" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." class="main-text button-border text-input" id="text-select">
                <button onclick="addText()" class="button" id="add-text-button">Add Text</button>
                
                
            </div>
            <label><input type="checkbox" id="keep-alive-text">Keep Alive (use for multiple text elements)</label>
        </div>`;
        // Add New Tier
    } else if (select == "newtier") {
        document.getElementById("plus").innerHTML =
            `<h2 class="title-header menu-header">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Add New Tier
        </h2>
        <div id="addtierdiv">
            <div id="add-tier-content">
                <input onfocusin="setFocus(1)" onfocusout="setFocus(0)" type="text" class="button-border main-text text-input" placeholder="S Tier" id="add-tier">
                <input type="color" value="#780063" class="button-border" id="add-tier-colour">
                <button onclick="addTier()" class="button" id="add-tier-button">Add Tier</button>
            </div>
        </div>`;
    }
    else if (select = "import") {
        document.getElementById("plus").innerHTML =
            `<h2 class="title-header menu-header">
            <i class="fa fa-upload" aria-hidden="true"></i>
            Import Tier List Template
        </h2>
        <div id="addimagediv">
            <input onchange="importTiers()" type="file" accept=".json" id="import-fileselect" class="input-upload">
        </div>`;
    } else {
        document.getElementById.innerHTML = select;
    }

}

// opens the specified menu
function openMenu(menu, element) {
    // temporary disabling of the element settings - they're a wip
    if ((menu == "element") && enableElementSettings == "false") {
    }
    else {
        document.getElementById(menu).className = "visible-drop";
    }

    if (enableAnimations == "true") {
        document.getElementById(menu).style.opacity = 0;
        let opacity = parseFloat(document.getElementById(menu).style.opacity)
        setInterval(function () {
            if (opacity <= 1) {
                opacity += 1
                document.getElementById(menu).style.opacity = opacity
            }
        }, 15)
    }
    else {
        document.getElementById(menu).style.opacity = 1;
    }

    if (menu == "plus") {
        document.getElementById("plus").innerHTML = `
        <h2 class="title-header">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Add to Tier List
        </h2>
        <div id="button-panel">
            <button title="Click here to upload one or more images onto the Tier List." class="menu-button button" onclick="addSelection('upload')">
                <i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i>
                <p>Add Image from Upload</p>
            </button>
            <button title="Click here (or press paste) to paste an image from your clipboard into the Tier List." class="menu-button button" onclick="addSelection('clip')">
                <i class="fa fa-clipboard fa-2x" aria-hidden="true"></i>
                <p>Add Image from Clipboard</p>
            </button>
            <button title="Click here to add a draggable text element to the Tier List." class="menu-button button" onclick="addSelection('text')">
                <i class="fa fa-file-text fa-2x" aria-hidden="true"></i>
                <p>Add Text to Tier List</p>
            </button>
            <button title="Add another Tier to the Tier List" class="menu-button button" onclick="addSelection('newtier')">
                <i class="fa fa-plus fa-2x" aria-hidden="true"></i>
                <p>Add New Tier</p>
            </button>
            <button title="Import a previously exported template from Tier Away." class="menu-button button" onclick="addSelection('import')">
                <i class="fa fa-upload fa-2x" aria-hidden="true"></i>
                <p>Import Tier List Template</p>
            </button>
        </div`;
        if (enableURL == "true") {
            document.getElementById("button-panel").innerHTML +=
                `<button class="menu-button button" onclick="addSelection('url')">
                <i class="fa fa-external-link fa-2x" aria-hidden="true"></i>
                <p>Add Image from URL (legacy)</p>
            </button>`
        }
        closeMenu("export")
        closeMenu("element")
    }
    else if (menu == "export") {
        let url;
        document.getElementById("export").innerHTML = `
                <h2 class="title-header">
                    <i class="fa fa-share-alt" aria-hidden="true"></i>
                    Download and Share Tier List
                </h2>
                <div id="export-image"></div>
                <div id="export-buttons">
                    <a title="Click here to download your Tier List as an image to share." class="button" id="download-as-image">
                        <i class="fa fa-download" aria-hidden="true"></i>
                        Download/Share Image
                    </a>
                    <button title="Click here to download a JSON template to let others try your list." class="button" onclick="exportTiers()">
                        <i class="fa fa-download" aria-hidden="true"></i>
                        Export Template
                    </button>
                </div>`
        html2canvas(document.querySelector("#tierlist"), {
            scale: 2
        }).then(canvas => {
            canvas.toBlob(function (blob) {
                url = URL.createObjectURL(blob)
                document.getElementById("download-as-image").href = url;
                document.getElementById("download-as-image").download = `${document.getElementById("list-header").innerText}.png`;
                document.getElementById("export-image").innerHTML = `<img title="This is your Tier List, as an image!" src=${url}></img>`
            })

        });
        closeMenu("plus")
        closeMenu("element")
    }
    else if (menu == "element") {
        // copy a representation of the element
        let content = element.outerHTML;
        elementConfigure = element;
        // remove the old id
        content = content.slice(content.search("style"));
        // add the new id
        content = `<div class="preview" ${content}`;
        if (document.querySelector(`#${elementConfigure.id} p`) != null) {
            document.getElementById("add-text-to-image").value = document.querySelector(`#${elementConfigure.id} p`).innerText
        }
        else {
            document.getElementById("add-text-to-image").value = ""
        }
        document.getElementById("preview").innerHTML = `${content} <div style="display:flex;"><button class="button menu-button" onclick="deleteFromSettings()">Delete Element</button></div>`




    }
    document.querySelector("body").setAttribute("onclick", `checkMenu('${menu}')`);
}

function changeText() {
    document.querySelector(".preview").innerHTML = `<p class="drag-text">${document.getElementById("add-text-to-image").value}</p>`
    elementConfigure.innerHTML = `<p class="drag-text">${document.getElementById("add-text-to-image").value}</p>`
    textArray.forEach(function (element) {
        if (elementConfigure.id.split("-")[1] == element.id) {
            element.content = document.getElementById("add-text-to-image").value
        }
    })

}

function changeTextColour() {
    document.querySelector(`#${elementConfigure.id} p`).style.color = document.getElementById("text-colour-picker").value
    document.querySelector(".preview p").style.color = document.getElementById("text-colour-picker").value
}

function deleteFromSettings() {
    // find element id to be removed
    let trashID = elementConfigure.id.split("-")[1];
    let i = 0;
    zipArray.forEach(function (element) {
        // match up element id with array id
        if (element.id == trashID) {
            zipArray.splice(i, 1)
        }
        i++
    })
    elementConfigure.remove();
    closeMenu("element")
}

// closes the specified menu
function closeMenu(menu) {
    document.querySelector("body").removeAttribute("onclick")
    if (enableAnimations == "true") {
        let opacity = parseFloat(document.getElementById(menu).style.opacity)
        setInterval(function () {
            if (opacity >= -5) {
                opacity -= 1
                document.getElementById(menu).style.opacity = opacity;
                if (opacity <= -5) {
                    document.getElementById(menu).className = "hidden";
                }
            }
        }, 15)
    }
    else {
        document.getElementById(menu).style.opacity = 0;
        document.getElementById(menu).className = "hidden";
    }
}

// checks if the menu should be closed
function checkMenu(menu) {
    // check if user is hovering over the dropdown, or the specified button. closes if not.
    if (menu == "element") {
        if (document.querySelector(`#${menu}.visible-drop:hover`) == null && document.querySelector(`.potential-drag:hover`) == null) {
            closeMenu(menu)
        }

    }
    else if (document.querySelector(`#${menu}.visible-drop:hover`) == null && document.querySelector(`#${menu}-button:hover`) == null) {
        closeMenu(menu)

    }
}

// moves a tier up
function moveTierUp(tier) {
    if (tier != 0) {
        // backup the tier that's being replaced
        let backup = tierList.tiers[tier - 1]
        // move the tier
        tierList.tiers.copyWithin(tier - 1, tier, tier + 1);
        // replace the tier that's been copied by the backup tier
        tierList.tiers[tier] = backup;
        // renders the new list
        tierList.render()
        addListeners()
        clearGhosts()
    }
}
// moves a tier down
function moveTierDown(tier) {
    if (tier != tierList.tiers.length - 1) {
        // backup the tier that's being replaced
        let backup = tierList.tiers[tier + 1]
        // move the tier
        tierList.tiers.copyWithin(tier + 1, tier, tier + 1);
        // replace the tier that's been copied by the backup tier
        tierList.tiers[tier] = backup;
        // renders the new list
        tierList.render()
        addListeners()
        clearGhosts()
    }
}

// renames a tier
function renameTier(tier) {
    // backup the tier that's being replaced
    tierList.tiers[tier].suffix = document.getElementById(`${tier}`).firstElementChild.innerText
    tierList.render()
    addListeners()
    clearGhosts()
}

async function legacyExportTiers() {
    // tier list title
    let tierTitle = document.getElementById("list-header").outerText
    let exportString = `${tierTitle}§`
    // tier list length
    exportString += tierList.tiers.length
    // tier list color code and suffix
    tierList.tiers.forEach(function (tier) {
        exportString += `${tier.color}§${tier.suffix}§`
    })
    // generate table file
    let fileData = new Blob([exportString], { type: 'text/plain' });

    // generate zip with jszip
    zip.file("tiers.txt", fileData)
    // images
    let f = 0;
    zipArray.forEach(function () {
        zip.file(zipArray[f].file.name, zipArray[f].file)
        f++
    })
    f = 0;
    // text elements
    textArray.forEach(function () {
        zip.file(`${textArray[f].id}.txt`, textArray[f].content)
        f++
    })
    // create file
    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, `${tierTitle}.zip`);
        });
}

async function exportTiers() {
    // tier list title
    let tierTitle = document.getElementById("list-header").outerText
    let exportString = JSON.stringify(tierList)
    // generate table file
    let fileData = new Blob([exportString], { type: 'text/plain' });
    // download file
    saveAs(fileData, `${tierTitle}.json`);
}

async function saveTiers() {
    // tier list title
    tierList.setImageOptions(document.getElementById("image-options").innerHTML)
    let exportString = JSON.stringify(tierList)
    localStorage.tierList = exportString
}

async function importTiers(content) {
    let importedFile;
    if (content == undefined) {
        importedFile = document.getElementById("import-fileselect").files[0];

    }
    else {
        importedFile = content
    }
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        // create object to store uploaded tier list
        const newTierList = JSON.parse(event.target.result);
        // reset tier list
        clearTierList()
        // add new tiers to existing tier list
        newTierList.tiers.forEach(function (tier) {
            tierList.addTier(new Tier(tier.color, tier.suffix, tier.content));
        })
        if (newTierList.imageOptions !== "") {
            document.getElementById("image-options").innerHTML = newTierList.imageOptions
        }
    });
    reader.readAsText(importedFile);
    // RENDER
    tierList.render();
    clearGhosts()
    addListeners();
}

async function loadTiers() {
    const newTierList = JSON.parse(localStorage.tierList)
    if ((newTierList != undefined) && (newTierList.counter != 0)) {
        clearTierList()
        // add new tiers to existing tier list
        newTierList.tiers.forEach(function (tier) {
            tierList.addTier(new Tier(tier.color, tier.suffix, tier.content));
        })
        // RENDER
        tierList.render();
        // if (newTierList.images instanceof Array) {
        //     if (newTierList.images.length !== 0) {
        //         resetUploadImagesInfo()
        //         newTierList.images.forEach(element => {
        //             document.getElementById("image-options").innerHTML += element
        //             tierList.addImageFromData(element)
        //         });
        //         uploadID += newTierList.images.length
        //     }
        // }
        if (newTierList.imageOptions.includes("div")) {
            document.getElementById("image-options").innerHTML = newTierList.imageOptions
        }
        clearGhosts()
        addListeners();
    }
}

function resetUploadImagesInfo() {
    if (document.getElementById("upload-images-info").style.display != "none") {
        document.getElementById("upload-images-info").style.display = "none"
        document.getElementById("image-options").innerHTML += `
        <button onclick="deleteEverything()" id="trash">
            <i class="fa fa-trash-o   fa-4x" aria-hidden="true"></i>
        </button>`

    }
}

function clearTierList() {
    tierList.tiers = [];
    tierList.images = [];
    tierList.counter = 0;
    tierList.render()
}

function clearGhosts() {
    if (document.getElementById("dragged")) {
        document.getElementById("dragged").remove();
    }
}

function resetTierList() {
    clearTierList()
    // the default tiers, s-f
    tierList.addTier(new Tier("#e53e3e", "S"));
    tierList.addTier(new Tier("#e8532a", "A"));
    tierList.addTier(new Tier("#cba000", "B"));
    tierList.addTier(new Tier("#86d300", "C"));
    tierList.addTier(new Tier("#32bc53", "D"));
    tierList.addTier(new Tier("#009376", "F"));
}

async function legacyImportTiers() {
    let importedfile = document.getElementById("import-fileselect").files[0];
    zip.loadAsync(importedfile).then(function (zip) {
        // read tiers.txt
        return zip.file("tiers.txt").async("text");
    }).then(function (input) {
        // clear the default tiers
        tierList.tiers = [];
        // find the name
        document.getElementById("list-header").textContent = input.slice(0, input.search("§"))
        // find the number of tiers
        let numberOfTiers = input.slice(input.search("§") + 1, input.search("#"))
        input = input.slice(input.search("#"))
        for (let runningTiers = 0; runningTiers < numberOfTiers; runningTiers++) {
            // Runs however many times is specified in input tiers
            // import tier colour

            let endColour = input.search("§")
            let tierImportColour = input.slice(0, endColour)
            input = input.slice(endColour + 1)
            // import tier suffix
            let endSuffix = input.search("§")
            let tierImportSuffix = input.slice(0, endSuffix)
            input = input.slice(endSuffix + 1)
            // add the tier
            console.log(tierImportColour)
            tierList.addTier(new Tier(tierImportColour, tierImportSuffix));
        }
        // re-render the tier list
        tierList.render()
        // import uploaded images
        zip.forEach(async function (file) {
            if (document.getElementById("upload-images-info").style.display != "none") {
                document.getElementById("upload-images-info").style.display = "none"
            }
            if (document.getElementById("trash") == null) {
                document.getElementById("image-options").innerHTML += `<div id="trash"><i class="fa fa-trash-o fa-4x" aria-hidden="true"></i></div>`
            }
            // handle images
            if (file.search(".txt") == -1) {
                console.log(file)
                let file2 = await zip.file(file).async("blob")
                imageToRead = URL.createObjectURL(file2);
                document.querySelector("#image-options").innerHTML += `
                <div id="img-${uploadID}" draggable="true" class="potential-drag" style="background-image: url(${imageToRead});" ></div>`;
            }
            // handle text
            else if (file.search("tiers") == -1) {

                let file2 = await zip.file(file).async("text");
                file = file.slice(file.search(".txt"))
                document.querySelector("#image-options").innerHTML += `
                <div id="img-${file}" draggable="true" class="potential-drag">${file2}</div>`;
            }

            addListeners()
        })
    });
}

window.onscroll = function () {
    if (setWidth != document.body.offsetWidth) {
        setHeight = document.body.offsetHeight
        setWidth = document.body.offsetWidth
        dist = 60
    }
    if ((window.innerHeight + dist + Math.ceil(window.scrollY)) >= setHeight) {
        document.getElementById("image-options").style.position = "static"
    }
    else {
        document.getElementById("image-options").style.position = "fixed"
    }
}

// keyboard accessible tier list creation
window.onkeydown = function (key) {
    // esc key - close any open menu
    if (key.key == "Escape" && enableKeybinds == "true") {
        closeMenu("plus")
        closeMenu("export")
        closeMenu("settings")
        closeMenu("element")
    }
    if (screenFocus == 0 && enableKeybinds == "true" && !key.ctrlKey & !key.altKey) {
        console.log(key)
        // + key - open plus mini-menu
        if (key.key == "=") {
            openMenu("plus")
        }
        // e key - open export menu
        else if (key.key == "e") {
            openMenu("export")
        }
        // u key - open upload menu
        else if (key.key == "u") {
            openMenu("plus")
            addSelection("upload")
        }
        // t key - open text menu
        else if (key.key == "t") {
            openMenu("plus")
            addSelection("text")
        }
        // i key - open import menu
        else if (key.key == "i") {
            openMenu("plus")
            addSelection("import")
        }
        // h key - focus tier list title
        else if (key.key == "h") {
            document.getElementById("list-header").focus()
        }
        // h key - focus tier list title
        else if (key.key == "g") {
            openMenu("settings")
        }
    }
};
var zip;
// 
window.addEventListener("load", function () {
    zip = new JSZip();
    if (localStorage.theme != undefined) {
        changeSetting(`theme-${localStorage.theme}`)
    }

});

function changeSetting(setting) {
    // deprecated url upload
    if (setting == "url") {
        if (enableURL == "false") {
            enableURL = "true"
            localStorage.enableURL = "true"
            document.getElementById("url-images-toggle").innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Disable URL Images`
        }
        else {
            enableURL = "false"
            localStorage.enableURL = "false"
            document.getElementById("url-images-toggle").innerHTML = `<i class="fa fa-check" aria-hidden="true"></i> Enable URL Images`
        }
    }
    // animation settings
    else if (setting == "animations") {
        if (enableAnimations == "false") {
            enableAnimations = "true"
            localStorage.enableAnimations = "true"
            document.getElementById("animations-toggle").innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Disable Animations`
        }
        else {
            enableAnimations = "false"
            localStorage.enableAnimations = "false"
            document.getElementById("animations-toggle").innerHTML = `<i class="fa fa-check" aria-hidden="true"></i> Enable Animations`
        }
    }
    else if (setting == "keybinds") {
        if (enableKeybinds == "false") {
            enableKeybinds = "true"
            localStorage.enableKeybinds = "true"
            document.getElementById("keybinds-toggle").innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Disable Keybinds`
        }
        else {
            enableKeybinds = "false"
            localStorage.enableKeybinds = "false"
            document.getElementById("keybinds-toggle").innerHTML = `<i class="fa fa-check" aria-hidden="true"></i> Enable Keybinds`
        }
    }
    else if (setting == "elementsettings") {
        if (enableElementSettings == "false") {
            enableElementSettings = "true"
            localStorage.enableElementSettings = "true"
            document.getElementById("elementsettings-toggle").innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Disable Element Settings`
        }
        else {
            enableElementSettings = "false"
            localStorage.enableElementSettings = "false"
            document.getElementById("elementsettings-toggle").innerHTML = `<i class="fa fa-check" aria-hidden="true"></i> Enable Element Settings`
        }
    }
    // toggle dark/light theme
    else if (setting == "theme") {
        // dark to light
        if (document.getElementById("theme-style").className == "dark-mode") {
            document.getElementById("theme-style").remove()
            document.querySelector("head").innerHTML += `<link class="light-mode" id="theme-style" rel="stylesheet" href="css/light.css">`
            document.getElementById("change-theme-button").className = "fa fa-moon-o main-text"
            localStorage.theme = "light"
        }
        // light to dark
        else {
            document.getElementById("theme-style").remove()
            document.querySelector("head").innerHTML += `<link class="dark-mode" id="theme-style" rel="stylesheet" href="css/dark.css">`
            document.getElementById("change-theme-button").className = "fa fa-sun-o main-text"
            localStorage.theme = "dark"
        }
    }
    // change theme directly
    else if (setting.search("theme-") != -1) {
        // find theme
        theme = setting.slice(setting.search("-") + 1)
        // remove old theme
        document.getElementById("theme-style").remove()
        // add new theme
        document.querySelector("head").innerHTML += `<link id="theme-style" rel="stylesheet" href="css/${theme}.css">`
        // untoggle theme button
        document.querySelectorAll(".theme-button i").forEach(function (element) {
            element.className = "fa fa-times"
        })
        // toggle new theme button
        document.getElementById(`${theme}-icon`).className = 'fa fa-check'
        // update dark/light toggle
        if (setting == "theme-dark") {
            document.getElementById("change-theme-button").className = "fa fa-sun-o main-text"
        }
        else if (setting == "theme-light") {
            document.getElementById("change-theme-button").className = "fa fa-moon-o main-text"

        }
        // save theme
        localStorage.theme = theme
    }
}

// match up tier list title with tab title
function screenTitle() {
    document.querySelector('title').innerHTML = `Tier Away - ${document.getElementById("list-header").innerText}`
}
screenTitle()
let screenFocus = 0;
function setFocus(num) {
    screenFocus = num
}
// drag and drop file upload
function dropHandler(event) {
    event.preventDefault()
    let items = event.dataTransfer.items;
    for (let i = 0; i < items.length; i++) {
        // Drag and Drop Image Upload.
        if (items[i].type.indexOf("image") == 0) {
            // upload the image into menu function
            uploadImage(items[i].getAsFile())
        }
        // Drag and Drop Tier List Importing
        else if (items[i].type.indexOf("application/json") == 0) {
            importTiers(items[i].getAsFile())
        }
    }
}
function dropOverHandler(event) {
    event.preventDefault()
}
function quickColour(val) {
    document.getElementById("add-tier-colour").value = val
}
window.addEventListener('beforeunload', function (event) {
    saveTiers()
});

window.onload = loadTiers