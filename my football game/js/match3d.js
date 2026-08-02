/**
 * 3D Football Match Engine v4 — High-Quality Stadium & Scenario Engine
 * ACES Filmic Tone Mapping, Multi-Tier Grandstands with Roof Canopy, LED Ad Boards,
 * Corner Flags, Dugouts, Floodlight Towers with Spotlights, Precision Trajectory Aiming,
 * Goalkeeper AI, Rewind Attempt, and Career Stat Integration.
 */

class Match3DEngine {
  constructor() {
    this.active = false;
    this.canvas = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Pitch dimensions (standard 105m x 68m)
    this.PW = 105;
    this.PH = 68;
    this.GOAL_W = 7.32;
    this.GOAL_H = 2.44;

    // Match State (4 Attempts per match)
    this.currentAttemptIndex = 0;
    this.totalAttempts = 4;
    this.attemptsData = [];
    this.currentScenario = null;
    this.scores = [0, 0];
    this.userRating = 7.0;
    this.matchStats = { goals: 0, assists: 0, shots: 0, passes: 0 };
    this.isAttemptActive = false;
    this.attemptState = 'aiming'; // 'aiming', 'kicked', 'finished'

    // Ball & Trajectory Aiming
    this.ball = { mesh: null, x: 0, y: 0.22, z: 0, vx: 0, vy: 0, vz: 0, curveSpin: 0 };
    this.aimAngle = 0;
    this.aimHeight = 0.2;
    this.aimPower = 0;
    this.aimCurve = 0;
    this.isCharging = false;
    this.trajectoryArrow = null;

    // Players in scene
    this.userPlayer = null;
    this.teammates = [];
    this.defenders = [];
    this.goalkeeper = null;

    // Inputs
    this.keys = {};

    // Audio
    this.audioCtx = null;
    this.lastFrameTime = 0;
    this._resizeHandler = null;
  }

  // ===================== INITIALIZATION & LIGHTING =====================

