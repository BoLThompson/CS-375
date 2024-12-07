import './style.css'
import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import arwingobj from "./models/arwing/arwing.obj?url"
import arwingmtl from "./models/arwing/arwing.mtl?url"
import asteroidobj from "./models/asteroid/10464_Asteroid_v1_Iterations-2.obj?url"
import asteroidobj2 from "./models/rock/Rock1.obj?url"
import asteroidmtl from "./models/asteroid/10464_Asteroid_v1_Iterations-2.mtl?url"
import asteroidmtl2 from "./models/rock/Rock1.mtl?url"
import { randFloat, randInt } from 'three/src/math/MathUtils.js';

const CAMDISTANCE = 30;

class Actor {
  constructor(x,y,z, scene, model = {geometry: false, material: false}, onload = ()=>{}) {
    this.position = new THREE.Vector3(x,y,z);
    this.scale = new THREE.Vector3(1,1,1);
    this.rotation = new THREE.Vector3(0,0,0);
    this.model = false;
    this.drawMethod = () => {};
    this.stepMethod = (me, delta) => {};
  
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    new Promise((resolve,reject) => {
      mtlLoader.load(
        model.material,
        resolve
      );
    })
    .then(materials => {
      return new Promise((resolve, reject) => {
        objLoader.setMaterials(materials);
        objLoader.load(model.geometry, resolve);
      })
    })
    .then((obj)=>{
      this.model = obj;
      this.model.matrixAutoUpdate = false;
      scene.add(this.model);
      onload();
    })
  }

  destroy(scene) {
    scene.remove(this.model);
  }

  draw() {
    if (this.model)
      this.drawMethod(this.position, this.scale, this.rotation, this.model.matrix);
  }

  step(delta) {
    if (this.stepMethod) return this.stepMethod(this, delta);
    else return false;
  }
}

