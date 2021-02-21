let capture;
let w = 320;
let h = 240;
let session = ""+Math.floor(Date.now());
session = session.slice(session.length-6, session.length);
let imgCount = 0;
let paused = false;
let showScanLine = false;
let canvas;
let slitX;
let startX;

function setup() {
  canvas = createCanvas(innerWidth, h);
  canvas.parent('#sketch-parent');
  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  background(255);
  startX = w/4;
  slitX = w/5;
}

function draw() {

  capture.loadPixels();
  loadPixels();

  if(capture.pixels.length > 0 && frameCount > 130) {
    // draw the desired portion of the video to the canvas
    for(let x = startX; x < startX+slitX; x++){
      for(let y = 0; y < h; y++) {
        let index = ((x-startX) + (y * width)) * 4;
        let vidIndex = ((w-x) + (y * w)) * 4;

        if(x == startX+slitX-2 && showScanLine){
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
    slitX-=2;
  } else if (keyIsDown(RIGHT_ARROW) && slitX < ((3*w)/4)-2) {
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
      select('.fps').html(" " + Math.floor(frameRate()));
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

$('#darkmode-toggle').click(function(){
  if($('#darkmode-toggle').is(':checked')){
    $('body').css('background', 'black').css('color', 'white');
    $('li').css('background', '#333');
    $('.text-hover').css('color', '#ccc');
    $('header').css('background', 'black');
  } else {
    $('body').css('background', 'white').css('color', 'black');
    $('li').css('background', '#eee');
    $('.text-hover').css('color', '#888');
    $('header').css('background', 'white');
  }
})

setTimeout(function(){
  $('header').removeClass('fade');
}, 10001);



