import React, { useEffect, useState, useRef } from 'react';
import rock from './assets/rock.png'; 
import paper from './assets/paper.png';
import scissors from './assets/scissors.png';
import './App.css';
import Object from './components/Object.js';

function moveObject(object) {
  const speed=1.6;
  object.x+=Math.cos(object.angle)*speed;
  object.y+=Math.sin(object.angle)*speed;
  if (object.x<0 || object.x>window.innerWidth-32) {
    object.angle+=Math.PI;
  }
  if (object.y<0 || object.y>window.innerHeight-32) {
    object.angle=-object.angle;
  }
}

function App() {
  // create array of objects
  const [objects, setObjects] = useState(initializeObjects());
  const selectedRef = useRef(null); // Initialize with initial values
  const mouseCORef = useRef({ x: 0, y: 0 }); // Initialize with initial values

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;

      // Update state with mouse coordinates
      mouseCORef.current = {x: x-16, y: y-16}
    };

    // Attach the event listener when the component mounts
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleClick = (event) => {
    // Retrieve mouse click coordinates
    const x = event.clientX;
    const y = event.clientY;
  
    let closer=null;
    for (let i = 0; i < objects.length; i++) {
      if (Math.abs(x-objects[i].x+16)<100 && Math.abs(y-objects[i].y+16)<100) {
        if (closer===null || Math.abs(x-objects[i].x)<Math.abs(x-closer.x)) {
          closer=objects[i];
        }
      }
    }
    if (closer!==null && selectedRef.current != closer) {
      selectedRef.current = closer;
    }
    else {
      selectedRef.current = null;
    }
  };

  function initializeObjects() {
    const obj=[];
    for (let i = 0; i < 36; i++) {
      var img=rock;
      var name="rock";
      if (i%3===0) {
        img=paper;
        name="paper";
      }
      else if (i%3===1) {
        img=scissors;
        name="scissors";
      }
      var x;
      var y;
      var bool=true;
      while (bool) {
        x=Math.floor(Math.random() * (window.innerWidth-32));
        y=Math.floor(Math.random() * (window.innerHeight-32));
        bool=false;
        for (let j = 0; j < obj.length; j++) {
          if (Math.abs(x-obj[j].x)<32 && Math.abs(y-obj[j].y)<32) {
            bool=true;
            break;
          }
        }
      }
      var angle=Math.floor(Math.random() * 2 * Math.PI);
      obj.push({icon: img, name: name, x:x, y:y, angle:angle, key:i});
    }
    return obj;
  }

  function moveToward(object1, object2, mouse, run) {
    let newAngle;
    let rotation=0.01;
    if (run) {
      rotation=-rotation;
    }

    if (mouse && mouseCORef.current!==null){
      newAngle=Math.atan2(mouseCORef.current.y-object1.y, mouseCORef.current.x-object1.x);
      object1.angle=newAngle;
      moveObject(object1);
      return;
    }
    else {
      newAngle=Math.atan2(object2.y-object1.y, object2.x-object1.x);
    }
    if (object1.angle<newAngle) {
      object1.angle+=rotation;
    }
    else if (object1.angle>newAngle) {
      object1.angle-=rotation;
    }
    moveObject(object1);
  }
  
  function moveTowardList(rocks, scissorss, papers){
    for (let i=0; i<rocks.length; i++) {
      if (selectedRef.current===null || rocks[i].key!==selectedRef.current.key) {
        let closer=null;
        for (let y=0; y<scissorss.length; y++) {
          let distance=Math.sqrt(Math.pow(rocks[i].x-scissorss[y].x, 2)+Math.pow(rocks[i].y-scissorss[y].y, 2));
          if (distance<150){
            if (closer===null || distance<Math.sqrt(Math.pow(rocks[i].x-closer.x, 2)+Math.pow(rocks[i].y-closer.y, 2))) {
              closer=scissorss[y];
            }
          }
        }
        let run=false;
        for (let y=0; y<papers.length; y++) {
          let distance=Math.sqrt(Math.pow(rocks[i].x-papers[y].x, 2)+Math.pow(rocks[i].y-papers[y].y, 2));
          if (distance<150){
            if (closer===null || distance<Math.sqrt(Math.pow(rocks[i].x-closer.x, 2)+Math.pow(rocks[i].y-closer.y, 2))) {
              closer=papers[y];
              run=true;
            }
          }
        }
        if (closer!==null) {
          moveToward(rocks[i], closer, false, run);
        }
        else {
          moveObject(rocks[i]);
        }
      }
      else{
        moveToward(rocks[i], {}, true, false);
      }
    }
  }

  function checkCollision() {
    const newObjects=[...objects];
    const rocks=[];
    const papers=[];
    const scissorss=[];
    for (let i=0; i<newObjects.length; i++) {
      if (newObjects[i].name==="rock"){
        rocks.push(newObjects[i]);
      }
      else if (newObjects[i].name==="paper"){
        papers.push(newObjects[i]);
      }
      else if (newObjects[i].name==="scissors"){
        scissorss.push(newObjects[i]);
      }
      for (let y=i+1; y<newObjects.length; y++) {
        if (Math.abs(newObjects[i].x-newObjects[y].x)<32 && Math.abs(newObjects[i].y-newObjects[y].y)<32) {
          if (newObjects[i].name==="rock" && newObjects[y].name==="paper") {
            newObjects[i].name="paper";
            newObjects[i].icon=paper;
          }
          else if (newObjects[i].name==="rock" && newObjects[y].name==="scissors") {
            newObjects[y].name="rock";
            newObjects[y].icon=rock;
          }
          else if (newObjects[i].name==="paper" && newObjects[y].name==="rock") {
            newObjects[y].name="paper";
            newObjects[y].icon=paper;
          }
          else if (newObjects[i].name==="paper" && newObjects[y].name==="scissors") {
            newObjects[i].name="scissors";
            newObjects[i].icon=scissors;
          }
          else if (newObjects[i].name==="scissors" && newObjects[y].name==="rock") {
            newObjects[i].name="rock";
            newObjects[i].icon=rock;
          }
          else if (newObjects[i].name==="scissors" && newObjects[y].name==="paper") {
            newObjects[y].name="scissors";
            newObjects[y].icon=scissors;
          }
        }
      }
    }
    moveTowardList(rocks, scissorss, papers)
    moveTowardList(scissorss, papers, rocks)
    moveTowardList(papers, rocks, scissors)
  
    setObjects(newObjects);
  
  }

  useEffect(() => {
    // This function will be executed when the component mounts
    const intervalId = setInterval(() => {
      // This code will run every second
      checkCollision();
    }, 10); // 1000 milliseconds = 1 second

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App" onClick={handleClick} style={{
      width: window.innerWidth,
      height: window.innerHeight,
      background: 'lightgrey',
      position: 'relative', // Necessary for accurate coordinates
    }}>
      <text style={{
        position: 'absolute',
        left: 20,
        top: 20,
        fontSize: 30,
        color: 'black',
      }}>Click on an object to control it!</text>
      <a href="https://github.com/Looki-fr/RockPaperScissor" target="_blank" rel="noopener noreferrer" style={{
        position: 'absolute',
        left: window.innerWidth-100,
        top: window.innerHeight-60,
        fontSize: 20,
        color: 'blue',
      }}>GitHub</a>
      <div className="Objects">
        {objects.map((object, index) => (
          <Object {...object} selected={selectedRef.current===object}/>
        ))}
      </div>
    </div>
  );
}

export default App;
