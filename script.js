/*
    Tier Away is a website that helps users create unique tier lists. No accounts, no hassle.
    Copyright (C) 2022 Con Godsted
*/
//declare global variables
let imageArray = [];
let i = 0;

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
    closePlus();
    //check if it was triggered by the file upload
    if (imageToRead == "file") {
        let fileLength = document.getElementById(`fileselect`).files.length;
        for (let f = 0;f < fileLength;f++) {
            //create a blob link for the image
            imageToRead = URL.createObjectURL(document.getElementById(`fileselect`).files[f]);
            //add the blob link to the list of images -- for later exporting
            imageArray.push(imageToRead);
            //turn the image into a draggable div
            document.querySelector("#image-options").innerHTML += `
            <div id="img-${i}" draggable="true" class="potentialdrag" style="background-image: url(${imageToRead});" ></div>`;
            i = i + 1;
        }
    //if not it's a url to be parsed and added to image options
    } else if (imageToRead != "") {
            //the image already has a link so add it to the list of images -- for later exporting
            imageArray.push(imageToRead);
            //turn the image into a draggable div
            document.querySelector("#image-options").innerHTML += `
            <div id="img-${i}" draggable="true" class="potentialdrag" style="background-image: url(${imageToRead});" ></div>`;
            i = i + 1;
        }
    addListeners()
}

//creates a draggable text element
function addText() {
    let text = document.getElementById("text-select").value
    document.querySelector("#image-options").innerHTML += `
            <div draggable="true" class="potentialdrag" >${text}</div>`;
    addListeners()
    closePlus()
}

//starts the drag process by setting an id on the element being dragged
function startDrag() {
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
        if (element.tagName == "TD") { //find a part of the table to insert
            //If its a TD, we know it has a TR above it
            //if the element has text, copy it
            let content = document.getElementById("dragged").innerHTML
            //if the element has a background image, copy it
            let tempImage = document.getElementById("dragged").style.backgroundImage
            //trim the blob() off
            tempImage = tempImage.slice(5, -2)
            let template = `<div draggable="true" class="potentialdrag" style="background-image: url(${tempImage});" >${content}</div>`;
            //add the element to the table!
            element.innerHTML += template;
            //remove the successfully dragged element
            document.getElementById("dragged").remove();

        }
    });
    //if an element is dragged to the wrong place it may stay dragged/transculent
    if (document.getElementById('dragged')) {
        document.getElementById("dragged").id = "";
    }
    //moved elements lose their event listeners after being dragged
    addListeners()


}

function addSelection(select) {
    if (select == "upload") {
        //Add Image from Upload
        document.getElementById("addDrop").innerHTML =
        `<div id="addimagediv">
            <label>Add new Image: </label>
            <input multiple onchange="imageRead('file')" type="file" accept="image/*" id="fileselect">
        </div>`;
        //Add Image from URL
    } else if (select == "url") {
        document.getElementById("addDrop").innerHTML =
        `<div id="addurldiv">
            <label>Add Image from URL: </label>
            <div id="url-upload"><input type="url" placeholder="http://example.com/" name="urlselect" id="urlselect">
            <button onclick="imageRead(document.getElementById('urlselect').value)" id="addtierbutton">Add Image</button></div>
        </div>`;
        //Add Text to Tier List
    } else if (select == "text") {
        document.getElementById("addDrop").innerHTML =
        `<div id="addtextdiv">
            <label>Add Text: </label>
            <div id="text-add">
                <input type="text" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." name="textselect" id="text-select">
                <button onclick="addText()" id="add-text-button">Add Text</button>
            </div>
        </div>`;
        //Add New Tier
    } else if (select == "newtier") {
        document.getElementById("addDrop").innerHTML =
        `<div id="addtierdiv">
            <label>Add Tier: </label>
            <div id="add-tier-content">
                <input type="text" name="add-tier" placeholder="S Tier" id="add-tier">
                <input type="color" value="#780063" name="add-tier-colour" id="add-tier-colour">
                <button onclick="addTier()" id="add-tier-button">Add Tier</button>
            </div>
        </div>`;
    } else {
        document.getElementById.innerHTML = select;
    }

}

//opens the plus menu
function openPlus() {
    document.getElementById("addDrop").className = "dropshown";
    document.getElementById("addDrop").style.opacity = 1;
    document.getElementById("addDrop").innerHTML = `
    <div id="button-panel">
        <button onclick="addSelection('upload')">
            <i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i>
            <p>Add Image from Upload</p>
        </button>
        <button onclick="addSelection('url')">
            <i class="fa fa-external-link fa-2x" aria-hidden="true"></i>
            <p>Add Image from URL</p>
        </button>
        <button onclick="addSelection('text')">
            <i class="fa fa-file-text fa-2x" aria-hidden="true"></i>
            <p>Add Text to Tier List</p>
        </button>
        <button onclick="addSelection('newtier')">
        <i class="fa fa-plus fa-2x" aria-hidden="true"></i>
            <p>Add New Tier</p>
        </button>
        <button onclick="addSelection('import')">
            <i class="fa fa-upload fa-2x" aria-hidden="true"></i>
            <p>Import Tier List (indev)</p>
        </button>
    </div`;
    document.querySelector("body").addEventListener('click', checkPlus);
}
//closes the plus menu
function closePlus() {
    //hides away the plus menu. animations are a little busted but uh. woops.
    document.getElementById("addDrop").style.opacity = 0;
    document.getElementById("addDrop").className = "hidden";

}
//checks if the menu should be closed
function checkPlus() {
    //check if user is hovering over the dropdown, or the plus button. closes if not.
    if (document.querySelector(".dropshown:hover") == null && document.querySelector("#new:hover") == null) {
        closePlus()
    }
    

}
//adds the necessary event listeners for the Drag
function addListeners() {
    //find all draggable elements
    let items = document.querySelectorAll('.potentialdrag');
    items.forEach(function(item) {
        item.addEventListener('dragstart', startDrag);
        item.addEventListener('dragend', endDrag);
    });
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
function tierExport() {
    document.getElementById("export").className = "export-visible";
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
            document.getElementById("export").innerHTML += `<a href="${url}" download="tierlist.png"><i class="fa fa-download" aria-hidden="true"></i>
            Download</a>`
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
    if (document.querySelector(".export-visible:hover") == null && document.querySelector("#export-button:hover") == null) {
        closeExport()
    }
    

}