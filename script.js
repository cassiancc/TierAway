/*
    Tier Away is a website that helps users create unique tier lists. No accounts, no hassle.
    Copyright (C) 2022 Con Godsted
*/
//declare global variables
let linkArray = [];
let uploadID = 0;
let tempID;

//begin luke's fancy tier list class
class TierList{
    constructor(){
        this.tiers = [];
        this.counter = 0;
    }
    //creates a new tier
    addTier(tier){
        tier.id = this.counter;
        this.counter++;
        this.tiers.push(tier);
        document.querySelector("tbody").innerHTML += tier.render();
        addListeners()
        closePlus()
    }
    //RE-RENDERS THE ENTIRE TIER LIST. this is not good code but it works for now.
    render() {
        document.querySelector("tbody").innerHTML = ""
        let i = 0
        tierList.tiers.forEach(function(tier) {
            tier.id = i
            document.querySelector("tbody").innerHTML += `
            <tr id="${tier.id}">
            <th contenteditable style="background-color: ${tier.color};" class="tier${tier.suffix} tierheader">${tier.suffix.toUpperCase()}</td>
            <td id="content-${tier.id}" class="tiers">${tier.content}</td>
            <td class="tiersettings">
                <div>
                <div id="tier-move">
                    <button class="fa fa-chevron-up fa-2x" onclick="moveTierUp(${tier.id})"></button>
                    <button class="del-tier fa fa-times fa-2x" onclick="tierList.removeTierByID(${tier.id})">
                </button>
                    <button class="fa fa-chevron-down fa-2x" onclick="moveTierDown(${tier.id})"></button>
                </div>
                </div>
            </td></tr>`;
            i++;
        })
    }
    removeTierByID(tierID){
        let q;
        for(q = 0;q<this.tiers.length;q++){
            if(this.tiers[q].id == tierID){
                break;
            }
        }
        document.getElementById(tierID).remove();
        this.tiers.splice(q,1);
    }
}

//begin luke's fancy tier class
class Tier{
    constructor(color,suffix){
        this.id = null;
        this.color = color;
        this.suffix = suffix;
        this.content = "";
    }
    render(){
        return `<tr id="${this.id}">
        <th contenteditable style="background-color: ${this.color};" class="tier${this.suffix} tierheader">${this.suffix.toUpperCase()}</td>
        <td id="content-${this.id}" class="tiers">${this.content}</td>
        <td class="tiersettings">
            <div>
            <div id="tier-move">
                <button class="fa fa-chevron-up fa-2x" onclick="moveTierUp(${this.id})"></button>
                <button class="del-tier fa fa-times fa-2x" onclick="tierList.removeTierByID(${this.id})">
            </button>
                <button class="fa fa-chevron-down fa-2x" onclick="moveTierDown(${this.id})"></button>
            </div>
            </div>
        </td></tr>`;
    }
}

let tierList = new TierList();

//the default tiers, s-f
tierList.addTier(new Tier("#e53e3e","s"));
tierList.addTier(new Tier("#e8532a","a"));
tierList.addTier(new Tier("#cba000","b"));
tierList.addTier(new Tier("#86d300","c"));
tierList.addTier(new Tier("#32bc53","d"));
tierList.addTier(new Tier("#009376","f"));
//add new tier
function addTier() {
    tierName = document.getElementById("add-tier").value;
    tierColour = document.getElementById("add-tier-colour").value;
    //Modify rendered HTML
    tierList.addTier(new Tier(tierColour,tierName));
}
//read image from file upload

//The images created exist initially as elements local to the DOM
//They could be re-represented once dragged into a tier
//UNTIL THEN update the DOM API for tiers with a string "children"
function imageRead(imageToRead) {
    if (document.getElementById("upload-images-info").style.display != "none") {
        document.getElementById("upload-images-info").style.display = "none"   
    }
    if (document.getElementById("trash") == null) {
        document.getElementById("image-options").innerHTML += `<div id="trash"><i class="fa fa-trash-o   fa-4x" aria-hidden="true"></i></div>`
    }
    closePlus();
    //check if it was triggered by the file upload
    if (imageToRead == "file") {
        let fileLength = document.getElementById(`fileselect`).files.length;
        for (let f = 0;f < fileLength;f++) {
            //add the image to the exportable zip
            zip.file(document.getElementById(`fileselect`).files[f].name ,document.getElementById(`fileselect`).files[f])
            //create a blob link for the image
            imageToRead = URL.createObjectURL(document.getElementById(`fileselect`).files[f]);
            //turn the image into a draggable div
            document.querySelector("#image-options").innerHTML += `
            <div id="img-${uploadID}" draggable="true" class="potential-drag" style="background-image: url(${imageToRead});" ></div>`;
            uploadID += 1;
        }
    //if not it's a url to be parsed and added to image options
    } else if (imageToRead != "") {
            //the image already has a link so add it to the list of images -- for later exporting
            linkArray.push(imageToRead);
            //turn the image into a draggable div
            document.querySelector("#image-options").innerHTML += `
            <div id="img-${uploadID}" draggable="true" class="potential-drag" style="background-image: url(${imageToRead});" ></div>`;
            uploadID += 1;
        }
    addListeners()
}

