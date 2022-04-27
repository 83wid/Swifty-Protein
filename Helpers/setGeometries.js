import { RGBA_ASTC_10x10_Format } from "three";
import { colors } from "./colors";

const setGeometries = ({ atoms, connects, width, height, model, rasmol }) => {
  const scale =  1 + width / height;
  // const scale = width < height ? 1 + width / height : height / width;
  // create Group
  const group = new THREE.Group();

  // atoms cordinates
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  const pos = new THREE.Vector3();

  // Add Atoms  instances to our Group
  for (let i = 0; i < atoms.length; i++) {
    let atomMesh = new THREE.Mesh(
      model == 0
        ? new THREE.SphereGeometry(scale / 3, 32, 16)
        : new THREE.BoxGeometry(scale / 3, scale / 3, scale / 3),
      new THREE.MeshPhongMaterial({
        color: rasmol
          ? colors[atoms[i].name].rasmol
          : colors[atoms[i].name].jmol,
        transparent: true,
        opacity: model == 1 ? 0 : model == 0 ? 1 : 0.8,
      })
    );

    pos.x = atoms[i].x;
    pos.y = atoms[i].y;
    pos.z = atoms[i].z;
    pos.multiplyScalar(scale);
    atomMesh.position.copy(pos);
    atomMesh.info = atoms[i];
    group.add(atomMesh);
  }

  if (model == 1) {
    // Add Connections  instances to our Group
    for (let i = 0; i < connects.length; i++) {
      for (let j = 1; j < connects[i].length; j++) {
        const initCords = Number(connects[i][0]) - 1;
        const nextCords = Number(connects[i][j]) - 1;
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
            scale / 10,
            scale / 10,
            start.distanceTo(end)
          );
          const box = new THREE.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({ color: rasmol ? 0xffffff : 0xE9DCC9 })
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
  if (model == 0) {
    for (let i = 0; i < connects.length; i++) {
      for (let j = 1; j < connects[i].length; j++) {
        const initCords = Number(connects[i][0]) - 1;
        const nextCords = Number(connects[i][j]) - 1;
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
            scale / 10,
            scale / 10,
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
            new THREE.MeshPhongMaterial({ color: rasmol ? 0xffffff : 0xE9DCC9 })
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
