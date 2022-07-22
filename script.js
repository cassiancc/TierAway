//declare variables
let imageArray = [];
let i = 0;
let dropRunCount = 0;
let items = "";
let dropArray = [];
class TierList{
    constructor(){
        this.tiers = [];
    }
    addTier(tier){
        tier.id = this.tiers.length;
        this.tiers.push(tier);
        document.querySelector("tbody").innerHTML += tier.render();
    }
    addToTierByID(tierID,HTMLString){
        this.tiers[tierID].content += HTMLString;
    }
    removeTierByID(tierID){
        this.tiers.splice(tierID,1);
        document.querySelector("tbody").innerHTML = "";
        this.tiers.forEach(function(tier,idx){
            tier.id = idx;
            document.querySelector("tbody").innerHTML += tier.render();
        });
    }
    renderAll(){
        document.querySelector("tbody").innerHTML = "";
        tierList.forEach(function(tier,idx) {
            //Modify rendered HTML
            document.querySelector("tbody").innerHTML += tier.render(idx);
    
        })
    }
}
class Tier{
    constructor(color,suffix){
        this.id = null;
        this.color = color;
        this.suffix = suffix;
        this.contentHTML = "";
    }
    render(){
        return `<tr id="${this.id}">
        <th style="background-color: ${this.color};" class="tier${this.suffix} tierheader">${this.suffix.toUpperCase()}</td>
        <td id="tierscontent" class="tiers">${this.contentHTML}</td>
        <td class="tiersettings"><button onclick="tierList.removeTierByID(${this.id})"><i class="fa fa-times" aria-hidden="true"></i>
        Delete</button></td>
        </tr>`;
    }
    set content(HTMLString){
        this.contentHTML = HTMLString;
        document.getElementById(this.id).innerHTML = `<th style="background-color: ${this.color};" class="tier${this.suffix} tierheader">${this.suffix.toUpperCase()}</td>
        <td id="tierscontent" class="tiers">${this.contentHTML}</td>
        <td class="tiersettings"><button onclick="tierList.removeTierByID(${this.id})"><i class="fa fa-times" aria-hidden="true"></i>
        Delete</button></td>`
    }
    get content(){
        return this.contentHTML;
    }
}
let tierList = new TierList();
tierList.addTier(new Tier("red","s"));
tierList.addTier(new Tier("orange","a"));
tierList.addTier(new Tier("#ffff00","b"));
tierList.addTier(new Tier("#D2F319","c"));
tierList.addTier(new Tier("#A1C51D","d"));
tierList.addTier(new Tier("#6f9720","f"));
//add new tier
function addTier() {
    tierName = document.getElementById("addtier").value;
    tierColour = document.getElementById("addtiercolour").value;
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
            imageToRead = URL.createObjectURL(document.getElementById(`fileselect`).files[f]);
            document.querySelector("#imageoptions").innerHTML += `
            <div id="${i}" draggable="true" class="potentialdrag" style="background-image: url(${imageToRead});" ></div>`;
            i = i + 1;
        }

    } else if (imageToRead != "") {
            imageArray.push(imageToRead);
            document.querySelector("#imageoptions").innerHTML += `
            <div id="${i}" draggable="true" class="potentialdrag" style="background-image: url(${imageToRead});" ></div>`;
            i = i + 1;
        }

    
    items = document.querySelectorAll('.potentialdrag');
    items.forEach(function(item) {
        item.addEventListener('dragstart', startDrag);
        item.addEventListener('dragend', endDrag);
    });
}

function startDrag() {
    this.id = 'dragged';
}

function endDrag(e) {
    //find the mouse
    posX = e.clientX;
    posY = e.clientY;
    //check what the mouse is hovering over
    let position = document.elementsFromPoint(posX, posY)
    position.forEach(function(element) {
        if (element.tagName == "TD") { //find a part of the table to insert
            //If its a TD, we know it has a TR above it
            let tempImage = document.querySelector("#dragged").style.backgroundImage
            tempImage = tempImage.slice(5, -2)
            let template = `<div draggable="true" class="potentialdrag" style="background-image: url(${tempImage});" ></div>`;

            let id = element.parentElement.id;
            tierList.addToTierByID(id,template);
            document.getElementById("dragged").remove();

        } else { //if isn't dragged into the table
            //sometimes elements get stuck in a dragged state, fixes
            if (document.getElementById('dragged')) {
                document.getElementById("dragged").id = "";
            }
        }
    });
    //moved elements lose their event listeners after being dragged
    items = document.querySelectorAll('.potentialdrag');
    items.forEach(function(item) {
        item.addEventListener('dragstart', startDrag);
        item.addEventListener('dragend', endDrag);
    });


}

function addNew() {
    document.getElementById("addDrop").className = "dropshown";
    document.getElementById("addDrop").style.opacity = 1;
    document.getElementById("addDrop").innerHTML = `<button onclick="addSelection('upload')">Add Image from Upload</button>
    <button onclick="addSelection('url')">Add Image from URL</button>
    <button onclick="addSelection('text')">Add Text to Tier list (indev)</button>
    <button onclick="addSelection('newtier')">Add new Tier</button>
    <button onclick="addSelection('import')">Import Tier List (indev)</button>`;
}

function addSelection(select) {
    if (select == "upload") {
        document.getElementById("addDrop").innerHTML =
            `<div id="addimagediv">
            <label>Add new image: </label>
            <input multiple onchange="imageRead('file')" type="file" accept="image/*" id="fileselect">
        </div>`;
    } else if (select == "url") {
        document.getElementById("addDrop").innerHTML =
            `<div id="addurldiv">
            <label>Add image from URL: </label>
            <input type="url" name="urlselect" id="urlselect">
            <button onclick="imageRead(document.getElementById('urlselect').value)" id="addtierbutton">Add Image</button>
        </div>`;
    } else if (select == "text") {
        document.getElementById("addDrop").innerHTML =
            `<div id="addtextdiv">
            <label>Add text: </label>
            <input type="text" name="textselect" id="textselect">
            <button onclick="addTier()" id="addtierbutton">Add Text</button>
        </div>`;
    } else if (select == "newtier") {
        document.getElementById("addDrop").innerHTML =
            `<div id="addtierdiv">
            <label>Add Tier: </label>
            <div>
            <input type="text" name="addtier" placeholder="S Tier" id="addtier">
            
            <input type="color" name="addtiercolour" id="addtiercolour">
            <button onclick="addTier()" id="addtierbutton">Add Tier</button>
            </div>
        </div>`;
    } else {
        document.getElementById.innerHTML = select;
    }

}

function closePlus() {
    document.getElementById("addDrop").style.opacity = 0;
    document.getElementById("addDrop").className = "hidden";

}

function findScreenCoords(mouseEvent) {
    var xpos;
    var ypos;
    if (mouseEvent) {
        //FireFox
        xpos = mouseEvent.screenX;
        ypos = mouseEvent.screenY;
    } else {
        //IE
        xpos = window.event.screenX;
        ypos = window.event.screenY;
    }
    console.log();
    dropRunCount += 1;
    dropArray.push(document.elementFromPoint(xpos, ypos));
    if (dropArray.length != 2 && dropRunCount != 1) {
        closePlus();
        dropArray = [];
        dropRunCount = 0;
    }

}