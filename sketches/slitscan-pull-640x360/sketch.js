let capture;
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
  capture.size(w, h);
  capture.hide();
  background(255);
}

function draw() {
  
  push();
    translate(w, 0);
    scale(-1, 1);
    image(capture, w/1.5, 0);
  pop();
  
  capture.loadPixels();
  loadPixels();

  if(capture.pixels.length > 0) {

    for(let x = width-1; x > 0; x--) {
      for(let y = 0; y < h; y++) {
        let index = (x + (y*width)) * 4;
        //let slitIndex = (y*w) * 4;
        let slitIndex = ((x-1) + (y*width)) * 4;
        pixels[index] = pixels[slitIndex];
        pixels[index+1] = pixels[slitIndex+1];
        pixels[index+2] = pixels[slitIndex+2];
      }
    }
  }

  updatePixels();
  drawFPS();

  if(frameCount > width-(width/6) && frameCount % 600 == 0) {
      screencap();
  }
}

function windowResized() {
    resizeCanvas(innerWidth, h);
    background(255);
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

    else if(key == 's'){
        save(`slitscan_smear-ats-${session}-${imgCount}.png`);
        imgCount++;
    }
}

function screencap() {
    if($('#save-img-toggle').is(':checked')) {
        save(`slitscan_pull-ats-${session}-${imgCount}.png`);
    }
    imgCount++;
}



