import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from 'three';

type Slide = {
  name: string,
  draw: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  )
    => ((time: number) => void),
}

function App() {

  const refContainer = useRef<HTMLDivElement>(null);

  const [artIndex, setArtIndex] = useState(0);
  const slides: Slide[] = [
    {
      name: 'Snowman',
      draw: drawSnowman,
    },
    {
      name: 'Office Building',
      draw: drawBuilding,
    },
    {
      name: 'Cat',
      draw: drawCat,
    },
    {
      name: 'Space Station',
      draw: drawSpaceStation,
    },
    {
      name: 'Wind Farm',
      draw: drawWindTurbine,
    },
  ];

  function handleClick(direction: string) {
    switch (direction) {
      case "left":
        setArtIndex((prevIndex) => {
          const newIndex = prevIndex - 1;
          return newIndex < 0 ? slides.length - 1 : newIndex;
        });
        break;
      case "right":
        setArtIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          return newIndex > slides.length - 1 ? 0 : newIndex;
        });
        break;
    }
  }

  useEffect(() => {
    // Setup
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    refContainer.current && refContainer.current.appendChild(renderer.domElement);

    // Render slide scene
    const anim = slides[artIndex].draw(scene, camera);

    var animate = function (time: number) {
      requestAnimationFrame(animate);
      anim(time);
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    }
  }, [artIndex])

  return (
    <>
      <div className='art-viewer'>
        <div className='art-viewer-controls'>
          <button onClick={() => handleClick("left")}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h3 className='art-title'>{slides[artIndex].name}</h3>
          <button onClick={() => handleClick("right")}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div ref={refContainer} />
    </>
  )
}

function drawSnowman(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  // Set background color to light blue
  scene.background = new THREE.Color(0xb0e0ff);

  // Create snowman
  const createSphere = (radius: number, yPosition: number, castShadow: boolean = true) => {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x555555,
      shininess: 30
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, yPosition, 0);
    sphere.castShadow = castShadow;
    sphere.receiveShadow = true;
    scene.add(sphere);
    return sphere;
  };

  // Create snowman body parts
  createSphere(1.5, -1.5);
  createSphere(1, 1);
  createSphere(0.75, 2.6);

  // Create eyes
  const createEye = (xPosition: number) => {
    const geometry = new THREE.SphereGeometry(0.08, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const eye = new THREE.Mesh(geometry, material);
    eye.position.set(xPosition, 2.8, 0.6);
    scene.add(eye);
  };

  createEye(-0.2);
  createEye(0.2);

  // Create nose
  const noseGeometry = new THREE.ConeGeometry(0.08, 0.5, 32);
  const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0, 2.6, 0.8);
  nose.rotation.x = Math.PI / 2;
  scene.add(nose);

  // Create hat
  const hatBaseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
  const hatTopGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 32);
  const hatMaterial = new THREE.MeshPhongMaterial({
    color: 0x4b0082,
    specular: 0x222222,
    shininess: 10
  });
  const hatBase = new THREE.Mesh(hatBaseGeometry, hatMaterial);
  const hatTop = new THREE.Mesh(hatTopGeometry, hatMaterial);
  hatBase.position.set(0, 3.2, 0);
  hatTop.position.set(0, 3.55, 0);
  hatBase.castShadow = true;
  hatTop.castShadow = true;
  scene.add(hatBase);
  scene.add(hatTop);

  // Create scarf
  const scarfGeometry = new THREE.TorusGeometry(0.7, 0.15, 16, 100);
  const scarfMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    specular: 0x222222,
    shininess: 10
  });
  const scarf = new THREE.Mesh(scarfGeometry, scarfMaterial);
  scarf.position.set(0, 1.9, 0);
  scarf.rotation.x = Math.PI / 2;
  scarf.castShadow = true;
  scene.add(scarf);

  // Create scarf ends
  const scarfEndGeometry = new THREE.PlaneGeometry(0.5, 1.2);
  const scarfEndGeometry2 = new THREE.PlaneGeometry(0.5, 0.8);
  const scarfEnd1 = new THREE.Mesh(scarfEndGeometry, scarfMaterial);
  const scarfEnd2 = new THREE.Mesh(scarfEndGeometry2, scarfMaterial);
  scarfEnd1.position.set(0.3, 1.6, 1.6);
  scarfEnd2.position.set(0.8, 1.8, 1.6);
  scarfEnd1.castShadow = true;
  scarfEnd2.castShadow = true;
  scene.add(scarfEnd1);
  scene.add(scarfEnd2);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(8, 10, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Add ground
  const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3;
  ground.receiveShadow = true;
  scene.add(ground);

  // Set camera position for diagonal view
  camera.position.set(6, 4, 6);
  camera.lookAt(scene.position);

  const animSnowman = (time: number) => {
    const windFactor = Math.sin(time * 0.002) * 0.1;
    scarfEnd1.rotation.x = -0.3 + Math.sin(time * 0.003) * 0.15 + windFactor;
    scarfEnd2.rotation.x = -0.2 + Math.sin(time * 0.004) * 0.1 + windFactor;
    scarfEnd1.position.z = 1.2 - scarfEnd1.rotation.x / 2;
    scarfEnd2.position.z = 1.1 - scarfEnd2.rotation.x / 2;
  }
  return animSnowman;
}

