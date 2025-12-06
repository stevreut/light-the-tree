import { LightBulbArray } from "./lightbulbs.js"

const BULB_COUNT = 30;

let lightButton = null;  // button element
let offButton = null;    //    "
let offButton2 = null;   //    ""
let canv = null;  // canvas element
let lights = null
let ctx = null
const lightBackgroundColor = '#000'  // initial canvas background color (dark grey)

window.addEventListener("load",()=>{
    // When window and resources are fully loaded ...
    // Get HTMLelement objects corresponding to the expected ids
    // on the page.
    canv = document.getElementById("lights")
    lightButton = document.getElementById("lbtn")
    offButton = document.getElementById("offbtn")
    offButton2 = document.getElementById("offbtn2")
    lightButton.addEventListener("click",()=>{
        // When the button is clicked, get 'lights' (an instance of LightBulbArray)
        // from function setUpLights, then start the lights blinking via the
        // startLights() method of that object after first waiting 0.5 seconds
        let opt = getColorOption()
        lights = setUpLights(opt)
        setTimeout(()=>lights.startLights(),500)
        offButton.disabled = false
        lightButton.disabled = true
        document.querySelectorAll(".radcont").forEach(elem=>{
            elem.style.visibility = "hidden"
        })
        document.querySelector("h3").style.visibility = "hidden"
        document.querySelector("h1").classList.add("dim")
        document.querySelector(".outerdiv").style.visibility = "hidden"
        document.querySelector(".offfloat").style.visibility = "visible"
        canv.style.zIndex = 0;
    })
    offButton.addEventListener("click",doOffButton)
    offButton2.addEventListener("click",doOffButton)
})

function doOffButton() {
    disableLights()
    document.querySelector(".offfloat").style.visibility = "hidden"
    document.querySelector(".outerdiv").style.visibility = "visible"
    offButton.disabled = true
    lightButton.disabled = false
    document.querySelectorAll(".radcont").forEach(elem=>{
        elem.style.visibility = "visible"
    })
    document.querySelector("h3").style.visibility = "visible"
    document.querySelector("h1").classList.remove("dim")    
}

function getColorOption() {
    let selectors = document.querySelectorAll("input[name='paletteoption']")
    for (let sel of selectors) {
        if (sel.checked) {
            let option = sel.getAttribute("opt")
            if (option) {
                return option
            }
        }
    }
    return "std"  // default
}

function setUpLights(paletteOption) {
    // Adjust the dimensions of the canvas to fill the window within
    // reasonable margins.
    canv.width = window.innerWidth - 185
    canv.height = window.innerHeight - canv.offsetTop - 150
    // wid, hgt are convenience variables and contain the width and height
    // in pixels of the canvas based on the attributes provided on the page
    const wid = canv.width
    const hgt = canv.height
    // ctx is the instance of CanvasRenderingContext2D that must be used 
    // for all manipulation of the image shown on the canvas.
    ctx = canv.getContext("2d")
    if (!ctx) {
        console.error('no context created')
        throw 'no context created'
    }
    // Initially, fill the canvas with the color lightBackgroundColor
    ctx.fillStyle = lightBackgroundColor
    ctx.strokeStyle = lightBackgroundColor
    ctx.fillRect(0,0,wid,hgt)
    // Instantiate a LightBulbArray object ("lights"), providing canvas
    // dimension, context, and the number of light bulbs desired, then
    // return the same.
    try {
        let lights = new LightBulbArray(wid,hgt,ctx,BULB_COUNT,
            ((paletteOption==="pstl"?"pastel":"standard")))
        return lights
    } catch (err) {
        console.error(err)
        alert ('technical error in script prevents starting lights')         
    }
}

function disableLights() {
    if (lights) {
        lights.stopAll()
    }
    if (ctx) {
        ctx.fillStyle = lightBackgroundColor
        ctx.strokeStyle = lightBackgroundColor
        ctx.fillRect(0,0,canv.width,canv.height)
        ctx = null
    }
}