  init(canvasId) {
    this.dispose();

    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060c18); // Dark stadium night sky
    this.scene.fog = new THREE.FogExp2(0x060c18, 0.003);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 500);

    // High-End Renderer with ACES Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Lighting Architecture
    // 1. Hemisphere Light (Sky ambient fill + Grass reflection)
    const hemiLight = new THREE.HemisphereLight(0x2b4c7e, 0x123e12, 0.7);
    this.scene.add(hemiLight);

    // 2. Main Directional Light (Sun/Stadium Main Light with Shadows)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
    mainLight.position.set(30, 65, 40);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    mainLight.shadow.camera.left = -60; mainLight.shadow.camera.right = 60;
    mainLight.shadow.camera.top = 40; mainLight.shadow.camera.bottom = -40;
    mainLight.shadow.bias = -0.0005;
    this.scene.add(mainLight);

    this.buildPitch();
    this.buildBall();
    this.buildTrajectoryArrow();
    this.bindInputs();

    this._resizeHandler = () => this.onResize();
    window.addEventListener('resize', this._resizeHandler);
  }

  // ===================== HIGH-QUALITY STADIUM ARCHITECTURE =====================

  buildPitch() {
    const hw = this.PW / 2, hh = this.PH / 2;

    // 1. High-Res Striped Grass Texture with Noise Detail
    const cvs = document.createElement('canvas');
    cvs.width = 2048; cvs.height = 2048;
    const ctx = cvs.getContext('2d');
    const stripeW = cvs.width / 20;

    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#114a11' : '#175e17';
      ctx.fillRect(i * stripeW, 0, stripeW, cvs.height);
    }
    // Add subtle turf texture noise
    for (let j = 0; j < 30000; j++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(Math.random() * cvs.width, Math.random() * cvs.height, 2, 2);
    }
    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(this.PW, this.PH),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, metalness: 0.05 })
    );
    grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true;
    this.scene.add(grass);

    // Surrounding pitch apron (Dark green turf)
    const outer = new THREE.Mesh(
      new THREE.PlaneGeometry(this.PW + 16, this.PH + 16),
      new THREE.MeshStandardMaterial({ color: 0x082008, roughness: 0.9 })
    );
    outer.rotation.x = -Math.PI / 2; outer.position.y = -0.02;
    this.scene.add(outer);

    // 2. White Pitch Line Markings
    const wm = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const drawLine = (pts) => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p[0], 0.06, p[1])));
      this.scene.add(new THREE.Line(geo, wm));
    };

    // Boundary & Halfway Line
    drawLine([[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh],[-hw,-hh]]);
    drawLine([[0,-hh],[0,hh]]);

    // Center Circle
    const ccPts = [];
    for (let a = 0; a <= Math.PI * 2; a += 0.1) ccPts.push([Math.cos(a)*9.15, Math.sin(a)*9.15]);
    drawLine(ccPts);

    // Penalty box (attacking right: +X)
    const pd = 16.5, pw2 = 40.32/2;
    drawLine([[hw, -pw2], [hw-pd, -pw2], [hw-pd, pw2], [hw, pw2]]);

    // Goal area
    const gd = 5.5, gw2 = 18.32/2;
    drawLine([[hw, -gw2], [hw-gd, -gw2], [hw-gd, gw2], [hw, gw2]]);

    // Corner Arcs (4 Corners)
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx, sz]) => {
      const arcPts = [];
      const cx = sx * hw, cz = sz * hh;
      for (let a = 0; a <= Math.PI/2; a += 0.1) {
        const ang = (sx > 0 ? (sz > 0 ? Math.PI + a : Math.PI/2 + a) : (sz > 0 ? -Math.PI/2 + a : a));
        arcPts.push([cx + Math.cos(ang)*1.2, cz + Math.sin(ang)*1.2]);
      }
      drawLine(arcPts);

      // Corner Flags (3D Pole + Yellow/Red Checkered Flag)
      const flagGroup = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5 }));
      pole.position.y = 1.2; flagGroup.add(pole);

      // Gold Top Finial
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 }));
      finial.position.y = 2.4; flagGroup.add(finial);

      // Bright Waving Flag Fabric (Double-Sided)
      const flagCanvas = document.createElement('canvas');
      flagCanvas.width = 128; flagCanvas.height = 128;
      const fc = flagCanvas.getContext('2d');
      fc.fillStyle = '#ef4444'; fc.fillRect(0,0,128,128);
      fc.fillStyle = '#ffd700'; fc.fillRect(0,0,64,64); fc.fillRect(64,64,64,64);
      const flagTex = new THREE.CanvasTexture(flagCanvas);

      const flagMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.45), new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide }));
      flagMesh.position.set(0.35, 2.1, 0); flagGroup.add(flagMesh);
      flagGroup.position.set(cx, 0, cz);
      this.scene.add(flagGroup);
    });

    // 3. Build Full 3D Stadium Structure
    this.buildStadium();

    // 4. Build Realistic Goal
    this.buildGoal(hw);
  }

  buildStadium() {
    const hw = this.PW / 2, hh = this.PH / 2;

    // --- A. LED ADVERTISING BOARDS (Pitch Perimeter) ---
    const adCvs = document.createElement('canvas');
    adCvs.width = 1024; adCvs.height = 128;
    const adCtx = adCvs.getContext('2d');
    adCtx.fillStyle = '#0f172a'; adCtx.fillRect(0,0,1024,128);
    const sponsors = ['EA SPORTS FC', 'ADIDAS', 'NIKE', 'CHAMPIONS LEAGUE', 'HYUNDAI', 'EMIRATES', 'PEPSI'];
    sponsors.forEach((sp, idx) => {
      adCtx.fillStyle = idx % 2 === 0 ? '#00ff88' : '#00d2ff';
      adCtx.font = 'bold 36px Arial';
      adCtx.fillText(sp, idx * 150 + 20, 80);
    });
    const adTex = new THREE.CanvasTexture(adCvs);
    adTex.wrapS = adTex.wrapT = THREE.RepeatWrapping; adTex.repeat.set(8, 1);

    const adMat = new THREE.MeshBasicMaterial({ map: adTex });
    const adGeoX = new THREE.BoxGeometry(this.PW + 4, 1.0, 0.3);
    const adGeoZ = new THREE.BoxGeometry(0.3, 1.0, this.PH + 4);

    const adN = new THREE.Mesh(adGeoX, adMat); adN.position.set(0, 0.5, -hh - 2); this.scene.add(adN);
    const adS = new THREE.Mesh(adGeoX, adMat); adS.position.set(0, 0.5, hh + 2); this.scene.add(adS);
    const adW = new THREE.Mesh(adGeoZ, adMat); adW.position.set(-hw - 2, 0.5, 0); this.scene.add(adW);
    const adE = new THREE.Mesh(adGeoZ, adMat); adE.position.set(hw + 2, 0.5, 0); this.scene.add(adE);

    // --- B. TEAM DUGOUTS (Sideline Benches) ---
    const dugoutMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, transparent: true, opacity: 0.85 });
    const seatMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });

    [-12, 12].forEach(dx => {
      const dugout = new THREE.Group();
      const roof = new THREE.Mesh(new THREE.BoxGeometry(8, 2.4, 2.5), dugoutMat);
      roof.position.set(0, 1.2, 0); dugout.add(roof);
      for (let s = -3; s <= 3; s += 1.2) {
        const chair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), seatMat);
        chair.position.set(s, 0.4, 0.2); dugout.add(chair);
      }
      dugout.position.set(dx, 0, hh + 4);
      this.scene.add(dugout);
    });

    // --- C. 3D STEPPED SEATING TERRACES & INSTANCED 3D SEATS ---
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const blueSeatMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
    const redSeatMat  = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });

    // Single 3D Stadium Chair Geometry (Seat Pan + Backrest)
    const seatGroupGeo = new THREE.BoxGeometry(0.7, 0.6, 0.6);
    const backrestGeo  = new THREE.BoxGeometry(0.7, 0.7, 0.15);

    // Build Stepped Seating Stands with 22 Rows rising high into the sky
    const buildSteppedStand = (startX, startY, startZ, isSideStand, dir) => {
      const numRows = 22; // 22 towering rows going high up screen!
      const rowStepY = 0.95;
      const rowStepD = 1.25;
      const standLength = isSideStand ? this.PW + 30 : this.PH + 30;

      for (let r = 0; r < numRows; r++) {
        const ry = startY + r * rowStepY;
        const offsetD = r * rowStepD;

        // Step Concrete Base
        const stepWidth = isSideStand ? standLength : rowStepD;
        const stepDepth = isSideStand ? rowStepD : standLength;
        const stepGeo = new THREE.BoxGeometry(stepWidth, rowStepY, stepDepth);

        const posX = isSideStand ? startX : startX + dir * offsetD;
        const posZ = isSideStand ? startZ + dir * offsetD : startZ;

        const stepMesh = new THREE.Mesh(stepGeo, concreteMat);
        stepMesh.position.set(posX, ry, posZ);
        this.scene.add(stepMesh);

        // Place Individual 3D Stadium Chairs & Spectators along the row step
        const seatSpacing = 1.25;
        const numSeats = Math.floor(standLength / seatSpacing);

        for (let s = -numSeats / 2; s < numSeats / 2; s += 2) {
          const chairX = isSideStand ? s * seatSpacing : posX;
          const chairZ = isSideStand ? posZ : s * seatSpacing;
          const chairY = ry + 0.4;

          // 3D Chair Pan & Backrest
          const seatMesh = new THREE.Mesh(seatGroupGeo, (Math.floor(s) % 2 === 0) ? blueSeatMat : redSeatMat);
          seatMesh.position.set(chairX, chairY, chairZ);
          this.scene.add(seatMesh);

          // 3D Spectator Figure on 70% of seats
          if (Math.random() < 0.7) {
            const specGroup = new THREE.Group();
            const headC = ['#f3c299','#d19261','#704423','#e6c875'][Math.floor(Math.random()*4)];
            const shirtC = ['#ffffff','#ef4444','#3b82f6','#10b981','#f59e0b','#8b5cf6'][Math.floor(Math.random()*6)];

            const specTorso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.4), new THREE.MeshStandardMaterial({ color: shirtC }));
            specTorso.position.y = 0.5; specGroup.add(specTorso);

            const specHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshStandardMaterial({ color: headC }));
            specHead.position.y = 0.95; specGroup.add(specHead);

            specGroup.position.set(chairX, chairY, chairZ);
            this.scene.add(specGroup);
          }
        }
      }
    };

    // North & South Side Grandstands (Towering 22 Rows)
    [1, -1].forEach(dir => {
      buildSteppedStand(0, 1.0, dir * (hh + 4), true, dir);
      // High Roof Canopy
      const roof = new THREE.Mesh(new THREE.BoxGeometry(this.PW + 40, 2.0, 36), roofMat);
      roof.position.set(0, 23.5, dir * (hh + 18));
      this.scene.add(roof);
    });

    // East & West Goal Grandstands (Towering 22 Rows)
    [1, -1].forEach(dir => {
      buildSteppedStand(dir * (hw + 4), 1.0, 0, false, dir);
      // High Roof Canopy
      const roof = new THREE.Mesh(new THREE.BoxGeometry(36, 2.0, this.PH + 40), roofMat);
      roof.position.set(dir * (hw + 18), 23.5, 0);
      this.scene.add(roof);
    });

    // --- D. FLOODLIGHT TOWERS & SPOTLIGHT CONES ---
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });

    [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx, sz]) => {
      const px = sx * (hw + 16);
      const pz = sz * (hh + 16);

      // Steel Lattice Tower Structure
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.8, 32, 8), towerMat);
      tower.position.set(px, 16, pz); this.scene.add(tower);

      // Light Panel Head
      const head = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 2), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      head.position.set(px, 32, pz); head.lookAt(0, 0, 0); this.scene.add(head);

      // Spotlight with Penumbra
      const spot = new THREE.SpotLight(0xffffee, 1.2, 160, Math.PI / 4, 0.5, 2);
      spot.position.set(px, 32, pz);
      spot.target.position.set(0, 0, 0);
      this.scene.add(spot);
      this.scene.add(spot.target);
    });
  }

  // ===================== REALISTIC GOAL & NET =====================

  buildGoal(xPos) {
    const gw2 = this.GOAL_W / 2, gh = this.GOAL_H, depth = 2.4;
    const pm = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.85, roughness: 0.15 });
    const r = 0.08;

    // White Metallic Posts & Crossbar
    const postGeo = new THREE.CylinderGeometry(r, r, gh, 12);
    const lp = new THREE.Mesh(postGeo, pm); lp.position.set(xPos, gh/2, -gw2); lp.castShadow = true; this.scene.add(lp);
    const rp = new THREE.Mesh(postGeo, pm); rp.position.set(xPos, gh/2, gw2); rp.castShadow = true; this.scene.add(rp);

    const cb = new THREE.Mesh(new THREE.CylinderGeometry(r, r, this.GOAL_W, 12), pm);
    cb.rotation.x = Math.PI/2; cb.position.set(xPos, gh, 0); cb.castShadow = true; this.scene.add(cb);

    // Goal Stanchions (Back Net Support Tubes)
    const stanchionMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const stL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, depth * 1.4), stanchionMat);
    stL.position.set(xPos + depth/2, gh, -gw2); stL.rotation.z = -Math.PI / 4; this.scene.add(stL);
    const stR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, depth * 1.4), stanchionMat);
    stR.position.set(xPos + depth/2, gh, gw2); stR.rotation.z = -Math.PI / 4; this.scene.add(stR);

    // Pure White Netting Wireframe (Realistic Hexagonal Mesh look)
    const netGeo = new THREE.PlaneGeometry(this.GOAL_W, gh, 16, 10);
    const netMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const netBack = new THREE.Mesh(netGeo, netMat);
    netBack.position.set(xPos + depth, gh/2, 0);
    this.scene.add(netBack);

    // Top Net Sheet
    const topNetGeo = new THREE.PlaneGeometry(this.GOAL_W, depth, 16, 6);
    const netTop = new THREE.Mesh(topNetGeo, netMat);
    netTop.rotation.x = Math.PI / 2;
    netTop.position.set(xPos + depth/2, gh, 0);
    this.scene.add(netTop);
  }

  buildBall() {
    const cvs = document.createElement('canvas');
    cvs.width = 1024; cvs.height = 1024;
    const ctx = cvs.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1024, 1024);

    // Draw Classic Telstar Black Pentagon Patches
    ctx.fillStyle = '#111827';
    const centers = [
      [512, 256], [256, 512], [768, 512], [512, 768],
      [256, 256], [768, 256], [256, 768], [768, 768]
    ];
    centers.forEach(([cx, cy]) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const r = 85;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    });

    const ballTex = new THREE.CanvasTexture(cvs);
    const geo = new THREE.SphereGeometry(0.24, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      map: ballTex,
      roughness: 0.35,
      metalness: 0.05
    });
    this.ball.mesh = new THREE.Mesh(geo, mat);
    this.ball.mesh.castShadow = true;
    this.scene.add(this.ball.mesh);
  }

  buildTrajectoryArrow() {
    const points = [];
    for (let i = 0; i < 30; i++) points.push(new THREE.Vector3(0, 0.1, 0));

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: 0x00ff88,
      linewidth: 3,
      scale: 1,
      dashSize: 0.5,
      gapSize: 0.25
    });
    this.trajectoryArrow = new THREE.Line(geo, mat);
    this.trajectoryArrow.computeLineDistances();
    this.scene.add(this.trajectoryArrow);
  }

  // ===================== SCENARIOS & MATCH FLOW =====================

  generateMatchScenarios() {
    const rng = (min, max) => min + Math.random() * (max - min);
    const rngInt = (min, max) => Math.floor(rng(min, max + 1));
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    const scenarioTypes = [
      'freekick', 'freekick', 'open_play', 'open_play',
      'cross_volley', 'penalty', 'long_range', 'through_ball'
    ];

    const titles = {
      freekick: ['🎯 Direct Free Kick', '🎯 Free Kick from the Edge', '🎯 Curling Free Kick'],
      open_play: ['⚡ 1-on-1 Counter Attack', '⚡ Breakaway Chance', '⚡ Through on Goal'],
      cross_volley: ['⚽ Wing Cross & Volley', '⚽ Header from the Wing', '⚽ Cut-Back Cross'],
      penalty: ['⚽ Penalty Kick!', '⚽ Spot Kick Showdown'],
      long_range: ['🚀 Long Range Screamer', '🚀 Shot from Distance'],
      through_ball: ['🎯 Through Ball to Striker', '🎯 Key Pass Opportunity']
    };

    const minutes = [rngInt(5, 25), rngInt(30, 45), rngInt(55, 75), rngInt(78, 90)];

    this.attemptsData = [];
    for (let i = 0; i < this.totalAttempts; i++) {
      const type = pick(scenarioTypes);
      let scenario = { type, title: pick(titles[type] || titles.open_play), minute: minutes[i] };

      if (type === 'penalty') {
        scenario.ballPos = { x: 41.5, z: 0 };
        scenario.userPos = { x: 39, z: 0 };
        scenario.gkPos = { x: 51, z: rng(-1, 1) };
        scenario.wallDefenders = [];
      } else if (type === 'freekick') {
        const fkZ = rng(-16, 16);
        const fkX = rng(24, 36);
        const wallX = fkX + 9.15;
        const numWall = rngInt(2, 5);
        const wallDefs = [];
        for (let w = 0; w < numWall; w++) wallDefs.push({ x: wallX, z: fkZ - numWall/2 + w * 1.1 });
        scenario.ballPos = { x: fkX, z: fkZ };
        scenario.userPos = { x: fkX - 2, z: fkZ + rng(-1, 1) };
        scenario.gkPos = { x: 51, z: rng(-2, 2) };
        scenario.wallDefenders = wallDefs;
      } else if (type === 'open_play' || type === 'long_range') {
        const bx = type === 'long_range' ? rng(22, 32) : rng(30, 42);
        const bz = rng(-18, 18);
        scenario.ballPos = { x: bx, z: bz };
        scenario.userPos = { x: bx - 2, z: bz + rng(-1, 1) };
        scenario.gkPos = { x: 51, z: rng(-2, 2) };
        const numDefs = rngInt(0, 2);
        scenario.wallDefenders = [];
        for (let d = 0; d < numDefs; d++) scenario.wallDefenders.push({ x: rng(bx + 4, 48), z: rng(bz - 6, bz + 6) });
      } else if (type === 'cross_volley') {
        const side = pick([-1, 1]);
        const bz = side * rng(18, 28);
        scenario.ballPos = { x: rng(32, 42), z: bz };
        scenario.userPos = { x: scenario.ballPos.x - 1, z: bz + side * 1 };
        scenario.gkPos = { x: 51, z: rng(-2, 2) };
        scenario.wallDefenders = [{ x: rng(44, 49), z: rng(-6, 6) }];
        scenario.teammatePos = { x: rng(44, 49), z: rng(-4, 4) };
      } else if (type === 'through_ball') {
        const bz = rng(-12, 12);
        scenario.ballPos = { x: rng(28, 38), z: bz };
        scenario.userPos = { x: scenario.ballPos.x - 2, z: bz + rng(-1, 1) };
        scenario.gkPos = { x: 51, z: rng(-2, 2) };
        scenario.wallDefenders = [{ x: rng(40, 48), z: rng(-8, 8) }];
        scenario.teammatePos = { x: rng(42, 49), z: rng(-6, 6) };
        scenario.isPassScenario = true;
      }
      this.attemptsData.push(scenario);
    }
  }

  startMatch() {
    this.scores = [0, 0];
    this.userRating = 7.0;
    this.matchStats = { goals: 0, assists: 0, shots: 0, passes: 0 };
    this.currentAttemptIndex = 0;
    this.currentMatchContext = window.app && window.app.activeMatchContext ? window.app.activeMatchContext : null;
    this.generateMatchScenarios();
    this.scores[1] = Math.floor(Math.random() * 2);

    this.active = true;
    this.initAudio();
    this.playSound('whistle');
    this.loadAttempt(0);
    this.loop();
  }

  loadAttempt(index) {
    this.currentAttemptIndex = index;
    if (index >= this.totalAttempts) {
      this.finishMatch();
      return;
    }

    this.currentScenario = this.attemptsData[index];
    this.attemptState = 'aiming';
    this.isCharging = false;
    this.aimPower = 0;
    this.aimCurve = 0;

    const bp = this.currentScenario.ballPos;
    this.ball.x = bp.x; this.ball.y = 0.22; this.ball.z = bp.z;
    this.ball.vx = 0; this.ball.vy = 0; this.ball.vz = 0; this.ball.curveSpin = 0;

    const dx = 52.5 - bp.x;
    const dz = 0 - bp.z;
    this.aimAngle = Math.atan2(dz, dx);
    this.aimHeight = 0.22;

    this.clearActors();

    // Get player height for scaling (default 180cm)
    const playerHeight = (window.userCareer && window.userCareer.profile && window.userCareer.profile.height) || 180;
    const playerScale = playerHeight / 180; // 1.0 = 180cm baseline

    this.userPlayer = this.createActor(
      this.currentScenario.userPos.x,
      this.currentScenario.userPos.z,
      window.userCareer.profile.hairColor,
      0x1565c0,
      false,
      window.userCareer.profile.skinColor
    );
    const sideOffset = (bp.z >= 0 ? 1 : -1) * 2.0;
    this.userPlayer.mesh.position.z += sideOffset;
    this.userPlayer.z += sideOffset;
    // Apply height scaling to user player
    this.userPlayer.mesh.scale.set(playerScale, playerScale, playerScale);

    const gk = this.currentScenario.gkPos;
    this.goalkeeper = this.createActor(gk.x, gk.z, '#1a1a1a', 0xffa000, true);
    // Scale GK to ~185cm (0.85 of player model = fits under 2.44m crossbar)
    this.goalkeeper.mesh.scale.set(0.85, 0.85, 0.85);

    // Make GK face ball
    const gkAngle = Math.atan2(bp.z - gk.z, bp.x - gk.x);
    this.goalkeeper.mesh.rotation.y = -gkAngle + Math.PI / 2;

    this.defenders = (this.currentScenario.wallDefenders || []).map(d => {
      const def = this.createActor(d.x, d.z, '#111111', 0xc62828, false);
      // Make defenders face the ball
      const defAngle = Math.atan2(bp.z - d.z, bp.x - d.x);
      def.mesh.rotation.y = -defAngle + Math.PI / 2;
      return def;
    });

    if (this.currentScenario.teammatePos) {
      const tm = this.currentScenario.teammatePos;
      const tmActor = this.createActor(tm.x, tm.z, '#3d2314', 0x1565c0, false);
      // Make teammate face ball
      const tmAngle = Math.atan2(bp.z - tm.z, bp.x - tm.x);
      tmActor.mesh.rotation.y = -tmAngle + Math.PI / 2;
      this.teammates = [tmActor];
    }

    this.setupCameraForScenario();
    this.updateHUD();
    this.showTip(`🎯 ATTEMPT ${index+1} / 4 — ${this.currentScenario.title}`);
  }

  clearActors() {
    if (this._passCheckInterval) clearInterval(this._passCheckInterval);
    if (this.userPlayer) this.scene.remove(this.userPlayer.mesh);
    if (this.goalkeeper) this.scene.remove(this.goalkeeper.mesh);
    this.defenders.forEach(d => this.scene.remove(d.mesh));
    this.teammates.forEach(t => this.scene.remove(t.mesh));
    this.defenders = [];
    this.teammates = [];
    this.userPlayer = null;
    this.goalkeeper = null;
    this.aimCurve = 0;
  }

  createActor(x, z, hairC, kitC, isGK, skinC) {
    const g = new THREE.Group();
    const skinColor = skinC || 0xf3c299;

    // 1. Torso (Team Jersey)
    const torsoMat = new THREE.MeshStandardMaterial({ color: kitC, roughness: 0.5 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.45), torsoMat);
    torso.position.y = 1.1; torso.castShadow = true; g.add(torso);

    // Collar Trim
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.46), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    collar.position.y = 1.5; g.add(collar);

    // 2. Head & Face Texture
    const headMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), headMat);
    head.position.y = 1.85; head.castShadow = true; g.add(head);

    // Face Details
    const faceCvs = document.createElement('canvas');
    faceCvs.width = 128; faceCvs.height = 128;
    const fCtx = faceCvs.getContext('2d');
    const hexSkin = typeof skinColor === 'string' ? skinColor : '#' + skinColor.toString(16).padStart(6, '0');
    fCtx.fillStyle = hexSkin; fCtx.fillRect(0,0,128,128);
    // Eyes
    fCtx.fillStyle = '#1e293b';
    fCtx.beginPath(); fCtx.arc(38, 50, 10, 0, Math.PI*2); fCtx.fill();
    fCtx.beginPath(); fCtx.arc(90, 50, 10, 0, Math.PI*2); fCtx.fill();
    // Highlights
    fCtx.fillStyle = '#ffffff';
    fCtx.beginPath(); fCtx.arc(42, 46, 4, 0, Math.PI*2); fCtx.fill();
    fCtx.beginPath(); fCtx.arc(94, 46, 4, 0, Math.PI*2); fCtx.fill();
    // Smile
    fCtx.strokeStyle = '#1e293b'; fCtx.lineWidth = 4;
    fCtx.beginPath(); fCtx.arc(64, 75, 18, 0.2, Math.PI - 0.2); fCtx.stroke();

    const faceTex = new THREE.CanvasTexture(faceCvs);
    const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: faceTex, transparent: true }));
    facePlane.position.set(0, 1.85, 0.28); g.add(facePlane);

    // 3. Hair Cap
    const hairMat = new THREE.MeshStandardMaterial({ color: hairC, roughness: 0.8 });
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.22, 0.58), hairMat);
    hair.position.set(0, 2.12, -0.02); g.add(hair);

    // 4. Shoulder Pivots & Arms / Gloves
    const armMat = new THREE.MeshStandardMaterial({ color: skinColor });
    const sleeveMat = torsoMat;

    // Left Arm Pivot (Shoulder at y = 1.4)
    const armLPivot = new THREE.Group();
    armLPivot.position.set(-0.44, 1.4, 0); g.add(armLPivot);
    const sleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.22), sleeveMat);
    sleeveL.position.set(0, -0.15, 0); armLPivot.add(sleeveL);
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.18), armMat);
    armL.position.set(0, -0.4, 0); armLPivot.add(armL);

    // Right Arm Pivot (Shoulder at y = 1.4)
    const armRPivot = new THREE.Group();
    armRPivot.position.set(0.44, 1.4, 0); g.add(armRPivot);
    const sleeveR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.22), sleeveMat);
    sleeveR.position.set(0, -0.15, 0); armRPivot.add(sleeveR);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.18), armMat);
    armR.position.set(0, -0.4, 0); armRPivot.add(armR);

    if (isGK) {
      const gloveMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const gloveL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.26), gloveMat);
      gloveL.position.set(0, -0.65, 0); armLPivot.add(gloveL);
      const gloveR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.26), gloveMat);
      gloveR.position.set(0, -0.65, 0); armRPivot.add(gloveR);
    }

    // 5. Team Shorts
    const shortsMat = new THREE.MeshStandardMaterial({ color: isGK ? 0x222222 : (kitC === 0x1565c0 ? 0xffffff : 0x111111) });
    const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.38, 0.48), shortsMat);
    shorts.position.y = 0.55; g.add(shorts);

    // 6. Hip Pivots & Legs with 3D Cleats / Boots
    const sockMat = new THREE.MeshStandardMaterial({ color: kitC });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, roughness: 0.3, metalness: 0.3 });

    // Left Leg Pivot (Hip at y = 0.5)
    const legLPivot = new THREE.Group();
    legLPivot.position.set(-0.18, 0.5, 0); g.add(legLPivot);
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.22), sockMat);
    legL.position.set(0, -0.225, 0); legLPivot.add(legL);
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.42), bootMat);
    bootL.position.set(0, -0.38, 0.08); legLPivot.add(bootL);

    // Right Leg Pivot (Hip at y = 0.5)
    const legRPivot = new THREE.Group();
    legRPivot.position.set(0.18, 0.5, 0); g.add(legRPivot);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.22), sockMat);
    legR.position.set(0, -0.225, 0); legRPivot.add(legR);
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.42), bootMat);
    bootR.position.set(0, -0.38, 0.08); legRPivot.add(bootR);

    g.position.set(x, 0, z);
    this.scene.add(g);

    return { mesh: g, torso, legLPivot, legRPivot, armLPivot, armRPivot, x, z, vx: 0, vz: 0, isGK };
  }

  setupCameraForScenario() {
    if (!this.userPlayer) return;
    const bp = this.currentScenario.ballPos;
    const camDist = 5.5;
    this.camera.position.set(bp.x - Math.cos(this.aimAngle) * camDist, 2.0, bp.z - Math.sin(this.aimAngle) * camDist);
    this.camera.lookAt(bp.x + Math.cos(this.aimAngle) * 15, 1.0, bp.z + Math.sin(this.aimAngle) * 15);
  }

  updateCameraTracking() {
    if (!this.userPlayer) return;
    const px = this.userPlayer.x;
    const pz = this.userPlayer.z;

    // Turn player body facing target direction
    this.userPlayer.mesh.rotation.y = -this.aimAngle + Math.PI / 2;

    if (this.attemptState === 'aiming') {
      const camDist = 5.5;
      const camH = 2.0;

      const targetCamX = px - Math.cos(this.aimAngle) * camDist;
      const targetCamZ = pz - Math.sin(this.aimAngle) * camDist;
      const targetCamY = camH;

      this.camera.position.x += (targetCamX - this.camera.position.x) * 0.15;
      this.camera.position.y += (targetCamY - this.camera.position.y) * 0.15;
      this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.15;

      const lookTargetX = px + Math.cos(this.aimAngle) * 15;
      const lookTargetZ = pz + Math.sin(this.aimAngle) * 15;
      const lookTargetY = 1.0 + (this.aimHeight || 0.2) * 6;

      this.camera.lookAt(lookTargetX, lookTargetY, lookTargetZ);
    } else if (this.attemptState === 'kicked') {
      // Dynamic Ball-Tracking Camera follow shot
      const ballX = this.ball.x, ballY = this.ball.y, ballZ = this.ball.z;
      const targetCamX = ballX - Math.cos(this.aimAngle) * 6.0;
      const targetCamZ = ballZ - Math.sin(this.aimAngle) * 6.0;
      const targetCamY = Math.max(2.0, ballY + 1.8);

      this.camera.position.x += (targetCamX - this.camera.position.x) * 0.1;
      this.camera.position.y += (targetCamY - this.camera.position.y) * 0.1;
      this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.1;

      this.camera.lookAt(ballX, ballY, ballZ);
    }
  }

  // ===================== INPUTS & AIMING =====================

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      if (!this.active) return;
      this.keys[e.code] = true;
      if (e.key) this.keys['key_' + e.key.toLowerCase()] = true;

      if (e.code === 'Escape') {
        this.active = false;
        const cont = document.getElementById('match-container');
        if (cont) cont.classList.remove('active');
        return;
      }

      if ((e.code === 'Space' || e.code === 'KeyS' || e.key === 's') && this.attemptState === 'aiming' && !this.isCharging) {
        this.isCharging = true;
        this.aimPower = 0;
      }

      // Pass key: W or Z (AZERTY)
      if ((e.code === 'KeyW' || e.key === 'z' || e.key === 'w') && this.attemptState === 'aiming' && this.teammates.length > 0) {
        this.executePass();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.active) return;
      this.keys[e.code] = false;
      if (e.key) this.keys['key_' + e.key.toLowerCase()] = false;

      if ((e.code === 'Space' || e.code === 'KeyS' || e.key === 's') && this.isCharging && this.attemptState === 'aiming') {
        this.executeKick();
      }
    });
  }

  executeKick() {
    if (this.attemptState !== 'aiming') return;
    this.isCharging = false;
    this.attemptState = 'kicked';
    this._lastActionWasPass = false;
    this.playSound('kick');

    // Kick Swing Animation (Leg whips forward)
    if (this.userPlayer && this.userPlayer.legR) {
      this.userPlayer.legR.rotation.x = Math.PI / 2.5;
      setTimeout(() => {
        if (this.userPlayer && this.userPlayer.legR) this.userPlayer.legR.rotation.x = 0;
      }, 400);
    }

    const pwr = 0.5 + (this.aimPower / 100) * 0.9;
    const speedX = Math.cos(this.aimAngle) * pwr;
    const speedZ = Math.sin(this.aimAngle) * pwr;
    const speedY = this.aimHeight * pwr;

    this.ball.vx = speedX;
    this.ball.vz = speedZ;
    this.ball.vy = speedY;
    this.ball.curveSpin = this.aimCurve * (0.012 + (this.aimPower / 100) * 0.01);

    // Goalkeeper Reaction & Diving Animation (reduced dive distance)
    if (this.goalkeeper) {
      const diveZ = (Math.sin(this.aimAngle) * 8);
      this.goalkeeper.vx = (Math.random() < 0.75) ? (diveZ > 0 ? 0.06 : -0.06) : 0;
    }

    if (this.trajectoryArrow) this.trajectoryArrow.visible = false;
  }

  rewindAttempt() {
    if (this.attemptState === 'finished' || this.attemptState === 'aiming') {
      this.showTip("🔄 Attempt Rewound!");
      this.loadAttempt(this.currentAttemptIndex);
    }
  }

  executePass() {
    if (this.attemptState !== 'aiming' || this.teammates.length === 0) return;
    this.attemptState = 'kicked';
    this._lastActionWasPass = true;
    this.playSound('kick');
    this.matchStats.passes++;
    this.showTip("🎯 Pass Played!");

    // Find nearest teammate
    const tm = this.teammates[0];
    const dx = tm.x - this.ball.x;
    const dz = tm.z - this.ball.z;
    const dist = Math.hypot(dx, dz);
    const speed = Math.min(0.9, dist * 0.04);

    this.ball.vx = (dx / dist) * speed;
    this.ball.vz = (dz / dist) * speed;
    this.ball.vy = 0.04; // Low ground pass

    if (this.trajectoryArrow) this.trajectoryArrow.visible = false;

    // After ball reaches teammate area, teammate auto-shoots at goal
    this._passCheckInterval = setInterval(() => {
      const bDist = Math.hypot(tm.x - this.ball.x, tm.z - this.ball.z);
      if (bDist < 2.5 && this.attemptState === 'kicked') {
        clearInterval(this._passCheckInterval);
        // Teammate takes a shot at goal!
        this.showTip("⚡ Teammate Shoots!");
        const goalX = 52.5;
        const goalZ = (Math.random() - 0.5) * this.GOAL_W * 0.8;
        const shotDx = goalX - this.ball.x;
        const shotDz = goalZ - this.ball.z;
        const shotDist = Math.hypot(shotDx, shotDz);
        const shotSpeed = 0.7 + Math.random() * 0.3;
        this.ball.vx = (shotDx / shotDist) * shotSpeed;
        this.ball.vz = (shotDz / shotDist) * shotSpeed;
        this.ball.vy = 0.08 + Math.random() * 0.1;

        // GK reacts to teammate shot
        if (this.goalkeeper) {
          this.goalkeeper.vx = (goalZ > 0 ? 0.06 : -0.06);
        }
      }
    }, 50);
  }

  updateAiming() {
    if (this.attemptState !== 'aiming') return;

    if (this.keys['ArrowLeft'] || this.keys['key_q']) this.aimAngle -= 0.025;
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.keys['key_d']) this.aimAngle += 0.025;

    if (this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['key_z']) this.aimHeight = Math.min(0.55, this.aimHeight + 0.01);
    if (this.keys['ArrowDown']) this.aimHeight = Math.max(0.05, this.aimHeight - 0.01);
    if (this.keys['KeyA'] || this.keys['key_a']) this.aimCurve = 1;
    else if (this.keys['KeyE'] || this.keys['key_e']) this.aimCurve = -1;
    else this.aimCurve = 0;

    // Power charging + Leg Wind-Up Animation
    if (this.isCharging) {
      this.aimPower = Math.min(100, this.aimPower + 2.5);
      this.showChargeBar(this.aimPower);

      // Kicker leg pulls back into wind-up pose
      if (this.userPlayer && this.userPlayer.legR) {
        this.userPlayer.legR.rotation.x = -Math.PI / 3.5;
      }
    } else {
      this.hideChargeBar();
      if (this.userPlayer && this.userPlayer.legR && this.attemptState === 'aiming') {
        this.userPlayer.legR.rotation.x = 0;
      }
    }

    if (this.trajectoryArrow) {
      this.trajectoryArrow.visible = true;
      const bp = this.ball;
      const pwr = 0.5 + (Math.max(30, this.aimPower) / 100) * 0.9;

      const points = [];
      let tx = bp.x, ty = bp.y, tz = bp.z;
      let tvx = Math.cos(this.aimAngle) * pwr;
      let tvz = Math.sin(this.aimAngle) * pwr;
      let tvy = this.aimHeight * pwr;

      for (let i = 0; i < 30; i++) {
        points.push(new THREE.Vector3(tx, ty, tz));
        tx += tvx; tz += tvz; ty += tvy;
        tvy -= 0.012;
        if (ty < 0.22) { ty = 0.22; break; }
      }

      this.trajectoryArrow.geometry.setFromPoints(points);
      this.trajectoryArrow.geometry.attributes.position.needsUpdate = true;
    }
  }

  // ===================== PHYSICS & OUTCOMES =====================

  updatePhysics() {
    if (this.attemptState !== 'kicked') return;

    this.ball.x += this.ball.vx;
    this.ball.z += this.ball.vz;
    this.ball.y += this.ball.vy;

    if (this.ball.curveSpin) {
      this.ball.vx += Math.sin(this.aimAngle) * this.ball.curveSpin;
      this.ball.vz += -Math.cos(this.aimAngle) * this.ball.curveSpin;
      this.ball.curveSpin *= 0.992;
      if (Math.abs(this.ball.curveSpin) < 0.0001) this.ball.curveSpin = 0;
    }

    if (this.ball.y > 0.22) {
      this.ball.vy -= 0.012;
    } else {
      this.ball.y = 0.22;
      this.ball.vy = -this.ball.vy * 0.4;
      this.ball.vx *= 0.95;
      this.ball.vz *= 0.95;
    }

    // Ball 3D Spin Rotation Animation
    if (this.ball.mesh) {
      this.ball.mesh.position.set(this.ball.x, this.ball.y, this.ball.z);
      this.ball.mesh.rotation.x += this.ball.vx * 0.4;
      this.ball.mesh.rotation.z -= this.ball.vz * 0.4;
    }

    // Goalkeeper Diving Motion & Rotation Animation
    if (this.goalkeeper && this.goalkeeper.vx !== 0) {
      this.goalkeeper.z += this.goalkeeper.vx;
      this.goalkeeper.mesh.position.z = this.goalkeeper.z;
      // Horizontal Diving Pose
      const diveDir = this.goalkeeper.vx > 0 ? 1 : -1;
      this.goalkeeper.mesh.rotation.z = diveDir * (Math.PI / 3);
      this.goalkeeper.mesh.position.y = 0.6;
    }

    const goalX = 52.5, gw2 = this.GOAL_W / 2, gh = this.GOAL_H;

    // 1. GOAL!
    if (this.ball.x >= goalX && Math.abs(this.ball.z) < gw2 && this.ball.y < gh) {
      this.attemptState = 'finished';
      if (this._passCheckInterval) clearInterval(this._passCheckInterval);
      this.scores[0]++;
      if (this._lastActionWasPass) {
        this.matchStats.assists++;
        this.userRating = Math.min(10, this.userRating + 1.0);
        this.playSound('cheer');
        this.showTip("🎯 ASSIST! Great Pass & Goal!");
      } else {
        this.matchStats.goals++;
        this.userRating = Math.min(10, this.userRating + 1.2);
        this.playSound('cheer');
        this.showTip("⚽ GOAL! Incredible Finish!");
      }
      setTimeout(() => this.nextAttempt(), 1800);
      return;
    }

    // 2. SAVED!
    if (this.goalkeeper) {
      const distGK = Math.hypot(this.goalkeeper.x - this.ball.x, this.goalkeeper.z - this.ball.z);
      const p = window.userCareer?.profile;
      const shootingAttr = p ? p.attributes.shooting : 70;
      // High shooting means faster, more precise shots that require the GK to be closer to intercept
      const saveRange = Math.max(0.9, 1.5 - (shootingAttr - 50) * 0.008);
      
      if (distGK < saveRange && this.ball.y < 2.5) {
        this.attemptState = 'finished';
        this.ball.vx = -0.1; this.ball.vy = 0;
        this.playSound('whistle');
        this.showTip("🧤 SAVED by Goalkeeper!");
        setTimeout(() => this.nextAttempt(), 1800);
        return;
      }
    }

    // 3. MISSED
    if (this.ball.x > goalX + 2 || Math.abs(this.ball.z) > this.PH / 2 || (this.ball.vx < 0.05 && this.ball.y <= 0.23)) {
      this.attemptState = 'finished';
      this.playSound('whistle');
      this.showTip("❌ Missed Opportunity!");
      setTimeout(() => this.nextAttempt(), 1800);
    }
  }

  nextAttempt() {
    this.loadAttempt(this.currentAttemptIndex + 1);
  }

  finishMatch() {
    this.active = false;
    this.playSound('whistle');
    this.showTip("🏁 FULL TIME!");

    setTimeout(() => {
      window.app.endMatch3D({
        userGoals: this.scores[0],
        oppGoals: this.scores[1],
        userRating: parseFloat(this.userRating.toFixed(1)),
        userAssists: this.matchStats.assists
      });
    }, 1500);
  }

  dispose() {
    this.active = false;

    if (this._passCheckInterval) {
      clearInterval(this._passCheckInterval);
      this._passCheckInterval = null;
    }

    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m?.dispose?.());
          } else {
            obj.material.dispose?.();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    this.scene = null;
    this.camera = null;
    this.canvas = null;
    this.currentMatchContext = null;
    this.userPlayer = null;
    this.teammates = [];
    this.defenders = [];
    this.goalkeeper = null;
    this.trajectoryArrow = null;
  }

  // ===================== HUD & AUDIO =====================

  updateHUD() {
    const clockEl = document.getElementById('match-clock');
    const scoreEl = document.getElementById('match-score');
    const ratingEl = document.getElementById('match-user-rating');
    const attemptEl = document.getElementById('match-attempt-counter');
    const bannerEl = document.getElementById('scenario-title-banner');

    if (this.currentScenario) {
      if (clockEl) clockEl.innerText = `${this.currentScenario.minute}'`;
      if (bannerEl) {
        const contextTitle = this.currentMatchContext
          ? [this.currentMatchContext.competitionName, this.currentMatchContext.stageLabel, this.currentMatchContext.matchLabel].filter(Boolean).join(' • ')
          : this.currentScenario.title;
        bannerEl.innerText = contextTitle;
      }
    }
    if (scoreEl) scoreEl.innerText = `${this.scores[0]} - ${this.scores[1]}`;
    if (ratingEl) ratingEl.innerText = `${this.userRating.toFixed(1)} ⭐`;
    if (attemptEl) attemptEl.innerText = `ATTEMPT ${this.currentAttemptIndex + 1} / ${this.totalAttempts}`;
  }

  showTip(text) {
    const el = document.getElementById('action-tip');
    if (el) {
      el.innerText = text;
      el.style.display = 'block';
      clearTimeout(this._tipTimeout);
      this._tipTimeout = setTimeout(() => el.style.display = 'none', 2400);
    }
  }

  showChargeBar(pct) {
    const box = document.getElementById('charge-box');
    const fill = document.getElementById('charge-fill');
    if (box) box.style.display = 'block';
    if (fill) fill.style.width = pct + '%';
  }

  hideChargeBar() {
    const box = document.getElementById('charge-box');
    if (box) box.style.display = 'none';
  }

  initAudio() {
    if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playSound(type) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    if (type === 'whistle') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(2400, ctx.currentTime);
      g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.5);
    } else if (type === 'kick') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(200, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.45, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.08);
    } else if (type === 'cheer') {
      const sz = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < sz; i++) ch[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / sz);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
      src.connect(f); f.connect(g); g.connect(ctx.destination); src.start();
    }
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateAnimations() {
    this.animTime = (this.animTime || 0) + 0.06;
    const t = this.animTime;

    // Helper LERP for smooth rotation transitions
    const lerp = (a, b, alpha) => a + (b - a) * alpha;

    // 1. USER PLAYER (Kicker)
    if (this.userPlayer) {
      const p = this.userPlayer;
      if (this.isCharging) {
        // Wind-Up Pose: Leg pulls back far, left arm reaches forward for balance, torso tilts back
        const pct = Math.max(0.1, this.aimPower / 100);
        p.legRPivot.rotation.x = lerp(p.legRPivot.rotation.x, -1.2 * pct, 0.2);
        p.legLPivot.rotation.x = lerp(p.legLPivot.rotation.x, 0.2, 0.2);
        p.armLPivot.rotation.x = lerp(p.armLPivot.rotation.x, 1.1 * pct, 0.2);
        p.armRPivot.rotation.x = lerp(p.armRPivot.rotation.x, -0.6 * pct, 0.2);
        p.torso.rotation.x = lerp(p.torso.rotation.x, -0.35 * pct, 0.2);
      } else if (this.attemptState === 'kicked') {
        // Powerful Kick Follow Through: Leg whips forward past body
        p.legRPivot.rotation.x = lerp(p.legRPivot.rotation.x, 1.4, 0.25);
        p.legLPivot.rotation.x = lerp(p.legLPivot.rotation.x, -0.3, 0.25);
        p.armLPivot.rotation.x = lerp(p.armLPivot.rotation.x, -0.8, 0.25);
        p.armRPivot.rotation.x = lerp(p.armRPivot.rotation.x, 0.8, 0.25);
        p.torso.rotation.x = lerp(p.torso.rotation.x, 0.2, 0.25);
      } else {
        // Idle Stance: Natural breathing sway + weight shifting
        const sway = Math.sin(t * 3) * 0.08;
        p.legRPivot.rotation.x = lerp(p.legRPivot.rotation.x, sway, 0.1);
        p.legLPivot.rotation.x = lerp(p.legLPivot.rotation.x, -sway, 0.1);
        p.armLPivot.rotation.x = lerp(p.armLPivot.rotation.x, sway * 1.5, 0.1);
        p.armRPivot.rotation.x = lerp(p.armRPivot.rotation.x, -sway * 1.5, 0.1);
        p.torso.rotation.x = lerp(p.torso.rotation.x, 0, 0.1);
      }
    }

    // 2. DEFENSIVE WALL PLAYERS (Jumping Wall Animation!)
    if (this.defenders && this.defenders.length > 0) {
      this.defenders.forEach((d, idx) => {
        // Protect Face / Wall Stance
        d.armLPivot.rotation.z = -0.7;
        d.armRPivot.rotation.z = 0.7;
        d.armLPivot.rotation.x = 0.8;
        d.armRPivot.rotation.x = 0.8;

        if (this.attemptState === 'kicked') {
          // Synchronized Wall Jump when ball is kicked!
          const jumpHeight = Math.max(0, Math.sin((t * 8) + idx * 0.2) * 1.1);
          d.mesh.position.y = jumpHeight;
          d.legLPivot.rotation.x = -0.3;
          d.legRPivot.rotation.x = -0.3;
        } else {
          // Wall Ready Shuffling
          const wallBounce = Math.abs(Math.sin((t * 4) + idx * 0.5)) * 0.1;
          d.mesh.position.y = wallBounce;
          d.legLPivot.rotation.x = Math.sin(t * 4) * 0.1;
          d.legRPivot.rotation.x = -Math.sin(t * 4) * 0.1;
        }
      });
    }

    // 3. TEAMMATES (Calling for Pass & Waving Animation)
    if (this.teammates && this.teammates.length > 0) {
      this.teammates.forEach((tm) => {
        // Wave arm calling for ball
        const wave = Math.sin(t * 7) * 0.5;
        tm.armRPivot.rotation.z = 1.8 + wave;
        tm.armLPivot.rotation.x = Math.sin(t * 3) * 0.2;
        tm.mesh.position.y = Math.abs(Math.sin(t * 4)) * 0.08;
      });
    }

    // 4. GOALKEEPER (Ready Crouch & Mid-Air Diving Save)
    if (this.goalkeeper) {
      const gk = this.goalkeeper;
      if (gk.vx !== 0) {
        // Full Mid-Air Diving Save
        const diveDir = gk.vx > 0 ? 1 : -1;
        gk.mesh.rotation.z = lerp(gk.mesh.rotation.z, diveDir * (Math.PI / 2.6), 0.3);
        gk.armLPivot.rotation.z = 1.8;
        gk.armRPivot.rotation.z = 1.8;
        gk.mesh.position.y = 0.9;
      } else {
        // Goalkeeper Ready Stance: Crouch low and shuffle
        gk.mesh.rotation.z = lerp(gk.mesh.rotation.z, 0, 0.2);
        gk.armLPivot.rotation.z = 0.6;
        gk.armRPivot.rotation.z = -0.6;
        gk.armLPivot.rotation.x = 0.4;
        gk.armRPivot.rotation.x = 0.4;
        gk.legLPivot.rotation.x = 0.3;
        gk.legRPivot.rotation.x = 0.3;
        gk.mesh.position.y = Math.abs(Math.sin(t * 5)) * 0.12;
      }
    }
  }

  loop() {
    if (!this.active) return;

    this.updateAiming();
    this.updatePhysics();
    this.updateAnimations();
    this.updateCameraTracking();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
  }
}

window.match3DEngine = new Match3DEngine();