function drawBuilding(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  // Set background color to light blue sky
  scene.background = new THREE.Color(0x87CEEB);

  // Materials
  const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
  const windowMaterial = new THREE.MeshPhongMaterial({ color: 0x4D4D4D });
  const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

  // Create building
  const buildingWidth = 20;
  const buildingDepth = 10;
  const buildingHeight = 30;
  const floors = 10;

  const building = new THREE.Group();

  // Main building structure
  const buildingGeometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
  const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
  buildingMesh.position.y = buildingHeight / 2;
  buildingMesh.castShadow = true;
  buildingMesh.receiveShadow = true;
  building.add(buildingMesh);

  // Generate windows
  const windowWidth = 1.5;
  const windowHeight = 2;
  const windowDepth = 0.1;
  const windowsPerFloor = 6;
  const windowSpacing = buildingWidth / (windowsPerFloor + 1);

  for (let floor = 0; floor < floors; floor++) {
    const floorHeight = (floor + 1) * (buildingHeight / floors) - windowHeight / 2;

    for (let i = 0; i < windowsPerFloor; i++) {
      const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(
        (i + 1) * windowSpacing - buildingWidth / 2,
        floorHeight,
        buildingDepth / 2 + 0.01
      );
      building.add(windowMesh);

      // Add windows to the back of the building
      const backWindowMesh = windowMesh.clone();
      backWindowMesh.position.z = -buildingDepth / 2 - 0.01;
      building.add(backWindowMesh);
    }
  }

  // Add main entrance
  const doorWidth = 3;
  const doorHeight = 4;
  const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.2);
  const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
  doorMesh.position.set(0, doorHeight / 2, buildingDepth / 2 + 0.1);
  building.add(doorMesh);

  // Add roof
  const roofGeometry = new THREE.ConeGeometry(buildingWidth / 2, 5, 4);
  const roofMesh = new THREE.Mesh(roofGeometry, buildingMaterial);
  roofMesh.position.y = buildingHeight + 2.5;
  roofMesh.rotation.y = Math.PI / 4;
  building.add(roofMesh);

  scene.add(building);

  // Add ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x1A5F0F });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 200, 100);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  scene.add(directionalLight);

  // Set camera position
  camera.position.set(30, 20, 30);
  camera.lookAt(scene.position);

  const animBuilding = (time: number) => {
    // Slowly rotate the building
    building.rotation.y += 0.002;
  }

  return animBuilding;
}

