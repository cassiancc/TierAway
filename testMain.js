let dragAndDrop = require("./tests/dragAndDrop");
const chai = require('chai');
let assert = chai.assert;
const puppeteer = require('puppeteer');
var express = require('express');
const { expect } = require('chai');
var app = express();

//setting middleware
app.use(express.static( __dirname)); //Serves resources from public folder

describe("true",function(){
  it('should be true',function(){
    assert(true);
  });
});
var server = app.listen(3000);

let pageContent = "";
let img0Background;
let img0DragBackground;
let img0ParentID;
before(async () => {
  const browser = await puppeteer.launch({
    dumpio:true
  });
  const page = await browser.newPage();
  //Extract page content
  await page.goto('http://localhost:3000');
  pageContent = await page.content();
  let newMenu = await page.$("#new");
  await newMenu.click();
  let imageFromUpload = await page.$("#button-panel button");
  await imageFromUpload.click();
  let addImageDiv = await page.$("#addimagediv input");
  await addImageDiv.uploadFile("./tests/example.png");
  
  img0Background = await page.evaluate(
    () => document.getElementById("img-0").style.backgroundImage
  );

  await dragAndDrop(
    page,
    '#img-0',
    '#content-0',
  );
  img0DragBackground = await page.evaluate(
    () => document.getElementById("img-0").style.backgroundImage
  );
  img0ParentID = await page.evaluate(
    () => document.getElementById("img-0").parentElement.id
  );
  console.log(img0ParentID);
  
  //await page.screenshot({ path: 'example.png' });
  await browser.close();
  await server.close();
});

describe('page.content()',function(){
  it("Should contain the text \"Tier Away\"",function(){
    assert(pageContent.search("Tier Away") !== -1);
  });
});
describe('Image upload',function(){
  it("img-0 should have background-image",function(){
    assert(img0Background !== "");
  });
});
describe('Drag and drop',function(){
  it("Blob for img-0 should match blob when dragged to tier S",function(){
    assert(img0Background == img0DragBackground);
  });
  it("#img-0 should be contained within #content-0",function(){
    assert(img0ParentID === "content-0");
  });
})