//creates a draggable text element
function addText() {
    if (document.getElementById("upload-images-info").style.display != "none") {
        document.getElementById("upload-images-info").style.display = "none"   
    }
    let text = document.getElementById("text-select").value
    document.querySelector("#image-options").innerHTML += `
            <div id="img-${uploadID}" draggable="true" class="potential-drag" >${text}</div>`;
    
    addListeners()
    if (document.getElementById("keep-alive-text").checked == false) {
        closePlus()
    }
    
    
}
//adds the necessary event listeners for the Drag
function addListeners() {
    //find all draggable elements
    let items = document.querySelectorAll('.potential-drag');
    items.forEach(function(item) {
        item.addEventListener('dragstart', startDrag);
        item.addEventListener('dragend', endDrag);
        item.addEventListener('touchstart', startDrag);
        item.addEventListener('touchend', endTouch);
    });
}
//starts the drag process by setting an id on the element being dragged
function startDrag() {
    tempID = this.id;
    this.id = 'dragged';
}
//ends the drag process, deletes the old element, and creates a new one
function endDrag(e) {
    //find the mouse
    posX = e.clientX;
    posY = e.clientY;
    //check what the mouse is hovering over
    let position = document.elementsFromPoint(posX, posY)
    position.forEach(function(element) {
        if (element.tagName == "TD" && element.className != "tiersettings") { //find a part of the table to insert
            //If its a TD, we know it has a TR above it
            //if the element has text, copy it
            let content = document.getElementById("dragged").innerHTML
            //if the element has a background image, copy it
            let tempImage = document.getElementById("dragged").style.backgroundImage
            //trim the blob() off
            tempImage = tempImage.slice(5, -2)
            let template = `<div id="${tempID}" draggable="true" class="potential-drag" style="background-image: url(${tempImage});" >${content}</div>`;
            //add the element to the table!
            element.innerHTML += template;
            //remove the successfully dragged element
            document.getElementById("dragged").remove();

        } else if (element.id == "trash") {
            document.getElementById("dragged").remove();    
        }
    });
    //if an element is dragged to the wrong place it may stay dragged/transculent
    if (document.getElementById('dragged')) {
        document.getElementById("dragged").id = tempID;
    }
    //moved elements lose their event listeners after being dragged
    addListeners()


}

function addSelection(select) {
    if (select == "upload") {
        //Add Image from Upload
        document.getElementById("plus").innerHTML =
        `<div id="addimagediv">
            <label class="menu-header">Add Image from File Upload</label>
            <input multiple onchange="imageRead('file')" type="file" accept="image/*" id="fileselect" class="input-upload">
        </div>`;
        //Add Image from URL
    } else if (select == "url") {
        document.getElementById("plus").innerHTML =
        `<div id="addurldiv">
            <label class="menu-header">Add Image from URL</label>
            <div id="url-upload"><input type="url" placeholder="http://example.com/" id="urlselect" class="main-text button-border">
            <button onclick="imageRead(document.getElementById('urlselect').value)" class="button" id="addtierbutton">Add Image</button></div>
        </div>`;
        //Add Text to Tier List
    } else if (select == "text") {
        document.getElementById("plus").innerHTML =
        `<div id="addtextdiv">
            <p>Add Text to Tier List</p>
            <div id="text-add">
                <input type="text" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." class="main-text button-border" id="text-select">
                <button onclick="addText()" class="button" id="add-text-button">Add Text</button>
                
                
            </div>
            <label><input type="checkbox" id="keep-alive-text">Keep Alive (use for multiple text elements)</label>
        </div>`;
        //Add New Tier
    } else if (select == "newtier") {
        document.getElementById("plus").innerHTML =
        `<div id="addtierdiv">
            <label class="menu-header">Add New Tier</label>
            <div id="add-tier-content">
                <input type="text" class="button-border main-text" placeholder="S Tier" id="add-tier">
                <input type="color" value="#780063" class="button-border" id="add-tier-colour">
                <button onclick="addTier()" class="button" id="add-tier-button">Add Tier</button>
            </div>
        </div>`;
    }
    else if (select = "import") {
        document.getElementById("plus").innerHTML =
        `<div id="addimagediv">
            <label class="menu-header">Import Tier List Template</label>
            <input onchange="importTiers()" type="file" accept=".zip" id="import-fileselect" class="input-upload">
        </div>`;
    } else {
        document.getElementById.innerHTML = select;
    }

}