function drawCat(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  // Set background color to light blue sky
  scene.background = new THREE.Color(0x87CEEB);

  // Materials
  const furMaterial = new THREE.MeshPhongMaterial({ color: 0xFFA500 }); // Orange cat
  const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 }); // Green eyes
  const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xFFC0CB }); // Pink nose
  const whiskerMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF }); // White whiskers

  // Create cat group
  const cat = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
  const body = new THREE.Mesh(bodyGeometry, furMaterial);
  body.rotation.z = Math.PI / 2;
  body.position.y = 2;
  cat.add(body);

  // Head
  const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const head = new THREE.Mesh(headGeometry, furMaterial);
  head.position.set(1.5, 3, 0);
  cat.add(head);

  // Ears
  const earGeometry = new THREE.ConeGeometry(0.3, 0.5, 32);
  const leftEar = new THREE.Mesh(earGeometry, furMaterial);
  const rightEar = new THREE.Mesh(earGeometry, furMaterial);
  leftEar.position.set(1.2, 3.8, 0.4);
  rightEar.position.set(1.2, 3.8, -0.4);
  leftEar.rotation.x = -Math.PI / 4;
  rightEar.rotation.x = Math.PI / 4;
  cat.add(leftEar, rightEar);

  // Eyes
  const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(2.1, 3.1, 0.3);
  rightEye.position.set(2.1, 3.1, -0.3);
  cat.add(leftEye, rightEye);

  // Nose
  const noseGeometry = new THREE.ConeGeometry(0.1, 0.1, 32);
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(2.3, 2.8, 0);
  nose.rotation.x = Math.PI / 2;
  cat.add(nose);

  // Whiskers
  const addWhisker = (x: number, y: number, z: number, length: number, angle: number) => {
    const whiskerGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(length, 0, 0)
    ]);
    const whisker = new THREE.Line(whiskerGeometry, whiskerMaterial);
    whisker.position.set(x, y, z);
    whisker.rotation.z = angle;
    cat.add(whisker);
  };

  // Add 6 whiskers, 3 on each side
  addWhisker(2.2, 2.9, 0.3, 0.8, 0);
  addWhisker(2.2, 2.8, 0.3, 0.8, Math.PI / 12);
  addWhisker(2.2, 2.7, 0.3, 0.8, -Math.PI / 12);
  addWhisker(2.2, 2.9, -0.3, 0.8, 0);
  addWhisker(2.2, 2.8, -0.3, 0.8, -Math.PI / 12);
  addWhisker(2.2, 2.7, -0.3, 0.8, Math.PI / 12);

  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32);
  const frontLeg = new THREE.Mesh(legGeometry, furMaterial);
  const backLeg = new THREE.Mesh(legGeometry, furMaterial);
  frontLeg.position.set(0.8, 0.75, 0);
  backLeg.position.set(-0.8, 0.75, 0);
  cat.add(frontLeg, backLeg);

  // Tail
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 2, 0),
    new THREE.Vector3(-2, 2.5, 0),
    new THREE.Vector3(-2.5, 3, 0),
    new THREE.Vector3(-2.8, 3.5, 0)
  ]);
  const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.1, 8, false);
  const tail = new THREE.Mesh(tailGeometry, furMaterial);
  cat.add(tail);

  scene.add(cat);

  // Add ground
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x1A5F0F });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Set camera position for side view
  camera.position.set(10, 5, 0);
  camera.lookAt(scene.position);

  const animCat = (time: number) => {
    // Add subtle movement to tail
    const tailWag = Math.sin(time * 0.005) * 0.2;
    tail.rotation.y = tailWag;

    // Subtle ear twitch
    const earTwitch = Math.sin(time * 0.01) * 0.05;
    leftEar.rotation.y = earTwitch;
    rightEar.rotation.y = -earTwitch;
  }

  return animCat;
}

function drawSpaceStation(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  // Space background
  const stars = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.05 });
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }
  stars.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starField = new THREE.Points(stars, starMaterial);
  scene.add(starField);

  // Planet
  const planetGeometry = new THREE.SphereGeometry(50, 64, 64);
  const planetMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'),
    bumpMap: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'),
    bumpScale: 0.05,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.set(-100, -80, -100);
  scene.add(planet);

  // Space Station
  const station = new THREE.Group();

  // Central hub
  const hubGeometry = new THREE.SphereGeometry(5, 32, 32);
  const hubMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  station.add(hub);

  // Solar panels
  const panelGeometry = new THREE.BoxGeometry(20, 0.1, 5);
  const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x4444ff });
  const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  leftPanel.position.set(-10, 0, 0);
  rightPanel.position.set(10, 0, 0);
  station.add(leftPanel, rightPanel);

  // Docking arms
  const armGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10);
  const armMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const frontArm = new THREE.Mesh(armGeometry, armMaterial);
  const backArm = new THREE.Mesh(armGeometry, armMaterial);
  frontArm.position.set(0, 0, 7.5);
  backArm.position.set(0, 0, -7.5);
  frontArm.rotation.x = Math.PI / 2;
  backArm.rotation.x = Math.PI / 2;
  station.add(frontArm, backArm);

  scene.add(station);

  // Docking spacecraft
  const shipGeometry = new THREE.ConeGeometry(1, 4, 32);
  const shipMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const ship = new THREE.Mesh(shipGeometry, shipMaterial);
  ship.position.set(0, 0, 15);
  ship.rotation.x = Math.PI / 2;
  scene.add(ship);

  // Particle effects for thrusters
  const particleGeometry = new THREE.BufferGeometry();
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.1,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  const particlePositions = new Float32Array(1000 * 3);
  for (let i = 0; i < particlePositions.length; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 0.5;
    particlePositions[i + 1] = (Math.random() - 0.5) * 0.5;
    particlePositions[i + 2] = (Math.random() - 0.5) * 0.5;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  ship.add(particles);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const sunLight = new THREE.PointLight(0xffffff, 1, 1000);
  sunLight.position.set(50, 50, 50);
  scene.add(sunLight);

  // Camera setup
  camera.position.set(0, 30, 50);
  camera.lookAt(station.position);

  const animSpaceStation = (time: number) => {
    // Rotate the station
    station.rotation.y += 0.001;

    // Rotate solar panels
    leftPanel.rotation.x = Math.sin(time * 0.001) * 0.1;
    rightPanel.rotation.x = Math.sin(time * 0.001) * 0.1;

    // Move docking spacecraft
    ship.position.z = 15 + Math.sin(time * 0.0005) * 5;

    // Animate particle thrusters
    const positions = particles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.01;
      if (positions[i + 1] < -0.5) {
        positions[i + 1] = 0.5;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Rotate planet
    planet.rotation.y += 0.0005;

    // Move camera in a circular path
    camera.position.x = Math.sin(time * 0.0001) * 50;
    camera.position.z = Math.cos(time * 0.0001) * 50;
    camera.lookAt(station.position);

    // Twinkle stars
    const starPositions = starField.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i + 2] += (Math.random() - 0.5) * 0.01;
    }
    starField.geometry.attributes.position.needsUpdate = true;
  }

  return animSpaceStation;
}

