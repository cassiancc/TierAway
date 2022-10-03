const chai = require('chai');
let assert = chai.assert;
const puppeteer = require('puppeteer');
module.exports = () => new Promise((resolve,reject) => {
    let pageContent = "";
    before(async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //Extract page content
        await page.goto('http://localhost:3000');
        for(let i = 0;i<101;i++){
            await page.evaluate(function(){
                addSelection('upload');
            });
            let addImageDiv = await page.$("#addimagediv input");
            await addImageDiv.uploadFile("./tests/example.png");
        }
        await page.evaluate(
            function(){
                for(let i = 0;i<100;i++){
                    addSelection('newtier');
                    addTier();
                }
            }
        )
        pageContent = await page.evaluate(
            () => document.querySelector("html").innerHTML
        );
        /*
        /id="[0-9]+"/g
        /id=content-"[0-9]+"/g
        /id=image-"[0-9]+"/g
        */


        await browser.close();
    });
    context('Stress test',function(){
        describe('Upload 101 images',function(){
            it("Should have 101 elements with id img-0, img-1, ... img-101",function(){
                let matches = pageContent.match(/id="img-[0-9]+"/g) || [];
                //console.log(pageContent);
                //console.log(matches.length);
                assert(matches.length == 101);
            });
        });
        describe('Add 100 tiers',function(){
            it("Should have 100 elements with id 0, 1, ... 105",function(){
                let matches = pageContent.match(/id="[0-9]+"/g) || [];
                //console.log(pageContent);
                //console.log(matches.length);
                assert(matches.length == 106);
            });
            it("Should have 100 elements with id content-0, content-1, ... content-105",function(){
                let matches = pageContent.match(/id="content-[0-9]+"/g) || [];
                //console.log(pageContent);
                //console.log(matches.length);
                assert(matches.length == 106);
            });
        });
    });
    after(function(){
        resolve();
    });
});