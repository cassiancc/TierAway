//declare variables
let imageArray = [];
let i = 0;
let dropRunCount = 0;
let items = "";
let dropArray = [];
class TierList{
    constructor(){
        this.tiers = [];
        this.counter = 0;
    }
    addTier(tier){
        tier.id = this.counter;
        this.counter++;
        this.tiers.push(tier);
        document.querySelector("tbody").innerHTML += tier.render();
        addListeners()
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
        <td class="tiersettings"><button onclick="tierList.removeTierByID(${this.id})"><i class="fa fa-times" aria-hidden="true"></i>
        Delete</button></td>
        </tr>`;
    }
}
let tierList = new TierList();
//the default tiers, s-f
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
            <div id="img-${i}" draggable="true" class="potentialdrag" style="background-image: url(${imageToRead});" ></div>`;
            i = i + 1;
        }

    } else if (imageToRead != "") {
            imageArray.push(imageToRead);
            document.querySelector("#imageoptions").innerHTML += `
            <div id="img-${i}" draggable="true" class="potentialdrag" style="background-image: url(${imageToRead});" ></div>`;
            i = i + 1;
        }

    
    items = document.querySelectorAll('.potentialdrag');
    addListeners()
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
            let tempImage = document.getElementById("dragged").style.backgroundImage
            tempImage = tempImage.slice(5, -2)
            let template = `<div draggable="true" class="potentialdrag" style="background-image: url(${tempImage});" ></div>`;

            element.innerHTML += template;
            document.getElementById("dragged").remove();

        }
    });
    //moved elements lose their event listeners after being dragged
    if (document.getElementById('dragged')) {
        document.getElementById("dragged").id = "";
    }
    addListeners()


}

function addNew() {
    //opens the plus menu. this may end up being renamed.
    document.getElementById("addDrop").className = "dropshown";
    document.getElementById("addDrop").style.opacity = 1;
    document.getElementById("addDrop").innerHTML = `
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
    </button>`;
    document.querySelector("body").addEventListener('click', checkPlus);
}

function addSelection(select) {
    if (select == "upload") {
        //Add Image from Upload
        document.getElementById("addDrop").innerHTML =
            `<div id="addimagediv">
            <label>Add new image: </label>
            <input multiple onchange="imageRead('file')" type="file" accept="image/*" id="fileselect">
        </div>`;
        //Add Image from URL
    } else if (select == "url") {
        document.getElementById("addDrop").innerHTML =
            `<div id="addurldiv">
            <label>Add image from URL: </label>
            <input type="url" name="urlselect" id="urlselect">
            <button onclick="imageRead(document.getElementById('urlselect').value)" id="addtierbutton">Add Image</button>
        </div>`;
        //Add Text to Tier List
    } else if (select == "text") {
        document.getElementById("addDrop").innerHTML =
            `<div id="addtextdiv">
            <label>Add text: </label>
            <input type="text" name="textselect" id="textselect">
            <button onclick="addTier()" id="addtierbutton">Add Text</button>
        </div>`;
        //Add New Tier
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
    //hides away the plus menu. animations are a little busted but uh. woops.
    document.getElementById("addDrop").style.opacity = 0;
    document.getElementById("addDrop").className = "hidden";

}

function checkPlus() {
    //check if user is hovering over the dropdown, or the plus button. closes if not.
    if (document.querySelector(".dropshown:hover") == null && document.querySelector("#new:hover") == null) {
        closePlus()
    }
    

}
function addListeners() {
    //adds the necessary event listeners for the Drag
    items = document.querySelectorAll('.potentialdrag');
    items.forEach(function(item) {
        item.addEventListener('dragstart', startDrag);
        item.addEventListener('dragend', endDrag);
    });
}