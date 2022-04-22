import { colors } from "./colors";

const setGeometries = ({ atoms, connect, width, height, model, rasmol }) => {
  const scale = width < height ? 1 + width / height : 1 + height / width;
  // create Group
  const group = new THREE.Group();

  // atoms cordinates
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  const pos = new THREE.Vector3();

  // Add Atoms  instances to our Group
  if (model != 2) {
    for (let i = 0; i < atoms.length; i++) {
      let atomMesh = new THREE.Mesh(
        model == 1
          ? new THREE.SphereGeometry(0.4, 32, 16)
          : new THREE.BoxGeometry(0.6, 0.6, 0.6),
        new THREE.MeshPhongMaterial({})
      );
      pos.x = atoms[i].x;
      pos.y = atoms[i].y;
      pos.z = atoms[i].z;
      pos.multiplyScalar(scale);
      atomMesh.position.copy(pos);
      atomMesh.info = atoms[i];
      atomMesh.material.color.set(
        rasmol ? colors[atoms[i].name].rasmol : colors[atoms[i].name].jmol
      );
      group.add(atomMesh);
    }
  }
  if (model == 2) {
    // Add Connections  instances to our Group
    for (let i = 0; i < connect.length; i++) {
      for (let j = 1; j < connect[i].length; j++) {
        const initCords = Number(connect[i][0]) - 1;
        const nextCords = Number(connect[i][j]) - 1;
        if (initCords < atoms.length - 1 && nextCords < atoms.length) {
          start.x = atoms[initCords].x;
          start.y = atoms[initCords].y;
          start.z = atoms[initCords].z;
          end.x = atoms[nextCords].x;
          end.y = atoms[nextCords].y;
          end.z = atoms[nextCords].z;
          start.multiplyScalar(scale);
          end.multiplyScalar(scale);
          const geometry = new THREE.BoxGeometry(
            0.2,
            0.2,
            start.distanceTo(end)
          );
          const box = new THREE.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({ color: 0xffffff })
          );
          const mid = start;
          mid.lerp(end, 0.5);
          box.position.copy(mid);
          box.lookAt(end);

          group.add(box);
        }
      }
    }
  }
  // Add Connections  instances to our Group
  if (model == 1) {
    for (let i = 0; i < connect.length; i++) {
      for (let j = 1; j < connect[i].length; j++) {
        const initCords = Number(connect[i][0]) - 1;
        const nextCords = Number(connect[i][j]) - 1;
        if (initCords < atoms.length - 1 && nextCords < atoms.length) {
          start.x = atoms[initCords].x;
          start.y = atoms[initCords].y;
          start.z = atoms[initCords].z;
          end.x = atoms[nextCords].x;
          end.y = atoms[nextCords].y;
          end.z = atoms[nextCords].z;
          start.multiplyScalar(scale);
          end.multiplyScalar(scale);
          const geometry = new THREE.CylinderGeometry(
            0.2,
            0.2,
            start.distanceTo(end),
            64
          );
          const sub = new THREE.Vector3();
          sub.subVectors(end, start).normalize();
          geometry.applyQuaternion(
            new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              sub
            )
          );
          const cylinder = new THREE.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({ color: 0xffffff })
          );
          const mid = start;
          mid.lerp(end, 0.5);
          cylinder.position.copy(mid);
          group.add(cylinder);
        }
      }
    }
  }

  return group;
};

export default setGeometries;
