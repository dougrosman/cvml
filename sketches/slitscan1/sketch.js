let capture;
let targetX = 0;
let w = 640;
let h = 480;
let fpsGraphics;
let shouldScan = false;

function setup() {
  let canvas = createCanvas(innerWidth+2, h);
  canvas.parent('#sketch-parent');
  fpsGraphics = createGraphics(100, 20);
  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  //capture.hide();
  background(255);
}

function draw() {
    capture.loadPixels();
    if(!shouldScan) {
        shouldScan = checkForVideo();
    }
    
    if(capture.pixels.length > 0 && shouldScan) {
        targetX++;
        copy(capture, w / 2, 0, 1, h, targetX, 0, 1, h);
    }
    
    if (targetX > width) {
        targetX = 0;
    }
    //drawFPS();
    //image(capture, w/2, 100);
}



function checkForVideo() {
    let total = 0;
    for(let y = 0; y < h; y++) {
        for(let x = 0; x < w; x++) {
            total+=capture.pixels[0];
        }
    }
    if(total > 0 && !Number.isNaN(total)) {
        return true;
    }
}

function drawFPS() {
    if(frameCount % 60 == 0){
        let avgFrameRate = floor(frameCount/(millis()/1000));
        fpsGraphics.background(0);
        fpsGraphics.fill(255);
        fpsGraphics.text(avgFrameRate, 10, 10);
        image(fpsGraphics, 10, 10);
    }
}

$('body').click(function(){
    if($('video').parent()[0].localName == 'body'){
        $("video").appendTo('#vid-container');
    } else {
        $('#vid-container').toggle();
    }
    
})



