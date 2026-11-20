import {
  CatmullRomCurve3,
  Color,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  MathUtils,
  Object3D,
  Shape,
  ExtrudeGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";

export function createAvatar() {
  // TODO(avatar.glb): replace the sculpt with the final Draco bust at this rig
  // boundary. Keep the head pivot and the two pupil pivots for gaze tracking.
  const bust = new Group();
  const head = new Group();
  head.position.y = 0.23;
  bust.add(head);
  const ball = new SphereGeometry(1, 32, 24);
  const material = (color, roughness = 0.42, metalness = 0) =>
    new MeshStandardMaterial({ color, roughness, metalness });
  const skin = material(0xb87955, 0.48);
  const innerEar = material(0xad664b);
  const hair = material(0x241b1c, 0.34);
  const jacket = material(0x33313b, 0.44);
  const collar = material(0x50505c);
  const cream = material(0xe6d6b7, 0.68);
  const dark = material(0x352024);
  const teeth = material(0xfff1d7);
  const silver = material(0xb5b2bc, 0.25, 0.75);

  function oval(parent, mat, position, scale) {
    const mesh = new Mesh(ball, mat);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }
  function profile(parent, mat, points, depth) {
    const mesh = new Mesh(
      new LatheGeometry(
        points.map(([r, y]) => new Vector2(r, y)),
        64,
      ),
      mat,
    );
    mesh.scale.z = depth;
    parent.add(mesh);
    return mesh;
  }
  function stroke(parent, mat, points, radius) {
    const path = new CatmullRomCurve3(points.map((p) => new Vector3(...p)));
    const mesh = new Mesh(new TubeGeometry(path, 18, radius, 8, false), mat);
    parent.add(mesh);
  }
  function patch(parent, mat, outline, z, thickness = 0.025) {
    const shape = new Shape(outline.map(([x, y]) => new Vector2(x, y)));
    const mesh = new Mesh(
      new ExtrudeGeometry(shape, {
        depth: thickness,
        bevelSegments: 2,
        bevelSize: 0.014,
        bevelThickness: 0.012,
      }),
      mat,
    );
    mesh.position.z = z;
    parent.add(mesh);
    return mesh;
  }

  // A cropped jacket bust with a ribbed neckline, folded lapels and metal snaps.
  profile(
    bust,
    jacket,
    [
      [0, -1.58],
      [0.77, -1.58],
      [0.98, -1.51],
      [1.03, -1.39],
      [0.96, -1.12],
      [0.83, -0.97],
      [0.6, -0.84],
      [0.34, -0.79],
      [0, -0.79],
    ],
    0.58,
  );
  oval(bust, skin, [0, -0.76, 0], [0.34, 0.41, 0.32]);
  // The insert sits just in front of the jacket, with the lapels over it.
  patch(
    bust,
    cream,
    [
      [-0.32, -0.88],
      [0, -1.02],
      [0.32, -0.88],
      [0.16, -1.56],
      [-0.15, -1.56],
    ],
    0.602,
  );
  for (const side of [-1, 1]) {
    patch(
      bust,
      collar,
      [
        [side * 0.31, -0.81],
        [side * 0.56, -0.98],
        [side * 0.35, -1.16],
        [side * 0.16, -1.01],
      ],
      0.646,
    );
    oval(bust, silver, [side * 0.386, -1.036, 0.691], [0.027, 0.027, 0.013]);
  }
  stroke(
    bust,
    silver,
    [
      [-0.16, -1.56, 0.64],
      [-0.2, -1.32, 0.64],
      [-0.26, -1.07, 0.64],
    ],
    0.013,
  );

  const contour = new CatmullRomCurve3(
    [
      [0, -0.94],
      [0.26, -0.9],
      [0.48, -0.79],
      [0.65, -0.6],
      [0.77, -0.28],
      [0.81, 0.08],
      [0.79, 0.46],
      [0.7, 0.72],
      [0.49, 0.88],
      [0, 0.95],
    ].map(([r, y]) => new Vector3(r, y, 0)),
  );
  const faceMat = material(0xffffff, 0.51);
  faceMat.vertexColors = true;
  const skull = profile(
    head,
    faceMat,
    contour.getPoints(58).map(({ x, y }) => [x, y]),
    0.9,
  );
  const beard = new Color(0x4b3230);
  const faceColor = new Color();
  const colors = [];
  const positions = skull.geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i),
      z = positions.getZ(i);
    const beardLine = -0.69 + 0.58 * Math.pow(Math.abs(x) / 0.82, 1.6);
    const stubble =
      (1 - MathUtils.smoothstep(y, beardLine - 0.02, beardLine + 0.055)) *
      MathUtils.smoothstep(z, -0.45, 0.12);
    faceColor.copy(skin.color).lerp(beard, stubble * 0.94);
    colors.push(faceColor.r, faceColor.g, faceColor.b);
  }
  skull.geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  for (const side of [-1, 1]) {
    oval(
      head,
      skin,
      [side * 0.785, -0.06, 0.015],
      [0.18, 0.26, 0.16],
    ).rotation.z = -side * 0.15;
    oval(head, innerEar, [side * 0.85, -0.06, 0.138], [0.074, 0.14, 0.037]);
  }

  // A tapered hairline at the temples with overlapping, swept locks on the crown.
  oval(head, hair, [0, 0.64, -0.07], [0.85, 0.49, 0.74]);
  for (const side of [-1, 1])
    oval(head, hair, [side * 0.736, 0.33, -0.035], [0.12, 0.43, 0.43]);
  // Reuse one tapered, curved lock across the crown. Stagger the hairline
  // and change the curl angle so the hair reads as a sculpted mass.
  const curlPath = new CatmullRomCurve3(
    [
      [-0.23, -0.1, -0.07],
      [-0.18, 0.09, -0.01],
      [-0.04, 0.2, 0.015],
      [0.12, 0.17, 0.04],
      [0.21, 0.045, 0.06],
      [0.16, -0.095, 0.09],
      [0.04, -0.12, 0.11],
    ].map((p) => new Vector3(...p)),
  );
  const curl = new TubeGeometry(curlPath, 24, 0.108, 12, false);
  const vertex = new Vector3();
  const buffer = curl.getAttribute("position");
  for (let row = 0; row <= 24; row++) {
    const center = curlPath.getPointAt(row / 24);
    const radius = 0.25 + 0.85 * Math.pow(Math.sin((Math.PI * row) / 24), 0.6);
    for (let side = 0; side <= 12; side++) {
      const i = row * 13 + side;
      vertex
        .fromBufferAttribute(buffer, i)
        .sub(center)
        .multiplyScalar(radius)
        .add(center);
      buffer.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  }
  const locks = new InstancedMesh(curl, hair, 24);
  const pose = new Object3D();
  for (let i = 0; i < locks.count; i++) {
    const row = Math.floor(i / 8);
    const t = (i % 8) / 7;
    const angle = (t - 0.5) * Math.PI * 1.09 + row * 0.09;
    const wave = Math.sin(i * 2.7);
    pose.position.set(
      Math.sin(angle) * (0.74 - row * 0.07),
      0.65 + row * 0.14 + 0.13 * Math.cos(angle) + wave * 0.053,
      Math.cos(angle) * 0.66 - row * 0.28 + 0.01,
    );
    pose.rotation.set(-0.14 - row * 0.24, angle * 0.72, wave * 0.58 - 0.28);
    pose.scale.setScalar(0.95 + 0.17 * Math.sin(i * 1.9));
    pose.updateMatrix();
    locks.setMatrixAt(i, pose.matrix);
  }
  head.add(locks);

  const pupils = [];
  const white = material(0xfff3de, 0.27);
  const iris = material(0x75442b, 0.24);
  const pupil = material(0x21181b, 0.19);
  for (const side of [-1, 1]) {
    const eye = new Group();
    eye.position.set(side * 0.307, 0.1, 0.651);
    eye.rotation.y = side * 0.26;
    head.add(eye);
    oval(eye, white, [0, 0, 0], [0.195, 0.152, 0.105]);
    const gaze = new Group();
    gaze.position.z = 0.105;
    eye.add(gaze);
    oval(gaze, iris, [0, 0, 0], [0.111, 0.121, 0.036]);
    oval(gaze, pupil, [0, 0, 0.028], [0.072, 0.089, 0.023]);
    oval(gaze, white, [-0.028, 0.043, 0.051], [0.024, 0.027, 0.009]);
    gaze.userData.restX = gaze.position.x;
    gaze.userData.restY = gaze.position.y;
    pupils.push(gaze);
    const brow = oval(
      head,
      hair,
      [side * 0.322, 0.327 + (side > 0 ? 0.02 : 0), 0.657],
      [0.213, 0.054, 0.06],
    );
    brow.rotation.set(0, side * 0.28, side * 0.08);
  }
  oval(head, skin, [0, -0.105, 0.714], [0.123, 0.183, 0.132]);
  oval(head, skin, [0, -0.21, 0.786], [0.152, 0.105, 0.103]);
  // A curved opening and a separate tooth band follow the front of the jaw.
  function smileSurface(shape, mat, offset) {
    const geom = new ExtrudeGeometry(shape, {
      depth: 0.009,
      bevelEnabled: false,
      curveSegments: 18,
    });
    const vertices = geom.getAttribute("position");
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i),
        y = vertices.getY(i);
      vertices.setZ(
        i,
        vertices.getZ(i) + 0.694 + (y + 0.4) * 0.32 - x * x * 0.54 + offset,
      );
    }
    geom.computeVertexNormals();
    head.add(new Mesh(geom, mat));
  }
  const smile = new Shape();
  smile.moveTo(-0.275, -0.395);
  smile.bezierCurveTo(-0.13, -0.44, 0.11, -0.428, 0.26, -0.365);
  smile.bezierCurveTo(0.16, -0.618, -0.14, -0.653, -0.275, -0.395);
  smileSurface(smile, dark, 0);
  const toothBand = new Shape();
  toothBand.moveTo(-0.236, -0.417);
  toothBand.bezierCurveTo(-0.08, -0.454, 0.1, -0.433, 0.224, -0.391);
  toothBand.bezierCurveTo(0.13, -0.491, -0.12, -0.536, -0.236, -0.417);
  smileSurface(toothBand, teeth, 0.012);
  return {
    bust,
    head,
    pupils,
    restYaw: head.rotation.y,
    restPitch: head.rotation.x,
  };
}
