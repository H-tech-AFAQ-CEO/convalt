import { useEffect, useRef } from 'react';

type EnergySceneProps = {
  activeSection: number;
};

function supportsWebGL() {
  if (typeof window === 'undefined' || !window.WebGLRenderingContext) return false;

  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * A deliberately small Three.js scene: a power field, a module array, a
 * compute tower, and an orbiting point of light. The CSS layer underneath is
 * the no-WebGL / reduced-motion fallback and keeps future asset handoff simple.
 */
export function EnergyScene({ activeSection }: EnergySceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const sectionTargetRef = useRef(activeSection);

  useEffect(() => {
    sectionTargetRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !supportsWebGL()
    ) {
      return;
    }
    let disposed = false;
    let cleanup = () => {
      disposed = true;
    };

    const boot = async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (disposed) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
        });
      } catch {
        return;
      }

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#aabbb8');
      scene.fog = new THREE.Fog('#aabbb8', 18, 42);
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
      const cameraHome = new THREE.Vector3(8, 5.5, 13);
      camera.position.copy(cameraHome);
      camera.lookAt(0, 1.2, 0);

      const world = new THREE.Group();
      let sectionMix = activeSection;
      world.rotation.y = sectionMix * .055;
      scene.add(world);
      scene.add(new THREE.HemisphereLight('#e9f2ed', '#557177', 2.1));
      const sun = new THREE.DirectionalLight('#d6f1e6', 2.6);
      sun.position.set(-4, 10, 7);
      scene.add(sun);
      const rimLight = new THREE.PointLight('#91ddd1', 1.8, 16, 2);
      rimLight.position.set(-2, 4, 3);
      scene.add(rimLight);

      const groundMaterial = new THREE.MeshBasicMaterial({ color: '#789195', transparent: true, opacity: .75 });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(35, 25), groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.05;
      world.add(ground);

      const lineMaterial = new THREE.LineBasicMaterial({ color: '#d1ece4', transparent: true, opacity: .38 });
      for (let i = -6; i <= 6; i += 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i * 1.05, -1, -7),
          new THREE.Vector3(i * 1.05, -1, 7),
        ]);
        world.add(new THREE.Line(geometry, lineMaterial));
      }
      for (let i = -5; i <= 5; i += 1) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-7, -1, i * 1.1),
          new THREE.Vector3(7, -1, i * 1.1),
        ]);
        world.add(new THREE.Line(geometry, lineMaterial));
      }

      const towerMaterial = new THREE.MeshBasicMaterial({ color: '#173c4e' });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(2.3, 6.3, 2.2), towerMaterial);
      tower.position.set(3.8, 2.1, -.45);
      world.add(tower);
      const windowMaterial = new THREE.MeshBasicMaterial({ color: '#93dbd0' });
      for (let row = 0; row < 7; row += 1) {
        for (let col = 0; col < 2; col += 1) {
          const window = new THREE.Mesh(new THREE.BoxGeometry(.27, .07, .03), windowMaterial);
          window.position.set(3.38 + col * .8, -.25 + row * .78, -1.57);
          world.add(window);
        }
      }
      const towerCap = new THREE.Mesh(
        new THREE.BoxGeometry(2.65, .12, 2.5),
        new THREE.MeshBasicMaterial({ color: '#356875', transparent: true, opacity: .9 }),
      );
      towerCap.position.set(3.8, 5.3, -.45);
      world.add(towerCap);

      // A compact compute hall: repeated ribs make the data-center story legible
      // without a texture-heavy model.
      const computeHall = new THREE.Group();
      computeHall.position.set(1.15, -.78, -2.5);
      computeHall.rotation.y = -.18;
      world.add(computeHall);
      const hallBody = new THREE.Mesh(
        new THREE.BoxGeometry(4.7, 1.15, 1.65),
        new THREE.MeshBasicMaterial({ color: '#315663', transparent: true, opacity: .94 }),
      );
      hallBody.position.y = .52;
      computeHall.add(hallBody);
      const hallGlass = new THREE.Mesh(
        new THREE.BoxGeometry(4.35, .4, .035),
        new THREE.MeshBasicMaterial({ color: '#9ce8dc', transparent: true, opacity: .72 }),
      );
      hallGlass.position.set(0, .56, .84);
      computeHall.add(hallGlass);
      for (let rib = -2; rib <= 2; rib += 1) {
        const roofRib = new THREE.Mesh(
          new THREE.BoxGeometry(.08, .12, 1.95),
          new THREE.MeshBasicMaterial({ color: '#b3e7dc', transparent: true, opacity: .58 }),
        );
        roofRib.position.set(rib * .88, 1.16, 0);
        computeHall.add(roofRib);
      }
      const rackLights: import('three').Mesh[] = [];
      for (let rack = 0; rack < 5; rack += 1) {
        const server = new THREE.Mesh(
          new THREE.BoxGeometry(.55, .68, .5),
          new THREE.MeshBasicMaterial({ color: '#1a3f50' }),
        );
        server.position.set(-1.72 + rack * .86, .52, .88);
        computeHall.add(server);
        const status = new THREE.Mesh(
          new THREE.BoxGeometry(.12, .025, .02),
          new THREE.MeshBasicMaterial({ color: '#a5e8dc' }),
        );
        status.position.set(server.position.x, .64, 1.14);
        computeHall.add(status);
        rackLights.push(status);
      }

      // Three small wind rotors give the horizon a second, slower rhythm.
      const rotorMastMaterial = new THREE.MeshBasicMaterial({ color: '#d0e9e0', transparent: true, opacity: .8 });
      const rotorHubMaterial = new THREE.MeshBasicMaterial({ color: '#a5e8dc' });
      const rotors: import('three').Group[] = [];
      [-4.8, -2.8, 5.7].forEach((x, index) => {
        const turbine = new THREE.Group();
        turbine.position.set(x, -.75, -2.3 - index * .35);
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(.035, .07, 3.2, 8), rotorMastMaterial);
        mast.position.y = 1.6;
        turbine.add(mast);
        const hub = new THREE.Group();
        hub.position.y = 3.1;
        turbine.add(hub);
        hub.add(new THREE.Mesh(new THREE.SphereGeometry(.11, 10, 8), rotorHubMaterial));
        for (let bladeIndex = 0; bladeIndex < 3; bladeIndex += 1) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(.08, .72, .035), rotorMastMaterial);
          blade.position.y = .37;
          blade.rotation.z = bladeIndex * (Math.PI * 2 / 3);
          hub.add(blade);
        }
        world.add(turbine);
        rotors.push(turbine);
      });

      const panelMaterial = new THREE.MeshBasicMaterial({ color: '#244f60' });
      const panelGroup = new THREE.Group();
      panelGroup.position.set(-3.3, -.25, .5);
      panelGroup.rotation.x = -.22;
      panelGroup.rotation.z = -.13;
      world.add(panelGroup);
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 6; col += 1) {
          const panel = new THREE.Mesh(new THREE.BoxGeometry(1.05, .06, .7), panelMaterial);
          panel.position.set(col * 1.08, row * .76, 0);
          panelGroup.add(panel);
        }
      }

      // CC0 solar panel asset, loaded only after WebGL support is confirmed.
      // The imported model is instanced as a small field rather than treated
      // as a heavy hero asset, keeping the handoff and bundle lightweight.
      const solarAsset = new THREE.Group();
      solarAsset.position.set(-1.6, -.55, 1.15);
      solarAsset.rotation.y = -.18;
      solarAsset.scale.setScalar(.9);
      world.add(solarAsset);
      const loader = new GLTFLoader();
      void loader.loadAsync(`${import.meta.env.BASE_URL}assets/solar-panel.glb`)
        .then((gltf) => {
          if (disposed) return;
          gltf.scene.scale.setScalar(1.05);
          solarAsset.add(gltf.scene);
        })
        .catch(() => {
          // The procedural panel field remains visible if the optional asset
          // is unavailable, which keeps the story resilient on slow networks.
        });

      const orbitMaterial = new THREE.LineBasicMaterial({ color: '#c6eee6', transparent: true, opacity: .7 });
      const orbitPoints = new THREE.EllipseCurve(0, 0, 3.8, 1.2, 0, Math.PI * 2, false, 0)
        .getPoints(72)
        .map((point) => new THREE.Vector3(point.x, point.y, 0));
      const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPoints), orbitMaterial);
      orbit.position.set(-.3, 3.9, -.8);
      orbit.rotation.x = Math.PI / 2.2;
      orbit.rotation.z = -.2;
      world.add(orbit);
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(.17, 12, 8), new THREE.MeshBasicMaterial({ color: '#a5e8dc' }));
      beacon.position.set(-.3, 3.9, -.8);
      world.add(beacon);

      const signalLines: import('three').Line[] = [];
      for (let signal = 0; signal < 4; signal += 1) {
        const points = [
          new THREE.Vector3(-5.8, .1 + signal * .2, 1.1),
          new THREE.Vector3(-2.9, .35 + signal * .18, .9),
          new THREE.Vector3(.1, .28 + signal * .23, -.3),
          new THREE.Vector3(3.8, .8 + signal * .16, -.45),
        ];
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: '#a5e8dc', transparent: true, opacity: .24 - signal * .025 }),
        );
        world.add(line);
        signalLines.push(line);
      }

      // A circular recovery loop makes the recycling story legible as a
      // second system in the scene, without adding another heavy model.
      const recoveryLoop = new THREE.Group();
      recoveryLoop.position.set(4.35, 1.15, 1.2);
      recoveryLoop.rotation.set(.32, -.2, .18);
      world.add(recoveryLoop);
      recoveryLoop.add(new THREE.Mesh(
        new THREE.TorusGeometry(1.05, .045, 8, 64),
        new THREE.MeshBasicMaterial({ color: '#b7eee2', transparent: true, opacity: .72 }),
      ));
      const recoveryNodes: import('three').Mesh[] = [];
      for (let node = 0; node < 3; node += 1) {
        const material = new THREE.MeshBasicMaterial({
          color: node === 1 ? '#e3fff4' : '#74c8bb',
          transparent: true,
          opacity: .82,
        });
        const block = new THREE.Mesh(new THREE.BoxGeometry(.22, .22, .22), material);
        recoveryLoop.add(block);
        recoveryNodes.push(block);
      }

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(.09, 10, 8),
        new THREE.MeshBasicMaterial({ color: '#e2fff3' }),
      );
      world.add(pulse);

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      let frame = 0;
      let raf = 0;
      const tick = () => {
        if (disposed) return;
        const time = frame * .008;
        const pointer = pointerRef.current;
        sectionMix += (sectionTargetRef.current - sectionMix) * .035;
        const cameraTargetX = cameraHome.x + sectionMix * .7 + pointer.x * 1.65;
        const cameraTargetY = cameraHome.y - sectionMix * .18 - pointer.y * .82;
        camera.position.x += (cameraTargetX - camera.position.x) * .035;
        camera.position.y += (cameraTargetY - camera.position.y) * .035;
        camera.position.z += (cameraHome.z - sectionMix * .12 - camera.position.z) * .025;
        const lookTarget = new THREE.Vector3(pointer.x * .45, 1.2 + pointer.y * -.25, 0);
        camera.lookAt(lookTarget);
        world.rotation.y += (sectionMix * .055 + pointer.x * .035 + Math.sin(time * .35) * .025 - world.rotation.y) * .04;
        world.position.x += (pointer.x * .22 - world.position.x) * .035;
        world.position.y += (sectionMix * -.12 + pointer.y * .1 - world.position.y) * .025;
        panelGroup.rotation.y = -.13 + Math.sin(time * .28) * .025;
        panelGroup.position.x += (pointer.x * .14 - panelGroup.position.x + -3.3) * .025;
        solarAsset.position.z = 1.15 - sectionMix * .1 + pointer.y * .12;
        solarAsset.rotation.y = -.18 + Math.sin(time * .32) * .06;
        solarAsset.scale.setScalar(.9 + Math.sin(time * .55) * .025);
        computeHall.position.x += (1.15 + pointer.x * .38 - computeHall.position.x) * .03;
        computeHall.rotation.y += (-.18 + pointer.x * .025 - computeHall.rotation.y) * .03;
        rotors.forEach((rotor, index) => {
          rotor.rotation.z = Math.sin(time * .35 + index) * .012;
          const hub = rotor.children[1];
          if (hub) hub.rotation.z = time * (index % 2 === 0 ? 1.3 : -1.05);
        });
        rackLights.forEach((light, index) => {
          const material = light.material as import('three').MeshBasicMaterial;
          material.opacity = .48 + (Math.sin(time * 1.4 + index * .9) + 1) * .2;
        });
        signalLines.forEach((line, index) => {
          const material = line.material as import('three').LineBasicMaterial;
          material.opacity = .16 + (Math.sin(time * .8 + index) + 1) * .07;
        });
        recoveryLoop.rotation.y += .0025 + pointer.x * .002;
        recoveryLoop.rotation.z = .18 + Math.sin(time * .5) * .06 + pointer.y * .04;
        recoveryNodes.forEach((node, index) => {
          const angle = time * .32 + index * (Math.PI * 2 / recoveryNodes.length);
          node.position.set(Math.cos(angle) * 1.08, Math.sin(angle) * 1.08, Math.sin(angle * 1.4) * .12);
          node.rotation.set(angle, angle * .7, angle * .4);
          node.scale.setScalar(.88 + (Math.sin(time * 1.1 + index) + 1) * .08);
        });
        beacon.position.x = -.3 + Math.cos(time) * 3.8;
        beacon.position.y = 3.9 + Math.sin(time) * 1.2;
        beacon.scale.setScalar(1 + Math.sin(time * 1.8) * .14);
        const pulseT = (time * .12) % 1;
        pulse.position.set(-5.8 + pulseT * 9.6, .22 + Math.sin(pulseT * Math.PI) * .8, 1.1 - pulseT * 1.55);
        rimLight.position.x = -2 + pointer.x * 2;
        rimLight.position.y = 4 - pointer.y * 1.5;
        renderer.render(scene, camera);
        frame += 1;
        raf = requestAnimationFrame(tick);
      };
      cleanup = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        observer.disconnect();
        renderer.dispose();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
            else object.material.dispose();
          }
        });
      };
      tick();
    };

    void boot();
    return () => cleanup();
  }, []);

  return (
    <div
      className="scene-wrap"
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
      }}
      aria-hidden="true"
    >
      <div className="scene-fallback">
        <div className="fallback-sun" aria-hidden="true" />
        <div className="fallback-panels" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="fallback-hall" aria-hidden="true">
          <span className="fallback-hall-glass" />
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="fallback-tower" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="fallback-turbines" aria-hidden="true">
          <span className="fallback-turbine fallback-turbine--left"><i /><b /></span>
          <span className="fallback-turbine fallback-turbine--right"><i /><b /></span>
        </div>
        <div className="fallback-recovery" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="fallback-signal" aria-hidden="true" />
      </div>
      <canvas ref={canvasRef} className="energy-scene" />
    </div>
  );
}