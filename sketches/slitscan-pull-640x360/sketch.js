let capture;
let w = 640;
let h = 360;
let session = ""+Math.floor(Date.now());
session = session.slice(session.length-6, session.length);
let imgCount = 0;
let paused = false;
let showScanLine = false;
let canvas;
let slitX;

function setup() {
  canvas = createCanvas(innerWidth, h);
  canvas.parent('#sketch-parent');
  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  background(255);
  loadPixels();
  slitX = w/5;
}

function draw() {

  capture.loadPixels();

  if(capture.pixels.length > 0) {
    // draw the desired portion of the video to the canvas
    for(let x = 0; x < slitX; x++){
      for(let y = 0; y < h; y++) {
        let index = (x + (y * width)) * 4;
        let vidIndex = ((w-x) + (y * w)) * 4;

        if(x == slitX-2 && showScanLine){
          pixels[index] = capture.pixels[vidIndex]+255;
          pixels[index+1] = capture.pixels[vidIndex+1]-40;
          pixels[index+2] = capture.pixels[vidIndex+2]-40;
        } else {
          pixels[index] = capture.pixels[vidIndex];
          pixels[index+1] = capture.pixels[vidIndex+1];
          pixels[index+2] = capture.pixels[vidIndex+2];
        }
      }
    }

    for(let x = width; x > slitX-1; x--) {
      for(let y = 0; y < h; y++) {
        let index = (x + (y * width)) * 4;
        let slitIndex = ((x-1) + (y * width)) * 4;
        pixels[index] = pixels[slitIndex];
        pixels[index+1] = pixels[slitIndex+1];
        pixels[index+2] = pixels[slitIndex+2];
      }
    }
    updatePixels();
  }
  
  drawFPS();

  if(frameCount > width-(width/6) && frameCount % 600 == 0) {
    screencap();
  }
  if(keyIsDown(LEFT_ARROW) && slitX > 2) {
    slitX--;
  } else if (keyIsDown(RIGHT_ARROW) && slitX < w-2) {
    slitX+=2;
  }
}

function windowResized() {
  resizeCanvas(innerWidth, h);
  background(255);
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
  if(key == ' ') {
    paused = !paused;
    if(paused) {
      noLoop();
    } else {
      loop();
    }
  } else if(key == 's') {
    save(`slitscan_smear-ats-${session}-${imgCount}.png`);
    imgCount++;
  } else if(key == 'v') {
    showScanLine = !showScanLine;
  } 
}

function screencap() {
  if($('#save-img-toggle').is(':checked')) {
    save(`slitscan_pull-ats-${session}-${imgCount}.png`);
  }
  imgCount++;
}



