//declare variables
let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
let imageArray = [];
let i = 0;
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
        <img id="${i}" draggable="false" onmouseleave="unconvertDrag(this)" onmouseenter="convertDrag(this)" class="potentialdrag" src="${imageArray[i]}">`
    i = i + 1
    //dragElement(document.getElementById("drag"));
}
//convert drag
function convertDrag(element) {
    element.className = "drag"
    element.removeAttribute("onmouseenter")
    dragElement(element);
}

    //unconvert drag
    function unconvertDrag(element) {
    element.className = "potentialdrag"
    element.setAttribute("onmouseenter", "convertDrag(this)")
}

//drag functionality
function dragElement(elmnt) {
document.querySelector(".drag").onmousedown = dragMouseDown;

function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

function closeDragElement() {
    // stop moving when mouse button is released:
    let elementArray = document.elementsFromPoint(pos3, pos4)
    elementArray.forEach(function(element) {
        if (element.className == "tiers") {
            document.getElementById("tierscontent").innerHTML += `<img id="${document.querySelector(".drag").id}" draggable="false" onmouseleave="unconvertDrag(this)" onmouseenter="convertDrag(this)" class="potentialdrag" src="${imageArray[document.querySelector(".drag").id]}">`
            document.querySelector(".drag").remove()
        }
        else if (element.className == "tiera") {
            document.getElementById("tieracontent").innerHTML += `<img id="${document.querySelector(".drag").id}" draggable="false" onmouseleave="unconvertDrag(this)" onmouseenter="convertDrag(this)" class="potentialdrag" src="${imageArray[document.querySelector(".drag").id]}">`
            document.querySelector(".drag").remove()
        }
        else if (element.className == "tierb") {
            document.getElementById("tierbcontent").innerHTML += `<img id="${document.querySelector(".drag").id}" draggable="false" onmouseleave="unconvertDrag(this)" onmouseenter="convertDrag(this)" class="potentialdrag" src="${imageArray[document.querySelector(".drag").id]}">`
            document.querySelector(".drag").remove()
        }
        else if (element.className == "tierc") {
            document.getElementById("tierccontent").innerHTML += `<img id="${document.querySelector(".drag").id}" draggable="false" onmouseleave="unconvertDrag(this)" onmouseenter="convertDrag(this)" class="potentialdrag" src="${imageArray[document.querySelector(".drag").id]}">`
            document.querySelector(".drag").remove()
        }
        else if (element.className == "tierd") {
            document.getElementById("tierdcontent").innerHTML += `<img id="${document.querySelector(".drag").id}" draggable="false" onmouseleave="unconvertDrag(this)" onmouseenter="convertDrag(this)" class="potentialdrag" src="${imageArray[document.querySelector(".drag").id]}">`
            document.querySelector(".drag").remove()
        }
        else if (element.className == "tierf") {
            document.getElementById("tierfcontent").innerHTML += `<img id="${document.querySelector(".drag").id}" draggable="false" onmouseleave="unconvertDrag(this)" onmouseenter="convertDrag(this)" class="potentialdrag" src="${imageArray[document.querySelector(".drag").id]}">`
            document.querySelector(".drag").remove()
        }
        
        
    })
    document.onmouseup = null;
    document.onmousemove = null;

}
}