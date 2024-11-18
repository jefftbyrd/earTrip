'use client';
import { NextReactP5Wrapper } from '@p5-wrapper/next';
import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

// import { testSounds } from '../../../database/testSounds';

// import styles from '../sketch.module.scss';

const sketch = (p5) => {
  let shapes = [],
    synth,
    sampleDraw,
    playRate;
  let multiplayer;
  let sounds2;
  let sounds3;
  let player;
  let shapesButton;
  let name;
  let radius = 150;

  p5.updateWithProps = (props) => {
    if (props.sounds) {
      sounds2 = { ...props.sounds };
    }
  };

  p5.setup = () => {
    p5.createCanvas(1200, 800);
    multiplayer = new Tone.Players({ debug: true }).toDestination();
    shapesButton = p5.createButton('Generate Shapes');
    shapesButton.position(p5.width / 2, 40);
    shapesButton.mousePressed(p5.generateShapes);
    shapesButton.style('color', 'blue');
  };

  p5.generateShapes = () => {
    sounds2.results.map((sound) => {
      let x = p5.random(p5.width);
      let y = p5.random(p5.height);
      let r = p5.random(40, 200);
      let id = sound.id;
      let name = sound.name;
      let b = new Shape(x, y, r, id, name);
      shapes.push(b);
      multiplayer.add(sound.id, sound.previews['preview-lq-mp3']);
    });
    console.log('multiplayer', multiplayer);
    console.log('shapes', shapes);
  };

  p5.draw = () => {
    p5.background(0);
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].rollover(p5.mouseX, p5.mouseY);
      // shapes[i].move();
      shapes[i].show();
      shapes[i].showName();
    }
  };

  class Shape {
    constructor(x, y, r, id, name) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.brightness = 0;
      this.isClicked = false;
      // multiplayer.player(id).state = 'started';
      this.id = id;
      this.name = name;
    }

    rollover(px, py) {
      let d = p5.dist(px, py, this.x, this.y);
      if (d < this.r) {
        // boolean flag
        // use for anytime you want something to only happen once
        // if the mouse is pressed set clicked to true
        // directly after the mouse is pressed set it to false to remove double triggers
        if (p5.mouseIsPressed && !this.isClicked) {
          // switch the boolean so we don't get
          // double triggers
          // we need this since mouseIsPressed will
          // happen continuously in the draw loop
          this.isClicked = true;
          console.log(this.isClicked);
          this.playSound(this.id);
        }

        // this.brightness = 255;
      } else {
        // reset the boolean flag when we move
        // off the circle
        if (this.isClicked) {
          this.isClicked = false;
        }

        this.brightness = 0;
      }
    }

    move() {
      this.x = this.x + p5.random(-2, 2);
      this.y = this.y + p5.random(-2, 2);
    }

    show() {
      if (multiplayer.player(this.id).state === 'started') {
        p5.fill('green');
        // shapes[i].move();
        this.x = this.x + p5.random(-2, 2);
        this.y = this.y + p5.random(-2, 2);
      } else {
        p5.fill('red');
      }
      p5.stroke(255);
      p5.strokeWeight(4);
      // p5.fill(this.brightness, 125);
      // p5.fill('green');
      p5.ellipse(this.x, this.y, this.r * 2);
      // p5.text.addClass('soundName');
      // name = p5.createDiv(this.name, this.x, this.y);
      // Add a class to the div.
      // name.addClass('soundName');
      // if (multiplayer.player(this.id).state === 'started') {
      //   // shape.fill('yellow');
      //   p5.fill('red');
      // }
      console.log('player state', multiplayer.player(this.id).state);
    }

    showName() {
      name = p5.text(this.name, this.x, this.y);
      name.stroke(0);
      name.fill('yellow');
      name.textAlign(p5.CENTER, p5.CENTER);
      name.textSize(22);
    }

    playSound(id) {
      if (multiplayer.player(id).state === 'started') {
        multiplayer.player(id).stop();
      } else {
        multiplayer.player(id).start();
      }
    }
  }

  // Run when the mouse/touch is down.
  p5.mousePressed = () => {
    if (shapes.length > 0) {
      for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i],
          distance = p5.dist(p5.mouseX, p5.mouseY, shape.x, shape.y);
        if (distance < radius) {
          shape.active = true;
          shape.color = '#f00';
        } else {
          shape.active = false;
          shape.color = '#000';
        }
      }
    }
    // Prevent default functionality.
    return false;
  };

  p5.mouseDragged = () => {
    if (shapes.length > 0) {
      for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        if (shape.active) {
          shape.x = p5.mouseX;
          shape.y = p5.mouseY;
          break;
        }
      }
    }
    // Prevent default functionality.
    return false;
  };
};

export default function Sketch11() {
  const [isLoading, setIsLoading] = useState(true);
  const [sounds, setSounds] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?filter=%257B%2521geofilt%2520sfield%3Dgeotag%2520pt%3D41.7326%2C-4.7437%2520d%3D25%257D%2520tag%3Afield-recording&fields=previews%2Cname%2Cdescription%2Cusername%2Cid&page_size=5  &token=${process.env.NEXT_PUBLIC_FREESOUND_API_KEY}`,
      );
      const json = await response.json();
      setSounds(json);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    // early return
    return 'Loading...';
  }

  return <NextReactP5Wrapper sketch={sketch} sounds={sounds} />;
}
