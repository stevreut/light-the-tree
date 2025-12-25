class LightBulb {
    // Objects of this class represent a SINGLE light bulb and these
    // are used collectively in the class LightBulbArray.  Each
    // bulb has a randomly created 3-dimensional position ("dims") and
    // a randomly generated color (an array of three integers, each in
    // range 0 to 255, representing red, green, and blue values.
    constructor(scrWid,scrHgt,useStandard) {
        // The constructor expects the dimensions of the canvas, as well
        // as a boolean indicating whether a "standard" palette is used
        // for the lightbulb color or, if useStandard is false then
        // a randomly generated pastel color is use.
        this.boxWid = scrWid
        this.boxHgt = scrHgt
        this.boxUnit = Math.min(this.boxWid,this.boxHgt)
        this.dims = {}
        this.useStandard = useStandard
        // x and y dimensions are designed to slightly exceed the boundaries
        // of the canvas so that the canvas can appear to be illuminated by
        // a few bulbs are behind the window and outside the frame but still
        // "shine" obliquely onto the [virtual] window; hence the 1.3 and 0.15
        // below.
        this.dims.x = Math.round(Math.random()*this.boxWid*1.3-0.15)
        this.dims.y = Math.round(Math.random()*this.boxHgt*1.3-0.15)
        // The z coordinate is relatively shallow compared to the x and y
        // coordinates and represents the virtual depth behind the screen.
        this.dims.z = Math.round((Math.random()+1)*this.boxUnit*0.1)
        this.color = []
        // stdColors attempts emulate the colors of Christmas tree lights 
        // typically used in the 1960s and 1970s.
        const stdColors = [
            '#d2b32c',
            '#b52929',
            '#34c65d',
            '#2e74dd',
            '#1bdfef'
        ]
        let color = null
        if (this.useStandard) {
            // Randomly choose one of the stdColors, but parsed into 
            // distinct numeric primary color components.
            color = stdColors[Math.floor(Math.random()*stdColors.length)]
            for (let i=0;i<3;i++) {
                this.color.push(parseInt(color.substring(i*2+1,i*2+3),16))
            }
        } else {
            // If not useStandard then the "pastel" palette is preferred, so
            // we randomly generate colors wherein each of the primary 
            // components is an integer value between 128 and 255.
            for (let i=0;i<3;i++) {
                this.color.push(Math.floor(Math.random()*128+128))
            }
        }
        // msInterval and msStart control the "blinking" of the bulb.
        // All bulbs are initially "off".  They then first turn on after
        // msStart milliseconds and, thereafter, turn off or on after each
        // msInterval milliseconds.  Both numbers are randomly generated but
        // are tuned to be within reasonable ranges.
        this.msInterval = Math.round((Math.random()+3)*2000)
        this.msStart = Math.round(Math.random()*8000)
    }
    toString() {
        return JSON.stringify(this)
    }
}

