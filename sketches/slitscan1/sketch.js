let capture;
let targetX = -1;
let w = 640;
let h = 360;
let fpsGraphics;
let shouldScan = false;
let session = ""+Math.floor(Date.now());
session = session.slice(session.length-6, session.length);
let imgCount = 0;
let paused = false;
let canvas;

function setup() {
  canvas = createCanvas(innerWidth, h);
  canvas.parent('#sketch-parent');
  pixelDensity(1);
  capture = createCapture(VIDEO);
  $("video").appendTo('#vid-container');
  
  capture.size(w, h);
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
        screencap();
        targetX = -1;
    }
    drawFPS();
}

function windowResized() {
    resizeCanvas(innerWidth, h);
    background(255);
    targetX = -1;
}

function checkForVideo() {
    let total = 0;
    for(let y = 0; y < h; y++) {
        for(let x = 0; x < w; x++) {
            total+=capture.pixels[0];
        }
    }
    if(total > 0 && !Number.isNaN(total)) {
        $('.scanline').show();
        $('#vid-container').toggle();
        return true;
    }
}

function drawFPS() {
    if($('#framerate-toggle').is(':checked')){
        $('.fps').show();
        if(frameCount % 5 == 0){
            select('.fps').html(Math.floor(frameRate()));
        }
    } else {
        $('.fps').hide();
    }
}

function keyPressed() {
    if(key == 'v') {
        $('#vid-container').toggle(); 
    }
    else if(key == ' ') {
        paused = !paused;
        if(paused) {
            noLoop();
        } else {
            loop();
        }
    }

    // else if(key == 's'){
    //     save(`slitscan_smear-ats-${session}-${imgCount}.png`);
    //     imgCount++;
    // }
}

function screencap() {
    if($('#save-img-toggle').is(':checked')) {
        save(`slitscan_smear-ats-${session}-${imgCount}.png`);
    }
    imgCount++;
}



