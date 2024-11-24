import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();

//fov, aspect ratio, near, far
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene,camera);

const geometry = new THREE.ConeGeometry(3,10,10,1,false,0/*,theta? */);

const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe:true});

const cone = new THREE.Mesh(geometry,material);
cone.matrixAutoUpdate = false;

scene.add(cone);

function animate() {
  requestAnimationFrame(animate);
  
  renderer.render(scene,camera);
}
animate();

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
      new THREE.Matrix4().makeRotationX(
        -Math.PI/2
      )
    );
    cone.matrix.premultiply(
      new THREE.Matrix4().makeTranslation(
        new THREE.Vector3(
          (e.clientX - window.innerWidth / 2)/10,
          (e.clientY - window.innerHeight / 2)/-10,
          -40
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