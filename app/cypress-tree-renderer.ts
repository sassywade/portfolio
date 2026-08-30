/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars, prefer-const */
// @ts-nocheck

const global = typeof window !== "undefined" ? window : undefined;

  const DEFAULTS = { breeze: 0.34, gust: 0.52, elasticity: 0.38, tempo: 0.31 };
  const LEAF_GRID_X = 8;
  const LEAF_GRID_Y = 6;
  const LEAF_OFFSET_LIMIT = 0.0042;
  const bones = [
    { parent: -1, start: [0.50, 0.03], end: [0.51, 0.60], pivot: [0.50, 0.08], radius: 0.19, stiffness: 4.2, damping: 4.8, mass: 2.8, response: 0.30, gust: 0.26, frequency: 0.52, phase: 0.18, delay: 0.00, maxAngle: 0.040, inherit: 0.00 },
    { parent: 0, start: [0.48, 0.22], end: [0.13, 0.48], pivot: [0.48, 0.22], radius: 0.15, stiffness: 5.0, damping: 3.8, mass: 1.55, response: 0.58, gust: 0.52, frequency: 0.76, phase: 1.60, delay: 0.08, maxAngle: 0.085, inherit: 0.72 },
    { parent: 0, start: [0.53, 0.23], end: [0.91, 0.48], pivot: [0.53, 0.23], radius: 0.15, stiffness: 5.3, damping: 3.65, mass: 1.45, response: 0.62, gust: 0.56, frequency: 0.82, phase: 3.05, delay: 0.10, maxAngle: 0.090, inherit: 0.70 },
    { parent: 1, start: [0.49, 0.39], end: [0.15, 0.66], pivot: [0.49, 0.39], radius: 0.13, stiffness: 6.0, damping: 3.0, mass: 1.05, response: 0.80, gust: 0.72, frequency: 1.06, phase: 2.32, delay: 0.16, maxAngle: 0.125, inherit: 0.62 },
    { parent: 2, start: [0.54, 0.39], end: [0.88, 0.66], pivot: [0.54, 0.39], radius: 0.13, stiffness: 6.1, damping: 2.9, mass: 1.00, response: 0.84, gust: 0.76, frequency: 1.12, phase: 4.18, delay: 0.18, maxAngle: 0.130, inherit: 0.60 },
    { parent: 3, start: [0.50, 0.55], end: [0.20, 0.86], pivot: [0.50, 0.55], radius: 0.13, stiffness: 6.8, damping: 2.35, mass: 0.75, response: 1.00, gust: 0.90, frequency: 1.42, phase: 0.92, delay: 0.25, maxAngle: 0.160, inherit: 0.54 },
    { parent: 4, start: [0.55, 0.56], end: [0.84, 0.86], pivot: [0.55, 0.56], radius: 0.13, stiffness: 6.9, damping: 2.25, mass: 0.72, response: 1.04, gust: 0.94, frequency: 1.50, phase: 5.06, delay: 0.27, maxAngle: 0.165, inherit: 0.52 },
    { parent: 0, start: [0.51, 0.57], end: [0.52, 0.97], pivot: [0.51, 0.57], radius: 0.18, stiffness: 7.5, damping: 1.9, mass: 0.55, response: 1.16, gust: 1.02, frequency: 1.72, phase: 2.76, delay: 0.30, maxAngle: 0.185, inherit: 0.48 }
  ];

  const treeVertex = `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    attribute vec4 a_weights0;
    attribute vec4 a_weights1;
    uniform vec2 u_bone_pivots[8];
    uniform float u_bone_angles[8];
    varying vec2 v_uv;
    varying float v_leaf_zone;
    varying float v_outer;
    vec2 rotate_around(vec2 point, vec2 pivot, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      vec2 offset = point - pivot;
      return pivot + vec2(offset.x * c - offset.y * s, offset.x * s + offset.y * c);
    }
    void main() {
      float crown = a_uv.y;
      float outer = smoothstep(0.10, 0.92, abs(a_uv.x - 0.52) * 2.08);
      float leaf_zone = smoothstep(0.62, 0.98, crown) * (0.42 + outer * 0.58);
      vec2 position = a_position;
      position += (rotate_around(a_position, u_bone_pivots[0], u_bone_angles[0]) - a_position) * a_weights0.x;
      position += (rotate_around(a_position, u_bone_pivots[1], u_bone_angles[1]) - a_position) * a_weights0.y;
      position += (rotate_around(a_position, u_bone_pivots[2], u_bone_angles[2]) - a_position) * a_weights0.z;
      position += (rotate_around(a_position, u_bone_pivots[3], u_bone_angles[3]) - a_position) * a_weights0.w;
      position += (rotate_around(a_position, u_bone_pivots[4], u_bone_angles[4]) - a_position) * a_weights1.x;
      position += (rotate_around(a_position, u_bone_pivots[5], u_bone_angles[5]) - a_position) * a_weights1.y;
      position += (rotate_around(a_position, u_bone_pivots[6], u_bone_angles[6]) - a_position) * a_weights1.z;
      position += (rotate_around(a_position, u_bone_pivots[7], u_bone_angles[7]) - a_position) * a_weights1.w;
      gl_Position = vec4(position, 0.0, 1.0);
      v_uv = a_uv;
      v_leaf_zone = leaf_zone;
      v_outer = outer;
    }
  `;

  const treeFragment = `
    precision highp float;
    uniform sampler2D u_tree;
    uniform sampler2D u_leaf_motion;
    uniform float u_time;
    uniform float u_breeze;
    uniform float u_gust;
    uniform float u_tempo;
    uniform vec2 u_pointer;
    uniform float u_pointer_active;
    varying vec2 v_uv;
    varying float v_leaf_zone;
    varying float v_outer;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main() {
      vec4 source = texture2D(u_tree, v_uv);
      float green_bias = source.g - source.r;
      float leafness = max(smoothstep(-0.015, 0.12, green_bias), v_leaf_zone * 0.55) * source.a;
      float motion_time = u_time * (0.00031 + u_tempo * 0.0012);
      float leaf_flutter = sin(v_uv.x * 146.0 + v_uv.y * 71.0 - motion_time * 8.0 + hash(floor(v_uv * 18.0)) * 6.2831);
      vec2 leaf_cell = (floor(v_uv * vec2(8.0, 6.0)) + 0.5) / vec2(8.0, 6.0);
      vec2 leaf_offset = (texture2D(u_leaf_motion, leaf_cell).rg * 2.0 - 1.0) * 0.0042;
      float wake = exp(-distance(v_uv, u_pointer) * 34.0) * u_pointer_active * v_leaf_zone;
      leaf_offset += vec2(wake * 0.0009, wake * 0.00022) * clamp(u_breeze + u_gust, 0.15, 1.2);
      vec4 leaf_color = texture2D(u_tree, v_uv + leaf_offset * (0.48 + v_leaf_zone * 0.52));
      vec4 color = mix(source, leaf_color, smoothstep(0.12, 0.72, leafness));
      color.rgb *= 1.0 + (leaf_flutter * 0.5 + 0.5) * 0.026 * u_breeze * leafness;
      gl_FragColor = color;
    }
  `;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function createCypressTree(options) {
    const config = options || {};
    const canvas = config.canvas;
    if (!canvas) throw new Error('CypressTree needs a canvas element.');
    const image = new Image();
    image.src = config.assetUrl || 'assets/monterey-cypress.png';
    const wind = { ...DEFAULTS, ...(config.wind || {}) };
    const states = bones.map(() => ({ angle: 0, velocity: 0, worldAngle: 0 }));
    const leafGroups = Array.from({ length: LEAF_GRID_X * LEAF_GRID_Y }, (_, index) => {
      const gridX = index % LEAF_GRID_X;
      const gridY = Math.floor(index / LEAF_GRID_X);
      return {
        x: (gridX + 0.5) / LEAF_GRID_X,
        y: 0.57 + (gridY + 0.5) / LEAF_GRID_Y * 0.40,
        phase: index * 1.731,
        stiffness: 8.0 + (index % 3) * 0.9,
        damping: 3.5 + (index % 4) * 0.35,
        response: 0.76 + (gridY / Math.max(1, LEAF_GRID_Y - 1)) * 0.46,
        state: { x: 0, y: 0, velocityX: 0, velocityY: 0 }
      };
    });

    let width = 1;
    let height = 1;
    let dpr = 1;
    let treeRect = { x: 0, y: 0, width: 0, height: 0 };
    let elapsed = 0;
    let lastFrame = performance.now();
    let running = config.autoplay !== false;
    let pointerActive = false;
    let pointer = { x: 0.52, y: 0.42 };
    let gl = null;
    let fallback = null;
    let programHandle = null;
    let texture = null;
    let leafMotionTexture = null;
    let treeBuffer = null;
    let indexBuffer = null;
    let indexCount = 0;
    let bonePivots = new Float32Array(16);
    let boneAngles = new Float32Array(8);
    let frameHandle = 0;
    let destroyed = false;
    const petGust = { direction: 1, strength: 0, elapsed: 0, duration: 0, settleDuration: 0 };
    const leafMotionData = new Uint8Array(LEAF_GRID_X * LEAF_GRID_Y * 4);

    function encodeSigned(value) { return Math.round(clamp(value / LEAF_OFFSET_LIMIT * 0.5 + 0.5, 0, 1) * 255); }
    function updateLeafMotionTexture() {
      leafGroups.forEach((group, index) => {
        const offset = index * 4;
        leafMotionData[offset] = encodeSigned(group.state.x);
        leafMotionData[offset + 1] = encodeSigned(group.state.y);
        leafMotionData[offset + 2] = 128;
        leafMotionData[offset + 3] = 255;
      });
      if (gl && leafMotionTexture) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, leafMotionTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, LEAF_GRID_X, LEAF_GRID_Y, gl.RGBA, gl.UNSIGNED_BYTE, leafMotionData);
      }
    }

    function shader(type, source) {
      const result = gl.createShader(type);
      gl.shaderSource(result, source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result) || 'shader compile failed');
      return result;
    }

    function createProgram() {
      const result = gl.createProgram();
      gl.attachShader(result, shader(gl.VERTEX_SHADER, treeVertex));
      gl.attachShader(result, shader(gl.FRAGMENT_SHADER, treeFragment));
      gl.linkProgram(result);
      if (!gl.getProgramParameter(result, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(result) || 'program link failed');
      return result;
    }

    function textureFrom(source) {
      const result = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, result);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      return result;
    }

    function distanceToSegment(px, py, ax, ay, bx, by) {
      const dx = bx - ax;
      const dy = by - ay;
      const lengthSquared = dx * dx + dy * dy || 1;
      const t = clamp(((px - ax) * dx + (py - ay) * dy) / lengthSquared, 0, 1);
      const ox = px - (ax + dx * t);
      const oy = py - (ay + dy * t);
      return Math.sqrt(ox * ox + oy * oy);
    }

    function boneWeights(x, y) {
      const weights = bones.map((bone) => {
        const distance = distanceToSegment(x, y, bone.start[0], bone.start[1], bone.end[0], bone.end[1]);
        return Math.exp(-Math.pow(distance / bone.radius, 2) * 1.65);
      });
      const outer = clamp(Math.abs(x - 0.50) * 2.2, 0, 1);
      const leafHardness = clamp((y - 0.48) / 0.36, 0, 1) * (0.42 + outer * 0.58);
      const dominant = weights.reduce((best, weight, index) => weight > weights[best] ? index : best, 0);
      if (leafHardness > 0.04) weights.forEach((weight, index) => { weights[index] = weight * (1 - leafHardness); });
      weights[dominant] += leafHardness;
      const total = weights.reduce((sum, weight) => sum + weight, 0) || 1;
      return weights.map((weight) => weight / total);
    }

    function pointToClip(u, v) { return [(treeRect.x + u * treeRect.width) / width * 2 - 1, 1 - (treeRect.y + (1 - v) * treeRect.height) / height * 2]; }
    function rotatePoint(point, pivot, angle) {
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const x = point[0] - pivot[0];
      const y = point[1] - pivot[1];
      return [pivot[0] + x * cosine - y * sine, pivot[1] + x * sine + y * cosine];
    }

    function updateBonePivots() {
      const values = [];
      bones.forEach((bone, index) => {
        let pivot = [...bone.pivot];
        const ancestors = [];
        let parent = bone.parent;
        while (parent >= 0) { ancestors.unshift(parent); parent = bones[parent].parent; }
        ancestors.forEach((ancestor) => { pivot = rotatePoint(pivot, bones[ancestor].pivot, states[ancestor].angle); });
        values.push(...pointToClip(pivot[0], pivot[1]));
      });
      bonePivots = new Float32Array(values);
    }

    function updatePhysics(deltaMs) {
      const dt = Math.min(0.035, Math.max(0.001, deltaMs / 1000));
      const time = elapsed * 0.001;
      if (petGust.duration > 0) petGust.elapsed += deltaMs;
      const gustProgress = petGust.duration > 0 ? petGust.elapsed / petGust.duration : 2;
      const gustAttack = clamp(gustProgress / 0.13, 0, 1);
      const gustRelease = clamp((1 - gustProgress) / 0.24, 0, 1);
      const gustEnvelope = gustProgress <= 1
        ? gustAttack * gustRelease * (0.84 + Math.sin(gustProgress * Math.PI * 8.0) * 0.16)
        : 0;
      bones.forEach((bone, index) => {
        const state = states[index];
        const delayedTime = time * (0.75 + wind.tempo * 0.70) - bone.delay;
        const swell = 0.56 + 0.44 * Math.sin(delayedTime * bone.frequency * 1.27 + bone.phase);
        const gustWave = Math.max(0, Math.sin(delayedTime * (0.64 + wind.tempo * 0.35) - bone.phase * 0.31));
        const gustPulse = Math.pow(gustWave, 6.0);
        const turbulence = 0.72 + 0.28 * Math.sin(delayedTime * bone.frequency * 2.35 + bone.phase * 1.7);
        const naturalDrive = (0.006 + wind.breeze * 0.032 * bone.response) * swell * turbulence + wind.gust * gustPulse * 0.082 * bone.gust;
        const petTurbulence = 0.88 + Math.sin(time * 15.0 + bone.phase * 1.9) * 0.12;
        const petDrive = petGust.direction * petGust.strength * gustEnvelope * petTurbulence * (0.082 + bone.response * 0.068);
        const drive = naturalDrive + petDrive;
        const dynamicMaxAngle = bone.maxAngle * (1 + petGust.strength * gustEnvelope * 0.62);
        const target = clamp(drive, -dynamicMaxAngle, dynamicMaxAngle);
        const stiffness = bone.stiffness * (1.18 - wind.elasticity * 0.38);
        const damping = bone.damping * (1.12 - wind.elasticity * 0.22);
        state.velocity += ((target - state.angle) * stiffness / bone.mass - state.velocity * damping) * dt;
        state.angle = clamp(state.angle + state.velocity * dt, -dynamicMaxAngle, dynamicMaxAngle);
        if (Math.abs(state.angle) >= dynamicMaxAngle * 0.995) state.velocity *= 0.72;
        state.worldAngle = state.angle + (bone.parent >= 0 ? states[bone.parent].worldAngle * bone.inherit : 0);
        boneAngles[index] = state.worldAngle;
      });
      updateBonePivots();
      leafGroups.forEach((group) => {
        const state = group.state;
        const localTime = time * (1.0 + wind.tempo * 0.85) - group.phase * 0.035;
        const gustWave = Math.max(0, Math.sin(localTime * 0.72 - group.x * 2.3 + group.y * 1.4));
        const gustPulse = Math.pow(gustWave, 6.0);
        const flutter = Math.sin(localTime * (2.8 + wind.tempo * 1.5) + group.phase) * 0.5 + 0.5;
        const petLeafFlutter = 0.82 + Math.sin(time * 17.0 + group.phase * 1.4) * 0.18;
        const petLeafPush = petGust.direction * petGust.strength * gustEnvelope * petLeafFlutter * 0.00255 * group.response;
        const targetX = (Math.sin(localTime * 1.35 + group.phase) * 0.00034 + wind.breeze * 0.00050 * flutter) * group.response + wind.gust * gustPulse * 0.00155 * group.response + petLeafPush;
        const targetY = Math.cos(localTime * 1.72 + group.phase * 1.2) * (0.00010 + wind.breeze * 0.00018) * group.response + gustPulse * 0.00024 * group.response + Math.abs(petLeafPush) * 0.16;
        const spring = group.stiffness * (1.08 - wind.elasticity * 0.16);
        const damping = group.damping * (1.04 - wind.elasticity * 0.10);
        state.velocityX += ((targetX - state.x) * spring - state.velocityX * damping) * dt;
        state.velocityY += ((targetY - state.y) * spring - state.velocityY * damping) * dt;
        state.x = clamp(state.x + state.velocityX * dt, -LEAF_OFFSET_LIMIT, LEAF_OFFSET_LIMIT);
        state.y = clamp(state.y + state.velocityY * dt, -LEAF_OFFSET_LIMIT, LEAF_OFFSET_LIMIT);
      });
      updateLeafMotionTexture();
      if (petGust.duration > 0 && petGust.elapsed >= petGust.duration + petGust.settleDuration) {
        petGust.strength = 0;
        petGust.duration = 0;
        petGust.settleDuration = 0;
      }
    }

    function createTreeMesh() {
      if (!gl || !programHandle) return;
      const columns = 76;
      const rows = 100;
      const vertices = [];
      const indices = [];
      for (let row = 0; row <= rows; row += 1) {
        const v = row / rows;
        for (let column = 0; column <= columns; column += 1) {
          const u = column / columns;
          const x = treeRect.x + u * treeRect.width;
          const y = treeRect.y + v * treeRect.height;
          vertices.push(x / width * 2 - 1, 1 - y / height * 2, u, 1 - v, ...boneWeights(u, 1 - v));
        }
      }
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const topLeft = row * (columns + 1) + column;
          const topRight = topLeft + 1;
          const bottomLeft = topLeft + columns + 1;
          const bottomRight = bottomLeft + 1;
          indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
        }
      }
      if (!treeBuffer) treeBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, treeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      if (!indexBuffer) indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      indexCount = indices.length;
      updateBonePivots();
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width || canvas.clientWidth || 1);
      height = Math.max(1, bounds.height || canvas.clientHeight || 1);
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      const aspect = image.naturalWidth / Math.max(1, image.naturalHeight) || 0.80;
      const treeHeight = Math.min(height * 0.96, width * 0.94 / aspect);
      treeRect = { x: width * 0.5 - treeHeight * aspect * 0.5, y: height * 0.01, width: treeHeight * aspect, height: treeHeight };
      if (gl) { gl.viewport(0, 0, canvas.width, canvas.height); createTreeMesh(); }
      if (fallback) fallback.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFallback() {
      if (!fallback) return;
      fallback.clearRect(0, 0, width, height);
      if (!image.naturalWidth) return;
      fallback.save();
      fallback.translate(width * 0.5, height * 0.52);
      fallback.rotate(states[0].angle);
      fallback.drawImage(image, -treeRect.width * 0.5, -treeRect.height * 0.51, treeRect.width, treeRect.height);
      fallback.restore();
    }

    function drawWebGL() {
      if (!gl || !programHandle || !texture || !leafMotionTexture || !indexCount) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(programHandle);
      gl.bindBuffer(gl.ARRAY_BUFFER, treeBuffer);
      const stride = 48;
      gl.enableVertexAttribArray(programHandle._position);
      gl.vertexAttribPointer(programHandle._position, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(programHandle._uv);
      gl.vertexAttribPointer(programHandle._uv, 2, gl.FLOAT, false, stride, 8);
      gl.enableVertexAttribArray(programHandle._weights0);
      gl.vertexAttribPointer(programHandle._weights0, 4, gl.FLOAT, false, stride, 16);
      gl.enableVertexAttribArray(programHandle._weights1);
      gl.vertexAttribPointer(programHandle._weights1, 4, gl.FLOAT, false, stride, 32);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(programHandle._uniforms.tree, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, leafMotionTexture);
      gl.uniform1i(programHandle._uniforms.leafMotion, 1);
      gl.uniform1f(programHandle._uniforms.time, elapsed);
      gl.uniform1f(programHandle._uniforms.breeze, wind.breeze);
      gl.uniform1f(programHandle._uniforms.gust, wind.gust);
      gl.uniform1f(programHandle._uniforms.tempo, wind.tempo);
      gl.uniform2fv(programHandle._uniforms.bonePivots, bonePivots);
      gl.uniform1fv(programHandle._uniforms.boneAngles, boneAngles);
      gl.uniform2f(programHandle._uniforms.pointer, pointer.x, 1 - pointer.y);
      gl.uniform1f(programHandle._uniforms.pointerActive, pointerActive ? 1 : 0);
      gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    }

    function updatePointer(event) {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = clamp((event.clientX - bounds.left) / Math.max(1, bounds.width), 0, 1);
      pointer.y = clamp((event.clientY - bounds.top) / Math.max(1, bounds.height), 0, 1);
      pointerActive = true;
    }

    function setPlaying(next) { running = Boolean(next); return running; }
    function setWind(values) { Object.keys(DEFAULTS).forEach((key) => { if (values && Number.isFinite(Number(values[key]))) wind[key] = clamp(Number(values[key]), 0, 1); }); return { ...wind }; }
    function applyGust(values) {
      const next = values || {};
      petGust.direction = Number(next.direction) < 0 ? -1 : 1;
      petGust.strength = clamp(Number(next.strength) || 1, 0.2, 1.35);
      petGust.elapsed = 0;
      petGust.duration = clamp(Number(next.duration) || 1450, 420, 2600);
      petGust.settleDuration = 1800;
      states.forEach((state, index) => {
        state.velocity += petGust.direction * petGust.strength * (index === 0 ? 0.012 : 0.028 + index * 0.003);
      });
      return { ...petGust };
    }

    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: false });
      if (!gl) throw new Error('WebGL unavailable');
      programHandle = createProgram();
      programHandle._position = gl.getAttribLocation(programHandle, 'a_position');
      programHandle._uv = gl.getAttribLocation(programHandle, 'a_uv');
      programHandle._weights0 = gl.getAttribLocation(programHandle, 'a_weights0');
      programHandle._weights1 = gl.getAttribLocation(programHandle, 'a_weights1');
      programHandle._uniforms = {
        time: gl.getUniformLocation(programHandle, 'u_time'), breeze: gl.getUniformLocation(programHandle, 'u_breeze'), gust: gl.getUniformLocation(programHandle, 'u_gust'), tempo: gl.getUniformLocation(programHandle, 'u_tempo'), pointer: gl.getUniformLocation(programHandle, 'u_pointer'), pointerActive: gl.getUniformLocation(programHandle, 'u_pointer_active'), tree: gl.getUniformLocation(programHandle, 'u_tree'), leafMotion: gl.getUniformLocation(programHandle, 'u_leaf_motion'), bonePivots: gl.getUniformLocation(programHandle, 'u_bone_pivots[0]'), boneAngles: gl.getUniformLocation(programHandle, 'u_bone_angles[0]')
      };
      leafMotionTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, leafMotionTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, LEAF_GRID_X, LEAF_GRID_Y, 0, gl.RGBA, gl.UNSIGNED_BYTE, leafMotionData);
    } catch (_) {
      gl = null;
      fallback = canvas.getContext('2d', { alpha: true });
    }

    const pointerMove = (event) => updatePointer(event);
    const pointerLeave = () => { pointerActive = false; };
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerleave', pointerLeave);
    global.addEventListener('resize', resize);
    image.addEventListener('load', () => { resize(); if (gl) texture = textureFrom(image); canvas.parentElement?.classList.add('is-live'); });
    if (image.complete && image.naturalWidth) { resize(); if (gl) texture = textureFrom(image); canvas.parentElement?.classList.add('is-live'); }
    resize();

    function frame(now) {
      if (destroyed) return;
      const delta = Math.min(60, now - lastFrame);
      lastFrame = now;
      if (running || petGust.duration > 0) { elapsed += delta; updatePhysics(delta); }
      if (gl && texture) drawWebGL(); else drawFallback();
      frameHandle = global.requestAnimationFrame(frame);
    }
    frameHandle = global.requestAnimationFrame(frame);

    return {
      setWind,
      getWind: () => ({ ...wind }),
      applyGust,
      setPlaying,
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      toggle: () => setPlaying(!running),
      isPlaying: () => running,
      resize,
      destroy: () => {
        destroyed = true;
        global.cancelAnimationFrame(frameHandle);
        canvas.removeEventListener('pointermove', pointerMove);
        canvas.removeEventListener('pointerleave', pointerLeave);
        global.removeEventListener('resize', resize);
        if (gl) { if (texture) gl.deleteTexture(texture); if (leafMotionTexture) gl.deleteTexture(leafMotionTexture); if (treeBuffer) gl.deleteBuffer(treeBuffer); if (indexBuffer) gl.deleteBuffer(indexBuffer); }
      }
    };
  }