//opens the plus menu
function openPlus() {
    document.getElementById("plus").className = "visible-drop";
    document.getElementById("plus").style.opacity = 1;
    document.getElementById("plus").innerHTML = `
    <div id="button-panel">
        <button class="menu-button button" onclick="addSelection('upload')">
            <i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i>
            <p>Add Image from Upload</p>
        </button>
        <button class="menu-button button" onclick="addSelection('url')">
            <i class="fa fa-external-link fa-2x" aria-hidden="true"></i>
            <p>Add Image from URL</p>
        </button>
        <button class="menu-button button" onclick="addSelection('text')">
            <i class="fa fa-file-text fa-2x" aria-hidden="true"></i>
            <p>Add Text to Tier List</p>
        </button>
        <button class="menu-button button" onclick="addSelection('newtier')">
            <i class="fa fa-plus fa-2x" aria-hidden="true"></i>
            <p>Add New Tier</p>
        </button>
        <button class="menu-button button" onclick="addSelection('import')">
            <i class="fa fa-upload fa-2x" aria-hidden="true"></i>
            <p>Import Tier List Template</p>
        </button>
    </div`;
    document.querySelector("body").addEventListener('click', checkPlus);
}
//closes the plus menu
function closePlus() {
    //hides away the plus menu. animations are a little busted but uh. woops.
    document.getElementById("plus").style.opacity = 0;
    document.getElementById("plus").className = "hidden";

}
//checks if the menu should be closed
function checkPlus() {
    //check if user is hovering over the dropdown, or the plus button. closes if not.
    if (document.querySelector("#plus.visible-drop:hover") == null && document.querySelector("#new:hover") == null) {
        closePlus()
    }
    

}
//moves a tier up
function moveTierUp(tier) {
    if (tier != 0) {
        //backup the tier that's being replaced
        let backup = tierList.tiers[tier-1]
        //move the tier
        tierList.tiers.copyWithin(tier-1, tier, tier+1);
        //replace the tier that's been copied by the backup tier
        tierList.tiers[tier] = backup;
        //renders the new list
        tierList.render()
    }
    
}
//moves a tier down
function moveTierDown(tier) {
    if (tier != tierList.tiers.length-1) {
        //backup the tier that's being replaced
        let backup = tierList.tiers[tier+1]
        //move the tier
        tierList.tiers.copyWithin(tier+1, tier, tier+1);
        //replace the tier that's been copied by the backup tier
        tierList.tiers[tier] = backup;
        //renders the new list
        tierList.render()
    }
}
function openExport() {
    document.getElementById("export").className = "visible-drop";
    document.getElementById("export").style.opacity = 1
    document.querySelectorAll('.tiersettings').forEach(function(item) {
        item.classList.add("hide-from-export")
    });
    document.getElementById("new").classList.add("hide-from-export")
    document.getElementById("export").innerHTML = "";
    html2canvas(document.querySelector("#tierlist")).then(canvas => {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob)
            document.getElementById("export").innerHTML += `<img src=${url}></img>`
            document.getElementById("export").innerHTML += `
            <div id="export-buttons">
                <a class="button" href="${url}" download="tierlist.png">
                    <i class="fa fa-download" aria-hidden="true"></i>
                    Download/Share Image
                </a>
                <button class="button" onclick="exportTiers()">
                    <i class="fa fa-download" aria-hidden="true"></i>
                    Export Template
                </button>
            </div>`
    
        })
    document.querySelector("body").addEventListener('click', checkExport);
    
    });

}

//closes the plus menu
function closeExport() {
    //hides away the plus menu. animations are a little busted but uh. woops.
    document.getElementById("export").style.opacity = 0;
    document.getElementById("export").className = "hidden";
    document.querySelectorAll('.tiersettings').forEach(function(item) {
        item.classList.remove("hide-from-export")
    });
    document.getElementById("new").classList.remove("hide-from-export")

}
//checks if the menu should be closed
function checkExport() {
    //check if user is hovering over the dropdown, or the plus button. closes if not.
    if (document.querySelector("#export.drop-shown:hover") == null && document.querySelector("#export-button:hover") == null) {
        closeExport()
    }
    

}

