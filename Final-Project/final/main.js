import './style.css'
import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import arwingobj from "./models/arwing/arwing.obj?url"
import arwingmtl from "./models/arwing/arwing.mtl?url"


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

  let cone;
  
  const loader = new OBJLoader();
  loader.load(arwingobj, (obj)=>{
    cone = obj;
    cone.matrixAutoUpdate = false;
    scene.add(cone);
  });

  

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

      cone.matrix.identity();
      cone.matrix.premultiply(
        new THREE.Matrix4().makeScale(2,2,2)
      )
      cone.matrix.premultiply(
        new THREE.Matrix4().makeRotationX(
          -Math.PI
        )
      );
      cone.matrix.premultiply(
        new THREE.Matrix4().makeTranslation(
          new THREE.Vector3(
            (e.clientX - window.innerWidth / 2)/20,
            (e.clientY - window.innerHeight / 2)/-20,
            0//-40
          )
        )
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

  

  function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene,camera);
  }
  animate();

}

doGame();

function init() {

  // const mtlLoader = new THREE.MaterialLoader();
  // mtlLoader.setTextures({
  //   body: new THREE.Texture(),
  //   cockpit: new THREE.Texture(),
  //   logo: new THREE.Texture()
  // })
  // mtlLoader.load(arwingmtl, (mtl)=>{
    // console.log(mtl);
  
    const loader = new OBJLoader();
    loader.load(arwingobj, (obj)=>{
      cone = obj;
      cone.matrixAutoUpdate = false;
      scene.add(cone);
    }, ()=>{}, console.log);
  // });
}
// init();

// const geometry = new THREE.ConeGeometry(3,10,10,1,false,0/*,theta? */);

// const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe:true});

// const cone = new THREE.Mesh(object,material);

// scene.add(cone);