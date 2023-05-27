import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.y = 1;
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

async function init() {
  const container = new THREE.Group();
  scene.add(container);
  const vsh = await fetch('./vert.glsl');
  const fsh = await fetch('./frag.glsl');
  const geometry = new THREE.IcosahedronGeometry(6, 2);
  const uniforms = {
    // @time = initial hue (0 = red, 1 = purple, 2 = blue, 4 = green, ...)
    time: { value: 1 }
  };
  const bgMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: await vsh.text(),
    fragmentShader: await fsh.text(),
    side: THREE.BackSide,
  });
  
  const bgSphere = new THREE.Mesh(geometry, bgMat);
  bgSphere.rotation.y = Math.PI * -0.5;
  container.add(bgSphere);
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const glassMat = new THREE.MeshPhysicalMaterial({
    roughness: 0.0,
    transmission: 1.0,
    transparent: true,
    thickness: 3.0,
  });
  function getThing (index) {
    const hue = Math.random() > 0.5 ? 0.15 : 0.6;
    const color = new THREE.Color().setHSL(hue, 1.0, 0.5);
    const flatMat = new THREE.MeshBasicMaterial({ color });
    const mat = Math.random() > 0.5 ? flatMat : glassMat;
    const mesh = new THREE.Mesh(geo, mat); 
    const range = 4;
    mesh.position.x = Math.random() * range - range * 0.5;
    mesh.position.y = Math.random() * range - range * 0.5;
    mesh.position.z = Math.random() * range - range * 0.5;
    mesh.rotation.x = Math.random() * Math.PI * 2;
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.rotation.z = Math.random() * Math.PI * 2;
    mesh.scale.setScalar(0.25 + Math.random() * 0.5 + 0.5);
    return mesh;
  }

  const numThings = 20;
  for (let i = 0; i < numThings; i++) {
    const thing = getThing(i);
    container.add(thing);
  }

  function animate(t) {
    requestAnimationFrame(animate);
    container.rotation.y += 0.001;
    uniforms.time.value = t * 0.0002;
    renderer.render(scene, camera);
  }

  animate();
}
init();