async function doGame() {
  let actors = [];
  const scene = new THREE.Scene();
  //fov, aspect ratio, near, far
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(CAMDISTANCE);

  var keyLight = new THREE.DirectionalLight(
    new THREE.Color('hsl(30, 100%, 75%)'), 1.0
  );
  keyLight.position.set(-100,0,100);
  scene.add(keyLight);

  var fillLight = new THREE.DirectionalLight(
    new THREE.Color('hsl(240, 100%, 75%)'), 1.0
  );
  fillLight.position.set(100,0,100);
  scene.add(fillLight);

  var backLight = new THREE.DirectionalLight(
    0xFFFFFF, 1.0
  );
  backLight.position.set(100,0,-100).normalize();
  scene.add(backLight);
  
  let ship;
  await new Promise((resolve, reject) => {
    ship = new Actor(0,0,0,
      scene,
      {
        geometry: arwingobj,
        material: arwingmtl,
      },
      resolve
    );
  })

  actors.push(ship);

  ship.target = new THREE.Vector2();
  
  ship.drawMethod = (position, scale, rotation, matrix) => {
    matrix.identity();
    matrix.premultiply(
      new THREE.Matrix4().makeScale(2,2,2)
    )
    matrix.premultiply(
      new THREE.Matrix4().makeRotationY(
        -Math.PI
      )
    );
    matrix.premultiply(
      new THREE.Matrix4().makeTranslation(
        new THREE.Vector3(
          position.x,
          position.y - 2.5,
          position.z
        )
      )
    );
  }

  ship.stepMethod = (me, delta) => {
    let pos = new THREE.Vector2(me.position.x, me.position.y);

    const shipTrack = new THREE.Vector2().subVectors(me.target, pos);

    const followSpeed = 0.25//Math.round(0.25 * delta * 1000) / 1000;
    // console.log(followSpeed);

    if (shipTrack.length() < followSpeed) {
      pos.x = me.target.x;
      pos.y = me.target.y;
    }
    else {
      shipTrack.normalize().multiplyScalar(followSpeed);
      // console.log(shipTrack);
      pos.addVectors(
        pos,
        shipTrack
      );
    }

    pos.x = Math.max(-5,Math.min(pos.x,5))
    pos.y = Math.max(-5,Math.min(pos.y,5))

    me.position.x = pos.x;
    me.position.y = pos.y;

    return false;
  }

  function setupMouseControl(element) {

    let active = true;

    function setActive(val) {
      active = val;
      // if (val) {
      //   document.getElementById("bg").style.cursor = "none";
      // }
      // else {
      //   document.getElementById("bg").style.cursor = "unset";
      // }
    }

    function move(e) {
      if (!active) return;
    
      let minTarget = new THREE.Vector2();
      let maxTarget = new THREE.Vector2();
      camera.getViewBounds(CAMDISTANCE,minTarget,maxTarget);
      
      ship.target = new THREE.Vector2(
        ((e.clientX / window.innerWidth)*2-1) * maxTarget.x,
        (-(e.clientY / window.innerHeight)*2+1) * maxTarget.y
      );
    }

    element.addEventListener('click', (e) => {
      setActive(true);
      move(e);
    })
    element.addEventListener('keydown', (e) => {
      if (e.key == "Escape") setActive(false);
    })
    element.addEventListener('mousemove', move);

    setActive(true);
  }

  setupMouseControl(document.body);


  let secondsPassed;
  let oldTimeStamp;
  const fps = 60;
  let nextSpawn = 1;
  // console.log(nextSpawn);

  function animate(timeStamp) {
    if (!oldTimeStamp) oldTimeStamp = secondsPassed;
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    let delta = secondsPassed / (1.0/fps);

    if (secondsPassed)
      nextSpawn -= secondsPassed;
    // console.log(nextSpawn);

    if (nextSpawn <= 0) {
      // console.log("find rock lol")
      nextSpawn = randFloat(.25,1);

      let asteroid;
      let oddOne = randInt(0,4) % 4 === 0;
      new Promise((resolve, reject) => {
        asteroid = new Actor(0,0,0,
          scene,
          {
            geometry: oddOne ? asteroidobj2 : asteroidobj,
            material: oddOne ? asteroidmtl2 : asteroidmtl,
          },
          resolve
        );
      }).then(()=> {
        asteroid.position.z = -300;
        asteroid.position.x = randFloat(-5,5);
        asteroid.position.y = randFloat(-5,5);
        asteroid.rotation.x = randFloat(0,2*Math.PI);
        asteroid.rotation.y = randFloat(0,2*Math.PI);
        asteroid.rotation.z = randFloat(0,2*Math.PI);
        asteroid.scale.x = asteroid.scale.y = asteroid.scale.z = oddOne ? 0.1  : 0.001

        actors.push(asteroid);
        // console.log("push rock lol")
      })
      
      asteroid.drawMethod = (position, scale, rotation, matrix) => {
        matrix.identity();
        matrix.premultiply(
          new THREE.Matrix4().makeScale(scale.x,scale.y,scale.z)
        );
        matrix.premultiply(
          new THREE.Matrix4().makeRotationX(
            rotation.x
          )
        );
        matrix.premultiply(
          new THREE.Matrix4().makeRotationY(
            rotation.y
          )
        );
        matrix.premultiply(
          new THREE.Matrix4().makeRotationZ(
            rotation.z
          )
        );
        matrix.premultiply(
          new THREE.Matrix4().makeTranslation(
            new THREE.Vector3(
              position.x,
              position.y,
              position.z
            )
          )
        );
      }

      asteroid.stepMethod = (me, delta) => {
        me.position.z += 1;

        if (me.position.z >= CAMDISTANCE) {
          return true;
        }
        return false;
      }
    }

    ship.step(delta);

    for (let i = 1; i < actors.length; ++i) {
      if (actors[i].step(delta)) {
        // console.log(actors.length)
        actors[i].destroy(scene);
        actors.splice(i,1);
        --i;
      }
      else {
        let diff = new THREE.Vector3();
        diff.subVectors(ship.position, actors[i].position);
        if (Math.abs(diff.length()) < 2) {
          window.alert("you crashed");
          actors[i].destroy(scene);
          actors.splice(i,1);
          --i;
        }
      }
      // actors[i].step(delta)
    }

    for (let a of actors) {
      a.draw();
    }
    ship.draw();
    
    renderer.render(scene,camera);

    requestAnimationFrame(animate);
  }

  animate();

}

doGame();