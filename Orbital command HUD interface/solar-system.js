/* <solar-system> — Three.js heliocentric simulation for the ORBITAL COMMAND HUD.
   Emits: 'planetselect' {name,...}, 'planettick' {name, angle}. API: focusPlanet(name), resetView() */
(function () {
  const rand = (a, b) => a + Math.random() * (b - a);

  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  function bandTexture(THREE, opts) {
    const c = cnv(1024, 512), x = c.getContext('2d');
    x.fillStyle = opts.base; x.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < opts.bands; i++) {
      const y = Math.random() * 512, h = rand(6, 46);
      x.fillStyle = opts.tones[(Math.random() * opts.tones.length) | 0];
      x.globalAlpha = rand(0.08, 0.42);
      x.beginPath();
      for (let px = 0; px <= 1024; px += 16) {
        const wob = Math.sin(px * 0.011 + i) * (opts.wob || 3);
        px ? x.lineTo(px, y + wob) : x.moveTo(px, y + wob);
      }
      for (let px = 1024; px >= 0; px -= 16) {
        const wob = Math.sin(px * 0.011 + i) * (opts.wob || 3);
        x.lineTo(px, y + h + wob);
      }
      x.closePath(); x.fill();
    }
    x.globalAlpha = 1;
    if (opts.spot) {
      const g = x.createRadialGradient(opts.spot.x, opts.spot.y, 2, opts.spot.x, opts.spot.y, opts.spot.r);
      g.addColorStop(0, opts.spot.c1); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.save(); x.translate(opts.spot.x, opts.spot.y); x.scale(1.8, 1);
      x.beginPath(); x.arc(0, 0, opts.spot.r, 0, 7); x.fill(); x.restore();
    }
    if (opts.caps) {
      x.fillStyle = opts.caps; x.globalAlpha = .85;
      x.fillRect(0, 0, 1024, 14); x.fillRect(0, 498, 1024, 14);
      x.globalAlpha = .35; x.fillRect(0, 14, 1024, 12); x.fillRect(0, 486, 1024, 12);
      x.globalAlpha = 1;
    }
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }

  function rockTexture(THREE, base, dark, light, craters) {
    const c = cnv(512, 256), x = c.getContext('2d');
    x.fillStyle = base; x.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 260; i++) {
      x.globalAlpha = rand(.05, .22); x.fillStyle = Math.random() < .5 ? dark : light;
      x.beginPath(); x.ellipse(Math.random() * 512, Math.random() * 256, rand(6, 40), rand(4, 22), Math.random() * 3, 0, 7); x.fill();
    }
    for (let i = 0; i < craters; i++) {
      const cx = Math.random() * 512, cy = Math.random() * 256, r = rand(2, 11);
      x.globalAlpha = .38; x.fillStyle = dark;
      x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
      x.globalAlpha = .3; x.strokeStyle = light; x.lineWidth = 1.2;
      x.beginPath(); x.arc(cx - r * .12, cy - r * .12, r * .92, 0, 7); x.stroke();
    }
    x.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }

  function earthTexture(THREE) {
    const c = cnv(1024, 512), x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#0b2c52'); g.addColorStop(.5, '#0e4a86'); g.addColorStop(1, '#0b2c52');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    const land = ['#1f5e33', '#2c7040', '#4e6b34', '#6b6136', '#37613a'];
    const blob = (cx, cy, s) => {
      x.fillStyle = land[(Math.random() * land.length) | 0];
      x.globalAlpha = rand(.65, .95);
      x.beginPath();
      const n = 12; for (let i = 0; i <= n; i++) {
        const a = i / n * Math.PI * 2, r = s * (.55 + Math.random() * .75);
        const px = cx + Math.cos(a) * r * 1.5, py = cy + Math.sin(a) * r;
        i ? x.lineTo(px, py) : x.moveTo(px, py);
      }
      x.closePath(); x.fill();
    };
    [[150, 150, 46], [180, 210, 30], [210, 330, 40], [235, 400, 26], [430, 170, 34], [470, 210, 28],
     [520, 300, 22], [660, 150, 58], [720, 200, 46], [790, 175, 40], [840, 380, 30], [900, 200, 26], [60, 260, 22]]
      .forEach(b => blob(b[0], b[1], b[2]));
    x.globalAlpha = .9; x.fillStyle = '#e8f4ff';
    x.fillRect(0, 0, 1024, 16); x.fillRect(0, 496, 1024, 16);
    x.globalAlpha = .4; x.fillRect(0, 16, 1024, 14); x.fillRect(0, 482, 1024, 14);
    x.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }

  function cloudTexture(THREE) {
    const c = cnv(1024, 512), x = c.getContext('2d');
    x.clearRect(0, 0, 1024, 512);
    for (let i = 0; i < 220; i++) {
      x.globalAlpha = rand(.05, .3); x.fillStyle = '#ffffff';
      const cx = Math.random() * 1024, cy = Math.random() * 512;
      for (let j = 0; j < 5; j++) {
        x.beginPath(); x.ellipse(cx + rand(-40, 40), cy + rand(-12, 12), rand(14, 52), rand(6, 16), 0, 0, 7); x.fill();
      }
    }
    x.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }

  function ringTexture(THREE, tint) {
    const c = cnv(1024, 8), x = c.getContext('2d');
    for (let i = 0; i < 1024; i++) {
      const n = Math.sin(i * .12) * .5 + Math.sin(i * .031) * .5 + Math.random() * .35;
      let a = .18 + n * .32;
      if (i > 470 && i < 520) a *= .12;            // Cassini division
      if (i > 940) a *= Math.max(0, (1024 - i) / 84);
      if (i < 40) a *= i / 40;
      x.fillStyle = 'rgba(' + tint + ',' + Math.max(0, Math.min(.9, a)).toFixed(3) + ')';
      x.fillRect(i, 0, 1, 8);
    }
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }

  function glowSprite(THREE, color, power) {
    const c = cnv(256, 256), x = c.getContext('2d');
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(' + color + ',' + power + ')');
    g.addColorStop(.28, 'rgba(' + color + ',' + power * .38 + ')');
    g.addColorStop(1, 'rgba(' + color + ',0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    return new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(c), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    }));
  }

  const SUN_FRAG = `
    uniform float uTime; varying vec2 vUv; varying vec3 vN;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
    void main(){
      vec2 p = vUv * vec2(9.0, 4.5);
      float n = fbm(p + vec2(uTime*0.06, uTime*0.02));
      n = fbm(p + n*1.6 + vec2(-uTime*0.03, uTime*0.045));
      vec3 hot = vec3(1.0, 0.93, 0.68);
      vec3 mid = vec3(1.0, 0.63, 0.16);
      vec3 low = vec3(0.85, 0.26, 0.04);
      vec3 col = mix(low, mid, smoothstep(0.28, 0.62, n));
      col = mix(col, hot, smoothstep(0.62, 0.92, n));
      float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0.0,0.0,1.0))), 2.2);
      col += vec3(1.0,0.55,0.18) * rim * 0.85;
      col *= 0.94 + 0.06 * sin(uTime*1.1);
      gl_FragColor = vec4(col, 1.0);
    }`;
  const SUN_VERT = `varying vec2 vUv; varying vec3 vN;
    void main(){ vUv=uv; vN=normalMatrix*normal; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `;

  const ATMO_VERT = `varying vec3 vN; varying vec3 vP;
    void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vP=mv.xyz;
      gl_Position=projectionMatrix*mv; }`;
  const ATMO_FRAG = `uniform vec3 uColor; uniform float uPower; uniform float uStrength;
    varying vec3 vN; varying vec3 vP;
    void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(-vP))), uPower);
      gl_FragColor = vec4(uColor, f*uStrength); }`;

  const DATA = [
    { name: 'MERCURY', idx: '01', type: 'TERRESTRIAL', r: .40, orbit: 9.5, speed: .300, spin: .10, tilt: .001, au: '0.39 AU', dia: '4,879 KM', period: '88 D', temp: '167°C', moons: [] },
    { name: 'VENUS', idx: '02', type: 'TERRESTRIAL', r: .60, orbit: 13.2, speed: .222, spin: -.04, tilt: 3.1, au: '0.72 AU', dia: '12,104 KM', period: '225 D', temp: '464°C', moons: [] },
    { name: 'EARTH', idx: '03', type: 'TERRESTRIAL', r: .66, orbit: 17.4, speed: .178, spin: .42, tilt: .41, au: '1.00 AU', dia: '12,742 KM', period: '365 D', temp: '15°C', moons: [{ n: 'LUNA', r: .18, d: 1.6, s: 1.1 }] },
    { name: 'MARS', idx: '04', type: 'TERRESTRIAL', r: .48, orbit: 22.0, speed: .144, spin: .40, tilt: .44, au: '1.52 AU', dia: '6,779 KM', period: '687 D', temp: '-63°C', moons: [{ n: 'PHOBOS', r: .08, d: 1.0, s: 2.2 }, { n: 'DEIMOS', r: .06, d: 1.5, s: 1.4 }] },
    { name: 'JUPITER', idx: '05', type: 'GAS GIANT', r: 1.85, orbit: 34.0, speed: .080, spin: .95, tilt: .05, au: '5.20 AU', dia: '139,820 KM', period: '11.9 Y', temp: '-145°C', moons: [{ n: 'IO', r: .12, d: 2.7, s: 1.5 }, { n: 'EUROPA', r: .11, d: 3.3, s: 1.15 }, { n: 'GANYMEDE', r: .17, d: 4.0, s: .85 }, { n: 'CALLISTO', r: .15, d: 4.8, s: .6 }] },
    { name: 'SATURN', idx: '06', type: 'GAS GIANT', r: 1.55, orbit: 43.5, speed: .058, spin: .88, tilt: .47, rings: [2.3, 3.9], au: '9.54 AU', dia: '116,460 KM', period: '29.5 Y', temp: '-178°C', moons: [{ n: 'ENCELADUS', r: .09, d: 4.4, s: 1.3 }, { n: 'RHEA', r: .12, d: 5.1, s: .95 }, { n: 'TITAN', r: .19, d: 6.0, s: .7 }] },
    { name: 'URANUS', idx: '07', type: 'ICE GIANT', r: 1.05, orbit: 51.5, speed: .042, spin: -.55, tilt: 1.71, rings: [1.5, 2.1], au: '19.2 AU', dia: '50,724 KM', period: '84 Y', temp: '-195°C', moons: [{ n: 'TITANIA', r: .10, d: 2.6, s: 1.0 }, { n: 'OBERON', r: .09, d: 3.2, s: .75 }] },
    { name: 'NEPTUNE', idx: '08', type: 'ICE GIANT', r: 1.00, orbit: 58.5, speed: .033, spin: .58, tilt: .49, au: '30.1 AU', dia: '49,244 KM', period: '165 Y', temp: '-201°C', moons: [{ n: 'TRITON', r: .12, d: 2.5, s: .8 }] }
  ];

  class SolarSystem extends HTMLElement {
    connectedCallback() {
      this.style.display = 'block'; this.style.position = 'relative'; this.style.width = '100%'; this.style.height = '100%';
      this.tip = document.createElement('div');
      this.tip.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity .25s ease;transform:translate(14px,-50%);' +
        'padding:9px 12px;border:1px solid rgba(95,216,255,.3);border-left:1px solid rgba(127,227,255,.85);background:rgba(5,15,30,.72);' +
        'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 0 30px rgba(20,80,140,.4);' +
        "font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.14em;color:rgba(207,230,242,.62);white-space:nowrap;z-index:3;";
      this.appendChild(this.tip);
      this.boot();
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); if (this._ro) this._ro.disconnect(); if (this.renderer) this.renderer.dispose(); }

    boot() {
      if (!window.THREE) { setTimeout(() => this.boot(), 60); return; }
      const THREE = window.THREE, self = this;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 3000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
      this.appendChild(renderer.domElement);
      this.renderer = renderer; this.scene = scene; this.camera = camera;

      scene.add(new THREE.AmbientLight(0x5f78a0, .34));
      const sunLight = new THREE.PointLight(0xffd9a0, 3.4, 400, 1.4); scene.add(sunLight);
      const fill = new THREE.DirectionalLight(0x8fd8ff, .18); fill.position.set(-1, .6, 1); scene.add(fill);

      // ---- stars (3 parallax layers) ----
      this.starLayers = [];
      [[2600, 900, .55, 1.1], [1700, 520, .8, 1.6], [700, 300, 1.0, 2.4]].forEach(([n, spread, alpha, size]) => {
        const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          const v = new THREE.Vector3().setFromSphericalCoords(spread * (.6 + Math.random() * .4), Math.acos(rand(-1, 1)), rand(0, 6.2832));
          pos.set([v.x, v.y, v.z], i * 3);
          const w = Math.random();
          const c = w < .1 ? [.72, .82, 1] : w < .18 ? [.85, .78, 1] : [1, 1, .97];
          const b = alpha * rand(.35, 1);
          col.set([c[0] * b, c[1] * b, c[2] * b], i * 3);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const p = new THREE.Points(g, new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity: .95, depthWrite: false, sizeAttenuation: true }));
        scene.add(p); this.starLayers.push(p);
      });

      // ---- sun ----
      const sunMat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: SUN_VERT, fragmentShader: SUN_FRAG });
      const sun = new THREE.Mesh(new THREE.SphereGeometry(3.4, 64, 48), sunMat);
      scene.add(sun); this.sun = sun; this.sunMat = sunMat;
      const corona = glowSprite(THREE, '255,168,60', .95); corona.scale.set(27, 27, 1); scene.add(corona);
      const corona2 = glowSprite(THREE, '255,110,30', .5); corona2.scale.set(46, 46, 1); scene.add(corona2);
      this.corona = corona; this.corona2 = corona2;
      this.flares = [];
      for (let i = 0; i < 5; i++) {
        const f = glowSprite(THREE, '255,190,110', .55);
        const a = Math.random() * 6.28;
        f.userData = { a, sp: rand(.05, .13), rr: rand(3.6, 4.4), ph: Math.random() * 6.28 };
        f.scale.set(3.4, 3.4, 1); scene.add(f); this.flares.push(f);
      }

      // ---- planets ----
      const rootTilt = new THREE.Group(); scene.add(rootTilt);
      this.pickables = []; this.planets = [];
      const orbitMat = (op) => new THREE.LineBasicMaterial({ color: 0x5fd8ff, transparent: true, opacity: op });
      const ringLine = (radius, op, seg) => {
        const pts = [];
        for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)); }
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), orbitMat(op));
      };

      DATA.forEach((d) => {
        const path = ringLine(d.orbit, .22, 220); rootTilt.add(path);
        const pivot = new THREE.Group(); rootTilt.add(pivot);
        const holder = new THREE.Group(); holder.position.x = d.orbit; pivot.add(holder);
        const spinner = new THREE.Group(); spinner.rotation.z = d.tilt; holder.add(spinner);

        let map, atmoColor = '150,200,255', atmoStrength = .35;
        if (d.name === 'MERCURY') { map = rockTexture(THREE, '#8d8a86', '#5a5854', '#c3bfb8', 90); atmoStrength = .12; atmoColor = '180,180,190'; }
        if (d.name === 'VENUS') { map = bandTexture(THREE, { base: '#d9a441', bands: 60, tones: ['#f2cf86', '#b87d2b', '#e8b761'], wob: 8 }); atmoColor = '255,205,120'; atmoStrength = .6; }
        if (d.name === 'EARTH') { map = earthTexture(THREE); atmoColor = '110,190,255'; atmoStrength = .62; }
        if (d.name === 'MARS') { map = bandTexture(THREE, { base: '#b4552c', bands: 70, tones: ['#8a3a1c', '#c96a3d', '#d3814f', '#6f2f18'], wob: 10, caps: '#f0f4ff' }); atmoColor = '255,150,110'; atmoStrength = .3; }
        if (d.name === 'JUPITER') map = bandTexture(THREE, { base: '#cba97e', bands: 90, tones: ['#8a6440', '#e8d6b6', '#a97c4f', '#f0e2c8'], wob: 5, spot: { x: 680, y: 320, r: 46, c1: 'rgba(197,86,52,.9)' } });
        if (d.name === 'SATURN') { map = bandTexture(THREE, { base: '#d9c48d', bands: 70, tones: ['#b39a63', '#f0e3bd', '#c9b078'], wob: 4 }); atmoColor = '255,235,180'; atmoStrength = .3; }
        if (d.name === 'URANUS') { map = bandTexture(THREE, { base: '#8ed3dd', bands: 34, tones: ['#a9e6ec', '#6fbcc9'], wob: 3 }); atmoColor = '140,230,240'; atmoStrength = .5; }
        if (d.name === 'NEPTUNE') { map = bandTexture(THREE, { base: '#2f5fc4', bands: 46, tones: ['#1f3f8f', '#5b8ae0', '#22459c'], wob: 6, spot: { x: 300, y: 300, r: 34, c1: 'rgba(20,32,80,.85)' } }); atmoColor = '90,150,255'; atmoStrength = .55; }

        const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r, 48, 32),
          new THREE.MeshStandardMaterial({ map, roughness: .92, metalness: .02 }));
        mesh.userData.name = d.name;
        spinner.add(mesh); this.pickables.push(mesh);

        const atmo = new THREE.Mesh(new THREE.SphereGeometry(d.r * 1.14, 32, 24), new THREE.ShaderMaterial({
          uniforms: { uColor: { value: new THREE.Color('rgb(' + atmoColor + ')') }, uPower: { value: 2.6 }, uStrength: { value: atmoStrength } },
          vertexShader: ATMO_VERT, fragmentShader: ATMO_FRAG, transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false
        }));
        spinner.add(atmo);

        let clouds = null;
        if (d.name === 'EARTH') {
          clouds = new THREE.Mesh(new THREE.SphereGeometry(d.r * 1.02, 40, 28),
            new THREE.MeshStandardMaterial({ map: cloudTexture(THREE), transparent: true, opacity: .55, roughness: 1, depthWrite: false }));
          spinner.add(clouds);
        }
        if (d.rings) {
          const rg = new THREE.RingGeometry(d.r * d.rings[0] / 1.55, d.r * d.rings[1] / 1.55, 128, 1);
          const uv = rg.attributes.uv, pos = rg.attributes.position, v = new THREE.Vector3();
          const inner = d.r * d.rings[0] / 1.55, outer = d.r * d.rings[1] / 1.55;
          for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
          }
          const rings = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({
            map: ringTexture(THREE, d.name === 'SATURN' ? '236,220,170' : '160,220,240'),
            transparent: true, side: THREE.DoubleSide, opacity: d.name === 'SATURN' ? .95 : .35, depthWrite: false
          }));
          rings.rotation.x = Math.PI / 2; spinner.add(rings);
        }

        const moons = (d.moons || []).map(m => {
          const mp = new THREE.Group(); spinner.add(mp);
          const line = ringLine(d.r * m.d, .07, 72); mp.add(line);
          const mm = new THREE.Mesh(new THREE.SphereGeometry(m.r, 20, 14),
            new THREE.MeshStandardMaterial({ map: rockTexture(THREE, '#9a978f', '#5c5a55', '#d3cfc6', 26), roughness: 1 }));
          mm.position.x = d.r * m.d; mp.add(mm);
          return { pivot: mp, mesh: mm, speed: m.s, phase: Math.random() * 6.28, name: m.n };
        });

        pivot.rotation.y = Math.random() * 6.2832;
        this.planets.push({ d, pivot, holder, spinner, mesh, path, atmo, clouds, moons, target: 0 });
      });

      // ---- asteroid belt (instanced) ----
      const beltCount = innerWidth < 1500 ? 900 : 1500;
      const rockGeo = new THREE.IcosahedronGeometry(.055, 0);
      const belt = new THREE.InstancedMesh(rockGeo, new THREE.MeshStandardMaterial({ color: 0xbaa892, roughness: 1, flatShading: true }), beltCount);
      belt.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.beltData = new Float32Array(beltCount * 5);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), vp = new THREE.Vector3();
      for (let i = 0; i < beltCount; i++) {
        const r = rand(25.5, 31.2) + (Math.random() < .12 ? rand(-1.2, 1.6) : 0);
        this.beltData.set([r, Math.random() * 6.2832, rand(-.55, .55), rand(.55, 2.7), rand(.2, 1.4)], i * 5);
      }
      rootTilt.add(belt); this.belt = belt; this._m4 = m4; this._q = q; this._e = e; this._sc = sc; this._vp = vp;

      // ---- kuiper belt ----
      const kn = 5000, kpos = new Float32Array(kn * 3), kcol = new Float32Array(kn * 3);
      for (let i = 0; i < kn; i++) {
        const r = rand(66, 92), a = Math.random() * 6.2832, y = rand(-2.6, 2.6) * (Math.random() < .3 ? 2 : 1);
        kpos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
        const b = rand(.18, .55); kcol.set([b * .75, b * .9, b], i * 3);
      }
      const kg = new THREE.BufferGeometry();
      kg.setAttribute('position', new THREE.BufferAttribute(kpos, 3));
      kg.setAttribute('color', new THREE.BufferAttribute(kcol, 3));
      const kuiper = new THREE.Points(kg, new THREE.PointsMaterial({ size: .28, vertexColors: true, transparent: true, opacity: .55, depthWrite: false }));
      rootTilt.add(kuiper); this.kuiper = kuiper;
      this.rootTilt = rootTilt;

      // ---- interaction ----
      this.ray = new THREE.Raycaster(); this.pointer = new THREE.Vector2(-5, -5);
      this.hovered = null; this.selected = null; this.mode = 'system';
      this.camPos = new THREE.Vector3(0, 46, 118); this.camLook = new THREE.Vector3(0, 0, 0);
      camera.position.copy(this.camPos);
      this.mouseParallax = new THREE.Vector2(0, 0);

      renderer.domElement.addEventListener('pointermove', ev => {
        const r = renderer.domElement.getBoundingClientRect();
        this.pointer.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        this.tipXY = [ev.clientX - r.left, ev.clientY - r.top];
        this.mouseParallax.set((ev.clientX - r.left) / r.width - .5, (ev.clientY - r.top) / r.height - .5);
      });
      renderer.domElement.addEventListener('pointerleave', () => { this.pointer.set(-5, -5); });
      renderer.domElement.addEventListener('click', () => { if (this.hovered) this.focusPlanet(this.hovered); });

      this._ro = new ResizeObserver(() => this.resize()); this._ro.observe(this);
      this.resize();
      this.clock = new THREE.Clock();
      this.lastEmit = 0;
      const loop = () => { this._raf = requestAnimationFrame(loop); self.frame(); };
      this._raf = requestAnimationFrame(loop);
    }

    resize() {
      const w = this.clientWidth || 800, h = this.clientHeight || 600;
      this.renderer.setSize(w, h, false);
      const aspect = w / h;
      this.camera.aspect = aspect; this.camera.updateProjectionMatrix();
      const need = 60, vf = 42 * Math.PI / 180;
      const dV = need / Math.tan(vf / 2);
      const dH = need / Math.tan(Math.atan(Math.tan(vf / 2) * aspect));
      this.baseDist = Math.max(dV, dH) * 0.74;
    }

    planetByName(n) { return this.planets.find(p => p.d.name === n); }

    focusPlanet(name) {
      const p = this.planetByName(name); if (!p) return;
      this.selected = name; this.mode = 'focus';
      this.dispatchEvent(new CustomEvent('planetselect', { bubbles: true, composed: true, detail: Object.assign({}, p.d, { moons: p.d.moons.map(m => m.n) }) }));
    }
    resetView() {
      this.mode = 'system';
      this.dispatchEvent(new CustomEvent('planetselect', { bubbles: true, composed: true, detail: { name: 'SOL SYSTEM' } }));
    }

    frame() {
      const THREE = window.THREE, t = this.clock.getElapsedTime(), dt = Math.min(this.clock.getDelta(), .05);
      this.sunMat.uniforms.uTime.value = t;
      const pulse = 1 + Math.sin(t * .8) * .035;
      this.corona.scale.set(27 * pulse, 27 * pulse, 1);
      this.corona2.scale.set(46 * (2 - pulse), 46 * (2 - pulse), 1);
      this.flares.forEach(f => {
        f.userData.a += f.userData.sp * dt;
        const a = f.userData.a, r = f.userData.rr + Math.sin(t * .9 + f.userData.ph) * .35;
        f.position.set(Math.cos(a) * r, Math.sin(a) * r * .55, Math.sin(a * .7) * r * .4);
        const s = 3 + Math.sin(t * 1.4 + f.userData.ph) * .8; f.scale.set(s, s, 1);
      });

      this.planets.forEach(p => {
        p.pivot.rotation.y += p.d.speed * dt;
        p.spinner.rotation.y += p.d.spin * dt;
        if (p.clouds) p.clouds.rotation.y += .06 * dt;
        p.moons.forEach(m => { m.pivot.rotation.y += m.speed * dt; m.mesh.rotation.y += .4 * dt; });
        const active = (this.hovered === p.d.name || this.selected === p.d.name);
        p.target += ((active ? 1 : 0) - p.target) * Math.min(1, dt * 5);
        p.atmo.material.uniforms.uStrength.value = p.atmo.material.uniforms.uStrength.value * .9 +
          (p.target * .55 + (p.d.name === 'EARTH' ? .62 : .3)) * .1;
        p.path.material.opacity = .22 + p.target * .55;
      });

      // asteroid belt
      const bd = this.beltData, n = this.belt.count;
      for (let i = 0; i < n; i++) {
        const o = i * 5;
        bd[o + 1] += (0.10 + (30 - bd[o]) * 0.0022) * dt;
        this._vp.set(Math.cos(bd[o + 1]) * bd[o], bd[o + 2], Math.sin(bd[o + 1]) * bd[o]);
        this._e.set(bd[o + 1] * bd[o + 4] * 2, bd[o + 1] * bd[o + 4] * 3, bd[o + 4]);
        this._q.setFromEuler(this._e);
        this._sc.setScalar(bd[o + 3]);
        this._m4.compose(this._vp, this._q, this._sc);
        this.belt.setMatrixAt(i, this._m4);
      }
      this.belt.instanceMatrix.needsUpdate = true;
      this.kuiper.rotation.y += .006 * dt;
      this.starLayers.forEach((l, i) => { l.rotation.y += (.0016 + i * .0011) * dt; });

      // hover picking
      this.ray.setFromCamera(this.pointer, this.camera);
      const hit = this.ray.intersectObjects(this.pickables, false)[0];
      const name = hit ? hit.object.userData.name : null;
      if (name !== this.hovered) {
        this.hovered = name;
        this.renderer.domElement.style.cursor = name ? 'pointer' : 'default';
        if (name) {
          const d = DATA.find(x => x.name === name);
          this.tip.innerHTML = '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:11.5px;letter-spacing:.24em;color:#eaf8ff;margin-bottom:5px">' + d.name + '</div>' +
            'PLANET ' + d.idx + ' · ' + d.type + '<br>DIST ' + d.au + ' · MOONS ' + d.moons.length + '<br><span style="color:#8ff5d8">STATUS TRACKING</span>';
        }
        this.tip.style.opacity = name ? '1' : '0';
      }
      if (this.hovered && this.tipXY) { this.tip.style.left = this.tipXY[0] + 'px'; this.tip.style.top = this.tipXY[1] + 'px'; }

      // camera
      const base = this.baseDist || 130;
      if (this.mode === 'system') {
        const a = t * .014, dist = base * (1 + Math.sin(t * .07) * .035);
        this.camPos.set(Math.sin(a) * dist * .3, dist * (.60 + Math.sin(t * .05) * .02), Math.cos(a) * dist);
        this.camLook.set(0, 0, 0);
      } else {
        const p = this.planetByName(this.selected);
        if (p) {
          const wp = new THREE.Vector3(); p.mesh.getWorldPosition(wp);
          const dir = wp.clone().normalize();
          const off = Math.max(4.6, p.d.r * 6.5) * (1 + Math.max(0, base - 130) / 420);
          this.camPos.copy(wp).add(dir.multiplyScalar(off)).add(new THREE.Vector3(0, off * .45, 0));
          this.camLook.copy(wp);
        }
      }
      const k = Math.min(1, dt * 1.6);
      this.camera.position.lerp(this.camPos, k);
      this._look = this._look || this.camLook.clone();
      this._look.lerp(this.camLook, k);
      this.camera.lookAt(this._look);
      this.camera.position.x += this.mouseParallax.x * 3;
      this.camera.position.y += -this.mouseParallax.y * 2;

      if (t - this.lastEmit > .25) {
        this.lastEmit = t;
        const p = this.selected ? this.planetByName(this.selected) : null;
        if (p) {
          const deg = ((p.pivot.rotation.y * 180 / Math.PI) % 360 + 360) % 360;
          this.dispatchEvent(new CustomEvent('planettick', { bubbles: true, composed: true, detail: { name: p.d.name, angle: deg.toFixed(1) } }));
        }
      }
      this.renderer.render(this.scene, this.camera);
    }
  }
  if (!customElements.get('solar-system')) customElements.define('solar-system', SolarSystem);
})();
