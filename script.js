//declare variables
let imageArray = [];
let i = 0;
let dropRunCount = 0;
let items = "";
let dropArray = [];
let tierList = [
`<tr id="0">
<th style="background-color: red;" class="tiers tierheader">S</td>
<td id="tierscontent" class="tiers"></td>
<td class="tiersettings"><button onclick="tierRemove(0)"><i class="fa fa-times" aria-hidden="true"></i>
Delete</button></td>
</tr>`,
`<tr id="1">
<th style="background-color: orange;" class="tiera tierheader">A</td>
<td id="tieracontent" class="tiera"></td>
<td class="tiersettings"><button onclick="tierRemove(1)"><i class="fa fa-times" aria-hidden="true"></i>
Delete</button></td>
</tr>`,
`<tr id="2">
<th style="background-color: #ffff00;" class="tierb tierheader">B</td>
<td id="tierbcontent" class="tierb"></td>
<td class="tiersettings"><button onclick="tierRemove(2)"><i class="fa fa-times" aria-hidden="true"></i>
Delete</button></td>
</tr>`,
`<tr id="3">
<th style="background-color: #D2F319;" class="tierc tierheader">C</td>
<td id="tierccontent" class="tierc"></td>
<td class="tiersettings"><button onclick="tierRemove(3)"><i class="fa fa-times" aria-hidden="true"></i>
Delete</button></td>
</tr>`,
`<tr id="4">
<th style="background-color: #A1C51D;" class="tierd tierheader">D</td>
<td id="tierdcontent" class="tierd"></td>
<td class="tiersettings"><button onclick="tierRemove(4)"><i class="fa fa-times" aria-hidden="true"></i>
Delete</button></td>
</tr>`,
`<tr id="5">
<th style="background-color: #6f9720;" class="tierf tierheader">F</td>
<td id="tierfcontent" class="tierf"></td>
<td class="tiersettings"><button onclick="tierRemove(5)"><i class="fa fa-times" aria-hidden="true"></i>
Delete</button></td>
</tr>`]
tierList.forEach(function(tier) {
    document.querySelector("tbody").innerHTML += tier;

})
function tierRemove(item) {
    tierList.splice(item, 1);
    document.querySelector("tbody").innerHTML = "";
    t = 0
    
    tierList.forEach(function(tier) {
        tierList[t] = tierList[t].replace(/id="[0-9]"/g, `id="${t}"`);
        tierList[t] = tierList[t].replace(/tierRemove\([0-9]\)/g, `tierRemove\(${t}\)`);
        t = t + 1
        
    })
    tierList.forEach(function(tier) {
        document.querySelector("tbody").innerHTML += tier;
        
    })
}
//add new tier
function addTier() {
    tierName = document.getElementById("addtier").value
    tierColour = document.getElementById("addtiercolour").value
    document.querySelector("tbody").innerHTML += 
    `<tr id="tier${tierName}">
        <th style="background-color: ${tierColour};" class="tier${tierName} tierheader">${tierName}</th>
        <td id="tier${tierName}content" class="tier${tierName}"></td>
    </tr>`
}
//read image from file upload
function imageRead(imageToRead) {
    closePlus()
    //check if it was triggered by the file upload
    if (imageToRead == "file") {
        let fileLength = document.getElementById(`fileselect`).files.length
        let f = 0
        while (fileLength != 0) {
            imageToRead = URL.createObjectURL(document.getElementById(`fileselect`).files[f])
            document.querySelector("#imageoptions").innerHTML += `
            <img id="${i}" draggable="true" class="potentialdrag" src="${imageToRead}">`
            i = i + 1
            f = f + 1
            fileLength = fileLength - 1
        }
        
    }
    else {
        if (imageToRead != "") {
            console.log(imageToRead)
            imageArray.push(imageToRead)
            document.querySelector("#imageoptions").innerHTML += `
            <img id="${i}" draggable="true" class="potentialdrag" src="${imageToRead[i]}">`
            i = i + 1
        }
        
    }
    
    
    items = document.querySelectorAll('.potentialdrag');
    items.forEach(function (item) {
    item.addEventListener('dragstart', startDrag);
    item.addEventListener('dragend', endDrag);
  });
}
function startDrag() {
    this.id = 'dragged';
  }
  