function drawWindTurbine(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  // Ocean
  const oceanGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
  const oceanMaterial = new THREE.MeshPhongMaterial({
    color: 0x0077be,
    shininess: 60,
    transparent: true,
    opacity: 0.6,
  });
  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -20;
  scene.add(ocean);

  // Wind Turbine
  const turbine = new THREE.Group();

  // Base
  const baseGeometry = new THREE.CylinderGeometry(5, 5, 80, 32);
  const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 20;
  turbine.add(base);

  // Nacelle (housing)
  const nacelleGeometry = new THREE.BoxGeometry(10, 5, 5);
  const nacelleMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
  nacelle.position.y = 60;
  turbine.add(nacelle);

  // Rotor
  const rotor = new THREE.Group();
  rotor.position.y = 60;
  rotor.position.z = 2.5;
  rotor.rotation.x = 1.6; // Gavin added this to fix the angle

  // Create a single blade
  const createBlade = () => {
    const bladeGroup = new THREE.Group();

    // Blade segments
    const segmentCount = 5;
    const segmentLength = 30 / segmentCount;
    const segmentTaper = 2 / segmentCount;

    for (let i = 0; i < segmentCount; i++) {
      const segmentGeometry = new THREE.BoxGeometry(2 - i * segmentTaper, 1, segmentLength);
      const segmentMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
      segment.position.z = (i + 0.5) * segmentLength;
      bladeGroup.add(segment);
    }

    return bladeGroup;
  };

  // Create three blades
  for (let i = 0; i < 3; i++) {
    const blade = createBlade();
    blade.rotation.y = (Math.PI * 2 / 3) * i;
    rotor.add(blade);
  }

  turbine.add(rotor);

  // Add multiple turbines
  const turbineCount = 3;
  for (let i = 0; i < turbineCount; i++) {
    const turbineClone = turbine.clone();
    turbineClone.position.x = (i - 1) * 50;
    turbineClone.position.z = Math.random() * 20 - 10;
    scene.add(turbineClone);
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Camera setup
  camera.position.set(0, 50, 150);
  camera.lookAt(0, 40, 0);

  // Animation function
  const animWindTurbine = (time: number) => {
    // Rotate all turbine rotors
    scene.children.forEach(child => {
      if (child instanceof THREE.Group) {
        const rotor = child.children.find(c => c instanceof THREE.Group) as THREE.Group | undefined;
        if (rotor) {
          rotor.rotation.y = time * 0.001; // Gavin fixed the axis of rotation
        }
      }
    });

    // Animate ocean waves
    const vertices = (ocean.geometry as THREE.PlaneGeometry).attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 2] = Math.sin(time * 0.001 + vertices[i] * 0.1) * 2;
    }
    (ocean.geometry as THREE.PlaneGeometry).attributes.position.needsUpdate = true;
  };

  return animWindTurbine;
}

export default App
