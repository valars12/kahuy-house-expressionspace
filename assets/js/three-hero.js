// KAHUY HOUSE — three-hero.js
(function(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  function ensureTHREE(cb){
    if (window.THREE) return cb();
    // fallback if three.js belum siap (defer): cek lagi sebentar
    setTimeout(()=>ensureTHREE(cb), 50);
  }

  ensureTHREE(()=>{
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    function resize(){
      const w = canvas.clientWidth || canvas.parentElement.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || canvas.parentElement.clientHeight || window.innerHeight * 0.8;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3,4,2);
    scene.add(dir);

    // Object
    const geo = new THREE.TorusKnotGeometry(1.1, .36, 180, 24);
    const mat = new THREE.MeshStandardMaterial({metalness:0.15, roughness:0.35, color:0x27D6FF, emissive:0x27D6FF, emissiveIntensity:0.25});
    const knot = new THREE.Mesh(geo, mat);
    scene.add(knot);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const count = 2600;
    const positions = new Float32Array(count*3);
    for (let i=0;i<count;i++){
      const r = 8 * Math.random() + 2;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      positions[i*3+0] = r*Math.sin(phi)*Math.cos(theta);
      positions[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
      positions[i*3+2] = r*Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({size:0.02, color:0x40D87C, transparent:true, opacity:0.6});
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Animate
    let t = 0;
    function animate(){
      t += 0.004;
      knot.rotation.x = t*0.7;
      knot.rotation.y = t*0.9;
      points.rotation.y = t*0.2;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    animate();
  });
})();
