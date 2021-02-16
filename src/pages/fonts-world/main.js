import '../common.css';
import * as dat from 'dat.gui';
import * as Stats from 'stats.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Base
 */
const canvas = document.querySelector('#canvas');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


/**
 * Font
 */
const fontLoader = new THREE.FontLoader();
let font = null;
fontLoader.load('/three-journey/fonts/helvetiker_regular.typeface.json', result => {
    font = result;
    onFontLoaded();
});


/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();
const colofulMatcapTexture = textureLoader.load('/three-journey/textures/matcap/colorful.png');
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envTexture = cubeTextureLoader.load([
    '/three-journey/textures/env/grass/px.png',
    '/three-journey/textures/env/grass/nx.png',
    '/three-journey/textures/env/grass/py.png',
    '/three-journey/textures/env/grass/ny.png',
    '/three-journey/textures/env/grass/pz.png',
    '/three-journey/textures/env/grass/nz.png'
]);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/**
 * Resize
 */
document.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/**
 * Scene
 */
const scene = new THREE.Scene();


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

camera.position.set(0, 0, 30);
camera.lookAt(scene.position);

scene.add(camera);


/**
 * Objects
 */

function onFontLoaded() {
    const textGeometry = new THREE.TextGeometry('Three.js Journey', {
        font,
        size: 2,
        height: 0.2,
        curveSegments: 6
    });
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: colofulMatcapTexture });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    scene.add(textMesh);
}

const colors = {
    standardMaterial: 0xffffff
};
const objects = [];
const standardMaterial = new THREE.MeshStandardMaterial({
    color: colors.standardMaterial,
    envMap: envTexture,
    metalness: 0.7,
    roughness: 0.2
});
const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 100);
window.geometry = torusGeometry;
for (let i = 0; i < 2000; i++) {
    let mesh = new THREE.Mesh(torusGeometry, standardMaterial);
    mesh.position.set(rand(-200, 200), rand(-200, 200), rand(-200, 200));
    mesh.rotation.set(Math.PI * Math.random(), Math.PI * Math.random(), Math.PI * Math.random());
    let scale = Math.random() * 3;
    mesh.scale.set(scale, scale, scale)
    objects.push(mesh);
}
scene.add(...objects);


/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 0, -30);
scene.add(pointLight);


/**
 * Debug
 */
const gui = new dat.GUI({ width: 400 });
const standardMaterialGUI = gui.addFolder('standardMaterial');
standardMaterialGUI.open();
standardMaterialGUI.addColor(colors, 'standardMaterial')
    .onChange(() => {
        standardMaterial.color.set(colors.standardMaterial);
    })
    .name('color')

standardMaterialGUI.add(standardMaterial, 'metalness')
    .min(0)
    .max(10)
    .step(0.01)
    .name('metalness');

standardMaterialGUI.add(standardMaterial, 'roughness')
    .min(0)
    .max(10)
    .step(0.01)
    .name('roughness');


const stats = new Stats();
document.body.append(stats.dom);

/**
 * utils
 */

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const clock = new THREE.Clock();
function tick() {
    stats.begin();
    controls.update();

    pointLight.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
    );

    let delta = clock.getDelta();
    objects.forEach(obj => {
        obj.rotation.x += delta;
        obj.rotation.y += delta;
        obj.rotation.z += delta;
    });

    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(tick);
};
tick();

