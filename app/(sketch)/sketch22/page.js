'use client';
import { NextReactP5Wrapper } from '@p5-wrapper/next';
import * as Tone from 'tone';
import styles from '../sketch.module.scss';

const sketch = (p5) => {
  let wetMix;
  let speed;
  let meter;
  let delay;
  let player;
  let playButton;
  let reverb;
  let revMix;
  // let soundObj1;
  let toneStart = 0;
  let soundObj1;
  let soundObject;
  let diameter = 300;
  let dragging = false;
  let soundObjX = p5.windowWidth / 2;
  let soundObjY = p5.windowHeight / 2;
  let channel;
  let panX;
  let volY;

  p5.setup = () => {
    player = new Tone.Player({
      url: '/sounds/rattle.wav',
    });
    meter = new Tone.Meter({ normalRange: true, smoothing: 0.9 });
    reverb = new Tone.Reverb();
    player.connect(meter);
    // delay = new Tone.FeedbackDelay();
    channel = new Tone.Channel();
    player.connect(channel);
    channel.connect(reverb);
    reverb.toDestination();
    // wetMix = p5.createSlider(0, 1, 1, 0);
    // wetMix.style('width', '200px');
    // wetMix.position(p5.width / 2, p5.height / 2 + 60);
    // revMix = p5.createSlider(0, 1, 1, 0);
    // revMix.style('width', '200px');
    // revMix.position(p5.width / 2, p5.height / 2 + 180);
    // player.connect(delay);
    // delay.connect(reverb);
    // reverb.toDestination();
    speed = p5.createSlider(0.01, 4, 1, 0);
    speed.style('width', '200px');
    speed.position(p5.width / 2, p5.height / 2 + 120);
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.colorMode(p5.HSB);
    p5.textAlign(p5.LEFT);
    // p5.textColor('white');
    p5.noStroke();
    p5.textOutput();
    playButton = p5.createButton('play');
    playButton.position(p5.width / 2, 40);
    playButton.mousePressed(p5.play1);
    playButton.style('color', 'deeppink');
  };

  p5.draw = () => {
    // delay.wet.value = wetMix.value();
    // reverb.wet.value = revMix.value();
    player.playbackRate = speed.value();
    const meterLevel = meter.getValue();
    p5.background(0);

    if (dragging) {
      soundObjX = p5.mouseX;
      soundObjY = p5.mouseY;
    }

    // const circleHue = p5.map(p5.mouseX, 0, p5.width, 0, 360);
    let meterRead = p5.map(meterLevel, 0, 0.3, 0, 200);
    let diameter = p5.map(soundObjY, 0, p5.windowHeight, 50, 600);
    let revWet = p5.map(soundObjY, 0, p5.windowHeight, 1, 0);
    diameter += meterRead;
    panX = p5.map(soundObjX, 0, p5.windowWidth, -1, 1);
    volY = p5.map(soundObjY, 0, p5.windowHeight, -12, 6);
    if (panX > 1) {
      panX = 1;
    }
    if (panX < -1) {
      panX = -1;
    }
    if (revWet > 1) {
      revWet = 1;
    }
    if (revWet < 0) {
      revWet = 0;
    }
    channel.pan.value = panX;
    channel.volume.value = volY;
    reverb.wet.value = revWet;
    // if (diameter < 300) {
    //   diameter = 300;
    // }
    // p5.text(p5.int(wetMix.value() * 100) + '% delay', 30, 30);
    p5.text(speed.value().toFixed(2) + ' speed', 30, 90);
    // p5.text(p5.int(revMix.value() * 100) + '% reverb', 30, 150);
    p5.text(`X: ${soundObjX}`, 30, 220);
    p5.text(`Y: ${soundObjY}`, 30, 250);
    p5.text(`panX: ${panX}`, 30, 280);
    p5.text(`volY: ${volY}`, 30, 310);

    // soundObjX = p5.width / 2;
    // soundObjY = p5.height / 2;

    const d1 = p5.dist(p5.mouseX, p5.mouseY, soundObjX, soundObjY);
    // this is the distance I'm checking for in my circle.

    // this will change the fill of my circle when I hover

    // if (d1 < 100) {
    //   p5.fill('yellow');
    // } else {
    //   p5.fill('red');
    // }

    soundObj1 = p5.ellipse(soundObjX, soundObjY, diameter);
    soundObj1.fill('red');

    // this if/else statement will make sure
    // the background changes color ONLY if the
    // mouseIsPressed AND the mouse is in the circle.

    // if (p5.mouseIsPressed && d1 < 100) {
    //   p5.play1();
    // }

    if (player.state === 'started') {
      soundObj1.fill('yellow');
    }

    // soundObj1.position();
    // p5.text(soundObjPos);

    // p5.text(soundObj1.x, 30, 200);
    console.log('soundObjX', soundObjX);
    console.log('soundObjY', soundObjY);
  }; // End DRAW

  p5.mousePressed = () => {
    // check if mouse is over the ellipse
    if (p5.dist(soundObjX, soundObjY, p5.mouseX, p5.mouseY) < diameter / 2) {
      dragging = true;
    }
  };

  p5.mouseReleased = () => {
    dragging = false;
  };

  p5.play1 = async () => {
    if (toneStart === 0) {
      await Tone.start();
      toneStart = 1;
    }
    if (player.state === 'started') {
      player.stop();
    } else {
      player.start();
    }
  };
};

export default function Sketch1() {
  return <NextReactP5Wrapper sketch={sketch} />;
}