function endDrag(e) {
    console.log(e)
    //find the mouse
    posX = e.clientX;
    posY = e.clientY;
    //check what the mouse is hovering over
    let position = document.elementsFromPoint(posX, posY)
    position.forEach(function(element) {
    if (element.tagName == "TD") { //find a part of the table to insert
        element.innerHTML += `<img class="potentialdrag" src="${document.querySelector("#dragged").src}">`
        document.getElementById("dragged").remove()

    }
    else { //if isn't dragged into the table
        //sometimes elements get stuck in a dragged state, fixes
        if (document.getElementById('dragged')) {
        document.getElementById("dragged").id = ""}
    }})
    //moved elements lose their event listeners after being dragged
    items = document.querySelectorAll('.potentialdrag');
    items.forEach(function (item) {
    item.addEventListener('dragstart', startDrag);
    item.addEventListener('dragend', endDrag);
  });
    
    
  }
function addNew() {
    console.log("add")
    document.getElementById("addDrop").className = "dropshown"
    document.getElementById("addDrop").style.opacity = 1
    document.getElementById("addDrop").innerHTML = `<button onclick="addSelection('upload')">Add Image from Upload</button>
    <button onclick="addSelection('url')">Add Image from URL</button>
    <button onclick="addSelection('text')">Add Text to Tier list (indev)</button>
    <button onclick="addSelection('newtier')">Add new Tier</button>
    <button onclick="addSelection('import')">Import Tier List (indev)</button>`
}
function addSelection(select) {
    if (select == "upload") {
        document.getElementById("addDrop").innerHTML = 
        `<div id="addimagediv">
            <label>Add new image: </label>
            <input multiple onchange="imageRead('file')" type="file" accept="image/*" id="fileselect">
        </div>`
    } 
    else if (select == "url") {
        document.getElementById("addDrop").innerHTML = 
        `<div id="addurldiv">
            <label>Add image from URL: </label>
            <input type="url" name="urlselect" id="urlselect">
            <button onclick="imageRead(document.getElementById('urlselect').value)" id="addtierbutton">Add Image</button>
        </div>`
    }
    else if (select == "text") {
        document.getElementById("addDrop").innerHTML = 
        `<div id="addtextdiv">
            <label>Add text: </label>
            <input type="text" name="textselect" id="textselect">
            <button onclick="addTier()" id="addtierbutton">Add Text</button>
        </div>`
    }
    else if (select == "newtier") {
        document.getElementById("addDrop").innerHTML = 
        `<div id="addtierdiv">
            <label>Add Tier: </label>
            <div>
            <input type="text" name="addtier" placeholder="S Tier" id="addtier">
            
            <input type="color" name="addtiercolour" id="addtiercolour">
            <button onclick="addTier()" id="addtierbutton">Add Tier</button>
            </div>
        </div>`
    }
    else {
        document.getElementById.innerHTML = select
    }
    
}
function closePlus() {
    document.getElementById("addDrop").style.opacity = 0
    document.getElementById("addDrop").className = "hidden"
    
}
function findScreenCoords(mouseEvent)
{
  var xpos;
  var ypos;
  if (mouseEvent)
  {
    //FireFox
    xpos = mouseEvent.screenX;
    ypos = mouseEvent.screenY;
  }
  else
  {
    //IE
    xpos = window.event.screenX;
    ypos = window.event.screenY;
  }
  console.log()
  dropRunCount += 1
  dropArray.push(document.elementFromPoint(xpos, ypos))
  if (dropArray.length != 2 && dropRunCount != 1) {
    closePlus()
    dropArray = []
    dropRunCount = 0
  }
  
}