async function exportTiers() {
    let tierTitle = document.querySelector(".header").outerText
    let exportString = `${tierTitle}§`
    let exportLinks = "";
    //tier list length
    exportString += tierList.tiers.length
    //tier list color code and suffix
    tierList.tiers.forEach(function(tier) {
        exportString += `${tier.color}§${tier.suffix}§`
    })
    //generate file
    let fileData = new Blob([exportString], {type: 'text/plain'});
    
    //zip.file('test.png', testFile)
    //generate zip with jszip
    zip.file("tiers.txt", fileData)
    
    linkArray.forEach(function(link) {
        exportLinks += link + "§";
    })
    zip.file("links.txt", exportLinks)
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, `${tierTitle}.zip`);
    });
}
async function importTiers() {
    let importedfile = document.getElementById("import-fileselect").files[0];
    zip.loadAsync(importedfile).then(function (zip) {
        //read tiers.txt
        return zip.file("tiers.txt").async("text");
      }).then(function (input) {
        //clear the default tiers
        tierList.tiers = [];
        //find the name
        document.querySelector(".header").textContent = input.slice(0, input.search("§"))
        //find the number of tiers
        let numberOfTiers = input.charAt(input.search("§")+1)
        input = input.slice(input.search("§")+2)
        for (let runningTiers = 0; runningTiers < numberOfTiers; runningTiers++) {
            // Runs however many times is specified in input tiers
            //import tier colour
            let endColour = input.search("§")
            let tierImportColour = input.slice(0, endColour)
            input = input.slice(endColour+1)
            //import tier suffix
            let endSuffix = input.search("§")
            let tierImportSuffix = input.slice(0, endSuffix)
            input = input.slice(endSuffix+1)
            //add the tier
            tierList.addTier(new Tier(tierImportColour, tierImportSuffix));
            console.log(tierImportColour, tierImportSuffix)
        
        }
        //re-render the tier list
        tierList.render()
        console.log(zip.files)
        //import uploaded images
        zip.forEach(async function(file) {
            if (document.getElementById("upload-images-info").style.display != "none") {
                document.getElementById("upload-images-info").style.display = "none"   
            }
            if (document.getElementById("trash") == null) {
                document.getElementById("image-options").innerHTML += `<div id="trash"><i class="fa fa-trash-o fa-4x" aria-hidden="true"></i></div>`
            }
            if (file.search(".txt") == -1) {
                
                let file2 = await zip.file(file).async("blob")
                //console.log(file2)
                imageToRead = URL.createObjectURL(file2);
                document.querySelector("#image-options").innerHTML += `
                <div id="img-${uploadID}" draggable="true" class="potential-drag" style="background-image: url(${imageToRead});" ></div>`;
            }
            
        })
    });
    
}
let setHeight = document.body.offsetHeight
window.onscroll = function() {
    if ((window.innerHeight + Math.ceil(window.scrollY)-60) >= setHeight) {
        document.getElementById("image-options").style.position = "static"
    }
    else {
        document.getElementById("image-options").style.position = "fixed"
    }
}
//keyboard accessible tier list creation
window.onkeydown= function(key){
    
    //esc key - close plus or export menu
    if (key.keyCode == 27){
        closePlus()
        closeExport()
    }
    //+ key - open plus mini-menu
    else if (key.keyCode == 61){
        openPlus()
    };
};
var zip;
//
window.addEventListener("load", function(){
    zip = new JSZip();
    if (localStorage.theme == "light") {
        changeTheme()
    }
});
  
//change theme from dark to light
function changeTheme() {
    if (document.getElementById("theme-style").className == "dark-mode") {
        document.getElementById("theme-style").remove()
        document.querySelector("head").innerHTML += `<link class="light-mode" id="theme-style" rel="stylesheet" href="css/light.css">`
        document.getElementById("change-theme-button").className = "fa fa-moon-o main-text"
        localStorage.theme = "light"
    }
    else {
        document.getElementById("theme-style").remove()
        document.querySelector("head").innerHTML += `<link class="dark-mode" id="theme-style" rel="stylesheet" href="css/dark.css">`
        document.getElementById("change-theme-button").className = "fa fa-sun-o main-text"
        localStorage.theme = "dark"
    }
}

let touchX;
let touchY;


function endTouch(e) {
    touchX = e.changedTouches[0].clientX
    touchY = e.changedTouches[0].clientY
    //console.log(document.elementFromPoint(touchX, touchY))
    let position = document.elementsFromPoint(touchX, touchY)
    position.forEach(function(element) {
        if (element.tagName == "TD" && element.className != "tiersettings") { //find a part of the table to insert
            //If its a TD, we know it has a TR above it
            //if the element has text, copy it
            let content = document.getElementById("dragged").innerHTML
            //if the element has a background image, copy it
            let tempImage = document.getElementById("dragged").style.backgroundImage
            //trim the blob() off
            tempImage = tempImage.slice(5, -2)
            let template = `<div id="${tempID}" draggable="true" class="potential-drag" style="background-image: url(${tempImage});" >${content}</div>`;
            //add the element to the table!
            element.innerHTML += template;
            //remove the successfully dragged element
            document.getElementById("dragged").remove();

        } else if (element.id == "trash") {
            document.getElementById("dragged").remove();    
        }
    });
    //if an element is dragged to the wrong place it may stay dragged/transculent
    if (document.getElementById('dragged')) {
        document.getElementById("dragged").id = tempID
    }
    addListeners()
}