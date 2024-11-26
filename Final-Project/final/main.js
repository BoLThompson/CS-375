import './style.css'
import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import arwingobj from "./models/arwing/arwing.obj?url"
import arwingmtl from "./models/arwing/arwing.mtl?url"

class Actor {
  constructor(x,y,z, scene, model = {geometry: false, material: false}, onload = ()=>{}) {
    this.position = new THREE.Vector3(x,y,z);
    this.scale = new THREE.Vector3(1,1,1);
    this.model = false;
    this.drawMethod = () => {};
  
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

  draw() {
    if (this.model)
      this.drawMethod(this.position, this.scale, this.model.matrix);
  }
}

function doGame() {
  const scene = new THREE.Scene();
  //fov, aspect ratio, near, far
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);

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

  const ship = new Actor(0,0,0,
    scene,
    {
      geometry: arwingobj,
      material: arwingmtl,
    }
  );
  
  ship.drawMethod = (position, scale, matrix) => {
    matrix.identity();
    matrix.premultiply(
      new THREE.Matrix4().makeScale(3,3,3)
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
          position.y,
          position.z
        )
      )
    );
  }

  function setupMouseControl(element) {
    let active = true;

    function setActive(val) {
      active = val;
      if (val) {
        document.getElementById("bg").style.cursor = "none";
      }
      else {
        document.getElementById("bg").style.cursor = "unset";
      }
    }

    function move(e) {
      if (!active) return;
      
      ship.position.x = ((e.clientX / window.innerWidth)*2-1) * 10;
      ship.position.y = (-(e.clientY / window.innerHeight)*2+1) * 10;

      ship.draw();
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

  

  function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene,camera);
  }
  animate();

}

doGame();