//declare variables
let imageArray = [];
let i = 0;
let items = "";
let tierList = [
`<tr id="0">
<th style="background-color: red;" class="tiers tierheader">S</td>
<td id="tierscontent" class="tiers"></td>
<td class="tiersettings"><button onclick="tierRemove(0)">Delete</button></td>
</tr>`,
`<tr id="1">
<th style="background-color: orange;" class="tiera tierheader">A</td>
<td id="tieracontent" class="tiera"></td>
<td class="tiersettings"><button onclick="tierRemove(1)">Delete</button></td>
</tr>`,
`<tr id="2">
<th style="background-color: #ffff00;" class="tierb tierheader">B</td>
<td id="tierbcontent" class="tierb"></td>
<td class="tiersettings"><button onclick="tierRemove(2)">Delete</button></td>
</tr>`,
`<tr id="3">
<th style="background-color: #D2F319;" class="tierc tierheader">C</td>
<td id="tierccontent" class="tierc"></td>
<td class="tiersettings"><button onclick="tierRemove(3)">Delete</button></td>
</tr>`,
`<tr id="4">
<th style="background-color: #A1C51D;" class="tierd tierheader">D</td>
<td id="tierdcontent" class="tierd"></td>
<td class="tiersettings"><button onclick="tierRemove(4)">Delete</button></td>
</tr>`,
`<tr id="5">
<th style="background-color: #6f9720;" class="tierf tierheader">F</td>
<td id="tierfcontent" class="tierf"></td>
<td class="tiersettings"><button onclick="tierRemove(5)">Delete</button></td>
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
function imageRead() {

    imageArray.push(URL.createObjectURL(document.getElementById("fileselect").files[0]))
    document.querySelector("#imageoptions").innerHTML += `
        <img id="${i}" draggable="true" class="potentialdrag" src="${imageArray[i]}">`
    i = i + 1
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