class LightBulbArray {
    // Objects of this class represent a collection of blinking
    // light bulbs which appear to behind a frosted pane.  Each of the
    // individual bulbs is represented as a single object instance of
    // class LightBulb.
    //
    // Once an object of this class is instantiated with the expected
    // parameters, it can then be "started" via a call to method 
    // startLights().
    //
    // Once startLights() is invoked, lights will be displayed for
    // TIME_THRESHOLD milliseconds.
    static TIME_THRESHOLD = 1000*60*3 // 3 minutes
    static FRAME_COUNT_THRESHOLD = 100  // TODO - not YET implemented
    constructor(scrWid,scrHgt,ctx,count,paletteType) {
        // Expected constructor parameters:
        //    scrWid - width of canvas in pixels
        //    scrHgt - height of canvas in pixels
        //    ctx - an instance of CanvasRenderingContext2D associated with a canvas
        //    count - the desired number of light bulbs
        //    paletteType - "standard" indicates traditional (60's era) bulb colors
        //                  "pastel" indicates randomly generated pastel colors
        this.lightsCount = count
        this.bulbs = []
        this.wid = scrWid
        this.hgt = scrHgt
        this.magnifier = Math.min(this.wid,this.hgt)**2*3.5e-5  // TODO - 3.5e-5 is a "magic number"  :(
        this.ctx = ctx
        let ctxClassName = this.ctx.constructor.name
        if (ctxClassName !== 'CanvasRenderingContext2D') {
            throw 'invalid class on ctx parameter'
        }
        this.frameSet = null  // populated farther down
        this.usingStandardPalette = (!paletteType) || (paletteType !== 'pastel')
        // Randomly generate "count" light bulbs
        for (let i=0;i<this.lightsCount;i++) {
            this.bulbs.push(new LightBulb(scrWid,scrHgt,this.usingStandardPalette))
        }
        let timingSequence = []
        this.bulbs.forEach((bulb,idx)=>{
            let ms = bulb.msStart
            let state = false // off
            while (ms < LightBulbArray.TIME_THRESHOLD) {
                state = !state
                let bulbAction = {
                    ms: ms,
                    on: state,
                    bulbIdx: idx 
                }
                timingSequence.push(bulbAction)
                ms += bulb.msInterval
            }
        })
        timingSequence.sort((a,b)=>{
            return (a.ms - b.ms)
        })
        this.frameSet = []
        let stateTracker = new Array(this.lightsCount)
        stateTracker.fill(false)
        timingSequence.forEach((step,idx)=>{
            stateTracker[step.bulbIdx] = step.on
            let frame = {
                ms: step.ms,
                states: [...stateTracker]  // clones array, not referential (important)
            }
            this.frameSet.push(frame)
        })
    }
    startLights() {
        this.stopAll()
        const frameCount = this.frameSet.length
        this.timerElements = []
        for (let frameNum=0;frameNum<frameCount;frameNum++) {
            frameNum %= frameCount;
            let frame = this.frameSet[frameNum];
            let {ms} = frame
            this.timerElements.push(setTimeout(
                ()=>{
                    this.displayFrame(frameNum);
                    if (frameNum >= frameCount-1) {
                        // Careful of the delayed recursion here
                        this.startLights();
                    }
                },ms)
            )
        }
    }
    stopAll() {
        if (this.timerElements) {
            this.timerElements.forEach(te=>clearTimeout(te))
            this.timerElements = []
        }
        this.ctx.fillRect(0,0,this.wid,this.hgt)
    }
    displayFrame(frameNum) {
        this.ctx.fillStyle = '#000'
        this.ctx.fillRect(0,0,this.wid,this.hgt)
        const imgData = this.ctx.createImageData(this.wid,this.hgt)
        const frame = this.frameSet[frameNum]
        let pixelSum = new Array(this.wid*this.hgt)
        for (let j=0;j<pixelSum.length;j++) {
            pixelSum[j] = new Array(3).fill(0)
        }
        if (frame) {
            frame.states.forEach((state,idx)=>{
                if (state) {
                    const bulb = this.bulbs[idx]
                    for (let j=0;j<this.hgt;j++) {
                        let y = this.hgt-j
                        let rowOffset = j*this.wid
                        for (let i=0;i<this.wid;i++) {
                            let ix = rowOffset+i
                            let x = i
                            // TODO - From a calculation perspective it makes no real
                            // difference but I wonder if it might be more appropriate to
                            // put the following calculations in the LightBulb class 
                            // rather than here.
                            let intensityBase = bulb.dims.z*((x-bulb.dims.x)**2+(y-bulb.dims.y)**2+bulb.dims.z**2)**(-1.5)
                            for (let n=0;n<3;n++) {
                                pixelSum[ix][n] += intensityBase*bulb.color[n]
                            }
                        }
                    }
                }
            })
            pixelSum.forEach((sum,offs)=>{
                let row = Math.floor(offs/this.wid)
                let col = offs % this.wid
                let pixOffset = offs*4
                for (let n=0;n<3;n++) {
                    let pixVal = Math.min(255,Math.floor(256*sum[n]*this.magnifier))
                    imgData.data[pixOffset+n] = pixVal
                }
                imgData.data[pixOffset+3] = 255;  // full opacity
            })
        } else {
            throw 'no frame at ' + frameNum
        }
        this.ctx.putImageData(imgData,0,0);
    }
}

export { LightBulb, LightBulbArray }