// import React, { useEffect } from 'react';
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { useState } from "react";
// import * as THREE from "three";

// // Scene component that contains all the Three.js specific logic
// const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere }) => {
//   const { camera } = useThree();
//   const cubeSize = 10;

//   // Constrain sphere within the cube
//   const constrainPosition = (position) => {
//     const halfSize = cubeSize / 2 - 0.3;
//     return [
//       Math.max(-halfSize, Math.min(halfSize, position[0])),
//       Math.max(-halfSize, Math.min(halfSize, position[1])),
//       Math.max(-halfSize, Math.min(halfSize, position[2]))
//     ];
//   };

//   // Handle sphere click
//   const handleClick = (e, id) => {
//     e.stopPropagation();
//     setSelectedSphere(id === selectedSphere ? null : id);
//   };

//   // Handle keyboard movement
//   useEffect(() => {
//     const moveSpeed = 0.2;

//     const handleKeyDown = (e) => {
//       if (selectedSphere === null) return;

//       setSpheres(prevSpheres => {
//         const sphereIndex = prevSpheres.findIndex(s => s.id === selectedSphere);
//         if (sphereIndex === -1) return prevSpheres;

//         const sphere = prevSpheres[sphereIndex];
//         let newPosition = [...sphere.position];

//         // Get camera's forward and right vectors
//         const forward = new THREE.Vector3(0, 0, -1);
//         const right = new THREE.Vector3(1, 0, 0);
//         forward.applyQuaternion(camera.quaternion);
//         right.applyQuaternion(camera.quaternion);
        
//         // Project vectors onto XZ plane for WASD movement
//         forward.y = 0;
//         right.y = 0;
//         forward.normalize();
//         right.normalize();

//         switch (e.key.toLowerCase()) {
//           case 'w':
//           case 'arrowup':
//             newPosition[1] += moveSpeed;
//             break;
//           case 's':
//           case 'arrowdown':
//             newPosition[1] -= moveSpeed;
//             break;
//           case 'a':
//           case 'arrowleft':
//             newPosition[0] -= right.x * moveSpeed;
//             newPosition[2] -= right.z * moveSpeed;
//             break;
//           case 'd':
//           case 'arrowright':
//             newPosition[0] += right.x * moveSpeed;
//             newPosition[2] += right.z * moveSpeed;
//             break;
//           case 'z':  // Shift for up
//             newPosition[0] += forward.x * moveSpeed;
//             newPosition[2] += forward.z * moveSpeed;
//             break;
//           case 'x':  // Control for down
//             newPosition[0] -= forward.x * moveSpeed;
//             newPosition[2] -= forward.z * moveSpeed;
//             break;
//           case 'delete':
//           case 'backspace':
//             removeSphere(selectedSphere);
//             return prevSpheres;
//           default:
//             return prevSpheres;
//         }

//         const constrainedPosition = constrainPosition(newPosition);
//         const newSpheres = [...prevSpheres];
//         newSpheres[sphereIndex] = {
//           ...sphere,
//           position: constrainedPosition
//         };
//         return newSpheres;
//       });
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedSphere, setSpheres, camera.quaternion, removeSphere]);

//   return (
//     <>
//       {/* Controls */}
//       <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

//       {/* Lighting */}
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />

//       {/* Permanent Transparent Cube */}
//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
//         <meshStandardMaterial color="skyblue" transparent={true} opacity={0.1} />
//       </mesh>

//       {/* Movable Spheres */}
//       {spheres.map((sphere) => (
//         <mesh
//           key={sphere.id}
//           position={sphere.position}
//           onClick={(e) => handleClick(e, sphere.id)}
//         >
//           <sphereGeometry args={[0.3, 32, 32]} />
//           <meshStandardMaterial
//             color={selectedSphere === sphere.id ? "red" : "orange"}
//           />
//         </mesh>
//       ))}
//     </>
//   );
// };

// // Main component
// const ThreeDRenderer = () => {
//   const [spheres, setSpheres] = useState([]);
//   const [selectedSphere, setSelectedSphere] = useState(null);

//   // Add a new sphere at a random position
//   const addSphere = () => {
//     const cubeSize = 10;
//     const halfSize = cubeSize / 2;
//     const newSphere = {
//       id: Date.now(), // Use timestamp for unique IDs
//       position: [
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//       ],
//     };
//     setSpheres([...spheres, newSphere]);
//   };

//   // Remove a sphere
//   const removeSphere = (id) => {
//     setSpheres(prevSpheres => prevSpheres.filter(sphere => sphere.id !== id));
//     setSelectedSphere(null);
//   };

//   return (
//     <div className="bg-gray-800 h-full rounded-lg p-4">
//       <h2 className="text-lg font-semibold mb-4 text-white">3D Renderer</h2>

//       {/* Controls Info */}
//       {/* <div className="text-white mb-4">
//         <p>Controls:</p>
//         <ul className="list-disc pl-5">
//           <li>Click a sphere to select/deselect it</li>
//           <li>WASD or Arrow keys: Move relative to camera view</li>
//           <li>Shift: Move up</li>
//           <li>Control: Move down</li>
//           <li>Delete/Backspace: Remove selected sphere</li>
//         </ul>
//       </div> */}

//       {/* Buttons */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={addSphere}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Add Sphere
//         </button>
//         <button
//           onClick={() => selectedSphere !== null && removeSphere(selectedSphere)}
//           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={selectedSphere === null}
//         >
//           Remove Selected Sphere
//         </button>
//       </div>

//       {/* 3D Preview Area */}
//       <div className="border-2 border-dashed border-gray-600 h-[500px] rounded-lg">
//         <Canvas camera={{ position: [15, 15, 15], fov: 60 }}>
//           <Scene
//             spheres={spheres}
//             setSpheres={setSpheres}
//             selectedSphere={selectedSphere}
//             setSelectedSphere={setSelectedSphere}
//             removeSphere={removeSphere}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default ThreeDRenderer;

// import React, { useEffect } from 'react';
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { useState } from "react";
// import * as THREE from "three";

// // Scene component that contains all the Three.js specific logic
// const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere }) => {
//   const { camera } = useThree();
//   const cubeSize = 10;

//   // Constrain sphere within the cube
//   const constrainPosition = (position) => {
//     const halfSize = cubeSize / 2 - 0.3;
//     return [
//       Math.max(-halfSize, Math.min(halfSize, position[0])),
//       Math.max(-halfSize, Math.min(halfSize, position[1])),
//       Math.max(-halfSize, Math.min(halfSize, position[2]))
//     ];
//   };

//   // Handle sphere click
//   const handleClick = (e, id) => {
//     e.stopPropagation();
//     setSelectedSphere(id === selectedSphere ? null : id);
//   };

//   // Handle keyboard movement
//   useEffect(() => {
//     const moveSpeed = 0.2;

//     const handleKeyDown = (e) => {
//       if (selectedSphere === null) return;

//       setSpheres(prevSpheres => {
//         const sphereIndex = prevSpheres.findIndex(s => s.id === selectedSphere);
//         if (sphereIndex === -1) return prevSpheres;

//         const sphere = prevSpheres[sphereIndex];
//         let newPosition = [...sphere.position];

//         // Get camera's forward and right vectors
//         const forward = new THREE.Vector3(0, 0, -1);
//         const right = new THREE.Vector3(1, 0, 0);
//         forward.applyQuaternion(camera.quaternion);
//         right.applyQuaternion(camera.quaternion);
        
//         // Project vectors onto XZ plane for WASD movement
//         forward.y = 0;
//         right.y = 0;
//         forward.normalize();
//         right.normalize();

//         switch (e.key.toLowerCase()) {
//           case 'w':
//           case 'arrowup':
//             newPosition[1] += moveSpeed;
//             break;
//           case 's':
//           case 'arrowdown':
//             newPosition[1] -= moveSpeed;
//             break;
//           case 'a':
//           case 'arrowleft':
//             newPosition[0] -= right.x * moveSpeed;
//             newPosition[2] -= right.z * moveSpeed;
//             break;
//           case 'd':
//           case 'arrowright':
//             newPosition[0] += right.x * moveSpeed;
//             newPosition[2] += right.z * moveSpeed;
//             break;
//           case 'z':
//             newPosition[0] += forward.x * moveSpeed;
//             newPosition[2] += forward.z * moveSpeed;
//             break;
//           case 'x':
//             newPosition[0] -= forward.x * moveSpeed;
//             newPosition[2] -= forward.z * moveSpeed;
//             break;
//           case 'delete':
//           case 'backspace':
//             removeSphere(selectedSphere);
//             return prevSpheres;
//           default:
//             return prevSpheres;
//         }

//         const constrainedPosition = constrainPosition(newPosition);
//         const newSpheres = [...prevSpheres];
//         newSpheres[sphereIndex] = {
//           ...sphere,
//           position: constrainedPosition
//         };
//         return newSpheres;
//       });
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedSphere, setSpheres, camera.quaternion, removeSphere]);

//   return (
//     <>
//       <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

//       {/* Dark ambient lighting */}
//       <ambientLight intensity={0.2} />
//       <pointLight position={[0, 0, 0]} intensity={0.5} />

//       {/* Glass box with edges */}
//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
//         <meshPhysicalMaterial
//           color="#000000"
//           transparent={true}
//           opacity={0.1}
//           roughness={0}
//           metalness={0.5}
//           envMapIntensity={1}
//         />
//       </mesh>

//       {/* Box edges */}
//       <lineSegments>
//         <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
//         <lineBasicMaterial color="#304050" />
//       </lineSegments>

//       {/* Glowing spheres */}
//       {spheres.map((sphere) => (
//         <group key={sphere.id}>
//           {/* Inner sphere - solid */}
//           <mesh
//             position={sphere.position}
//             onClick={(e) => handleClick(e, sphere.id)}
//           >
//             <sphereGeometry args={[0.2, 32, 32]} />
//             <meshBasicMaterial
//               color={selectedSphere === sphere.id ? "#00ff00" : "#00cc00"}
//             />
//           </mesh>
//           {/* Outer sphere - glow effect */}
//           <mesh position={sphere.position}>
//             <sphereGeometry args={[0.3, 32, 32]} />
//             <meshBasicMaterial
//               color="#00ff00"
//               transparent={true}
//               opacity={0.2}
//             />
//           </mesh>
//         </group>
//       ))}
//     </>
//   );
// };

// const ThreeDRenderer = () => {
//   const [spheres, setSpheres] = useState([]);
//   const [selectedSphere, setSelectedSphere] = useState(null);

//   const addSphere = () => {
//     const cubeSize = 10;
//     const halfSize = cubeSize / 2;
//     const newSphere = {
//       id: Date.now(),
//       position: [
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//       ],
//     };
//     setSpheres([...spheres, newSphere]);
//   };

//   const removeSphere = (id) => {
//     setSpheres(prevSpheres => prevSpheres.filter(sphere => sphere.id !== id));
//     setSelectedSphere(null);
//   };

//   return (
//     <div className="bg-black h-full rounded-lg p-4">
//       <h2 className="text-lg font-semibold mb-4 text-green-500">3D Audio Visualizer</h2>

//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={addSphere}
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           Add Sphere
//         </button>
//         <button
//           onClick={() => selectedSphere !== null && removeSphere(selectedSphere)}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={selectedSphere === null}
//         >
//           Remove Selected
//         </button>
//       </div>

//       <div className="border-2 border-gray-800 h-[500px] rounded-lg bg-black">
//         <Canvas camera={{ position: [15, 15, 15], fov: 60 }}>
//           <color attach="background" args={["#000000"]} />
//           <Scene
//             spheres={spheres}
//             setSpheres={setSpheres}
//             selectedSphere={selectedSphere}
//             setSelectedSphere={setSelectedSphere}
//             removeSphere={removeSphere}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default ThreeDRenderer;

// import React, { useEffect } from 'react';
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { useState } from "react";
// import * as THREE from "three";

// // Scene component remains the same as before
// const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere }) => {
//   // ... Previous Scene code remains the same ...
//   const { camera } = useThree();
//   const cubeSize = 10;

//   const constrainPosition = (position) => {
//     const halfSize = cubeSize / 2 - 0.3;
//     return [
//       Math.max(-halfSize, Math.min(halfSize, position[0])),
//       Math.max(-halfSize, Math.min(halfSize, position[1])),
//       Math.max(-halfSize, Math.min(halfSize, position[2]))
//     ];
//   };

//   const handleClick = (e, id) => {
//     e.stopPropagation();
//     setSelectedSphere(id === selectedSphere ? null : id);
//   };

//   useEffect(() => {
//     const moveSpeed = 0.2;

//     const handleKeyDown = (e) => {
//       if (selectedSphere === null) return;

//       setSpheres(prevSpheres => {
//         const sphereIndex = prevSpheres.findIndex(s => s.id === selectedSphere);
//         if (sphereIndex === -1) return prevSpheres;

//         const sphere = prevSpheres[sphereIndex];
//         let newPosition = [...sphere.position];

//         const forward = new THREE.Vector3(0, 0, -1);
//         const right = new THREE.Vector3(1, 0, 0);
//         forward.applyQuaternion(camera.quaternion);
//         right.applyQuaternion(camera.quaternion);
        
//         forward.y = 0;
//         right.y = 0;
//         forward.normalize();
//         right.normalize();

//         switch (e.key.toLowerCase()) {
//           case 'w':
//           case 'arrowup':
//             newPosition[1] += moveSpeed;
//             break;
//           case 's':
//           case 'arrowdown':
//             newPosition[1] -= moveSpeed;
//             break;
//           case 'a':
//           case 'arrowleft':
//             newPosition[0] -= right.x * moveSpeed;
//             newPosition[2] -= right.z * moveSpeed;
//             break;
//           case 'd':
//           case 'arrowright':
//             newPosition[0] += right.x * moveSpeed;
//             newPosition[2] += right.z * moveSpeed;
//             break;
//           case 'z':
//             newPosition[0] += forward.x * moveSpeed;
//             newPosition[2] += forward.z * moveSpeed;
//             break;
//           case 'x':
//             newPosition[0] -= forward.x * moveSpeed;
//             newPosition[2] -= forward.z * moveSpeed;
//             break;
//           case 'delete':
//           case 'backspace':
//             removeSphere(selectedSphere);
//             return prevSpheres;
//           default:
//             return prevSpheres;
//         }

//         const constrainedPosition = constrainPosition(newPosition);
//         const newSpheres = [...prevSpheres];
//         newSpheres[sphereIndex] = {
//           ...sphere,
//           position: constrainedPosition
//         };
//         return newSpheres;
//       });
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedSphere, setSpheres, camera.quaternion, removeSphere]);

//   return (
//     <>
//       <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

//       <ambientLight intensity={0.2} />
//       <pointLight position={[0, 0, 0]} intensity={0.5} />

//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
//         <meshPhysicalMaterial
//           color="#000000"
//           transparent={true}
//           opacity={0.1}
//           roughness={0}
//           metalness={0.5}
//           envMapIntensity={1}
//         />
//       </mesh>

//       <lineSegments>
//         <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
//         <lineBasicMaterial color="#304050" />
//       </lineSegments>

//       {spheres.map((sphere) => (
//         <group key={sphere.id}>
//           <mesh
//             position={sphere.position}
//             onClick={(e) => handleClick(e, sphere.id)}
//           >
//             <sphereGeometry args={[0.2, 32, 32]} />
//             <meshBasicMaterial
//               color={selectedSphere === sphere.id ? "#00ff00" : "#00cc00"}
//             />
//           </mesh>
//           <mesh position={sphere.position}>
//             <sphereGeometry args={[0.3, 32, 32]} />
//             <meshBasicMaterial
//               color="#00ff00"
//               transparent={true}
//               opacity={0.2}
//             />
//           </mesh>
//         </group>
//       ))}
//     </>
//   );
// };

// const ThreeDRenderer = () => {
//   const [spheres, setSpheres] = useState([]);
//   const [selectedSphere, setSelectedSphere] = useState(null);
//   const [isRendering, setIsRendering] = useState(false);

//   const addSphere = () => {
//     const cubeSize = 10;
//     const halfSize = cubeSize / 2;
//     const newSphere = {
//       id: Date.now(),
//       position: [
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//         Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
//       ],
//     };
//     setSpheres([...spheres, newSphere]);
//   };

//   const removeSphere = (id) => {
//     setSpheres(prevSpheres => prevSpheres.filter(sphere => sphere.id !== id));
//     setSelectedSphere(null);
//   };

//   const handleRender = () => {
//     setIsRendering(!isRendering);
//     if (!isRendering) {
//       // Reset and generate new spheres when starting to render
//       setSpheres([]);
//       for (let i = 0; i < 10; i++) {
//         addSphere();
//       }
//     }
//   };

//   return (
//     <div className="bg-gray-900 h-full rounded-lg p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-white">3D Audio Visualizer</h2>
//         <button 
//           onClick={handleRender}
//           className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
//             isRendering 
//               ? "bg-red-600 hover:bg-red-700" 
//               : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {isRendering ? "Stop Rendering" : "Start Rendering"}
//         </button>
//       </div>

//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={addSphere}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           disabled={!isRendering}
//         >
//           Add Sphere
//         </button>
//         <button
//           onClick={() => selectedSphere !== null && removeSphere(selectedSphere)}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={selectedSphere === null || !isRendering}
//         >
//           Remove Selected
//         </button>
//       </div>

//       <div className="border-2 border-gray-900 h-[500px] rounded-lg bg-black">
//         <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
//           <color attach="background" args={["#000000"]} />
//           <Scene
//             spheres={spheres}
//             setSpheres={setSpheres}
//             selectedSphere={selectedSphere}
//             setSelectedSphere={setSelectedSphere}
//             removeSphere={removeSphere}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default ThreeDRenderer;

import React, { useEffect } from 'react';
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";

const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere, isRendering }) => {
  const { camera } = useThree();
  const cubeSize = 10;

  const constrainPosition = (position) => {
    const halfSize = cubeSize / 2 - 0.3;
    return [
      Math.max(-halfSize, Math.min(halfSize, position[0])),
      Math.max(-halfSize, Math.min(halfSize, position[1])),
      Math.max(-halfSize, Math.min(halfSize, position[2]))
    ];
  };

  const handleClick = (e, id) => {
    if (!isRendering) return;
    e.stopPropagation();
    setSelectedSphere(id === selectedSphere ? null : id);
  };

  useEffect(() => {
    const moveSpeed = 0.2;

    const handleKeyDown = (e) => {
      if (selectedSphere === null || !isRendering) return;

      setSpheres(prevSpheres => {
        const sphereIndex = prevSpheres.findIndex(s => s.id === selectedSphere);
        if (sphereIndex === -1) return prevSpheres;

        const sphere = prevSpheres[sphereIndex];
        let newPosition = [...sphere.position];

        const forward = new THREE.Vector3(0, 0, -1);
        const right = new THREE.Vector3(1, 0, 0);
        forward.applyQuaternion(camera.quaternion);
        right.applyQuaternion(camera.quaternion);
        
        forward.y = 0;
        right.y = 0;
        forward.normalize();
        right.normalize();

        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            newPosition[1] += moveSpeed;
            break;
          case 's':
          case 'arrowdown':
            newPosition[1] -= moveSpeed;
            break;
          case 'a':
          case 'arrowleft':
            newPosition[0] -= right.x * moveSpeed;
            newPosition[2] -= right.z * moveSpeed;
            break;
          case 'd':
          case 'arrowright':
            newPosition[0] += right.x * moveSpeed;
            newPosition[2] += right.z * moveSpeed;
            break;
          case 'z':
            newPosition[0] += forward.x * moveSpeed;
            newPosition[2] += forward.z * moveSpeed;
            break;
          case 'x':
            newPosition[0] -= forward.x * moveSpeed;
            newPosition[2] -= forward.z * moveSpeed;
            break;
          case 'delete':
          case 'backspace':
            removeSphere(selectedSphere);
            return prevSpheres;
          default:
            return prevSpheres;
        }

        const constrainedPosition = constrainPosition(newPosition);
        const newSpheres = [...prevSpheres];
        newSpheres[sphereIndex] = {
          ...sphere,
          position: constrainedPosition
        };
        return newSpheres;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSphere, setSpheres, camera.quaternion, removeSphere, isRendering]);

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={0.8} />

      {/* Main cube with gradient material */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.15}
          roughness={0}
          metalness={0.2}
          iridescence={0.3}
          iridescenceIOR={1.5}
          transmission={0.6}
          thickness={0.5}
        />
      </mesh>

      {/* Blue edge lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
        <lineBasicMaterial color="#304050" />
      </lineSegments>

      {spheres.map((sphere) => (
        <group key={sphere.id}>
          <mesh
            position={sphere.position}
            onClick={(e) => handleClick(e, sphere.id)}
          >
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshBasicMaterial
              color={selectedSphere === sphere.id ? "#00ff00" : "#00cc00"}
            />
          </mesh>
          <mesh position={sphere.position}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshBasicMaterial
              color="#00ff00"
              transparent={true}
              opacity={0.2}
            />
          </mesh>
        </group>
      ))}
    </>
  );
};

const ThreeDRenderer = () => {
  const [spheres, setSpheres] = useState([]);
  const [selectedSphere, setSelectedSphere] = useState(null);
  const [isRendering, setIsRendering] = useState(false);

  const addSphere = () => {
    if (!isRendering) return;
    
    const cubeSize = 10;
    const halfSize = cubeSize / 2;
    const newSphere = {
      id: Date.now(),
      position: [
        Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
        Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
        Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
      ],
    };
    setSpheres([...spheres, newSphere]);
  };

  const removeSphere = (id) => {
    setSpheres(prevSpheres => prevSpheres.filter(sphere => sphere.id !== id));
    setSelectedSphere(null);
  };

  const handleRender = () => {
    setIsRendering(!isRendering);
    if (!isRendering) {
      setSpheres([]);
      setSelectedSphere(null);
    }
  };

  return (
    <div className="bg-gray-900 h-full rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">3D Audio Visualizer</h2>
        <button 
          onClick={handleRender}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            isRendering 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isRendering ? "Stop Rendering" : "Start Rendering"}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={addSphere}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isRendering}
        >
          Add Sphere
        </button>
        <button
          onClick={() => selectedSphere !== null && removeSphere(selectedSphere)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedSphere === null || !isRendering}
        >
          Remove Selected
        </button>
      </div>

      <div className="border-2 border-gray-900 h-[500px] rounded-lg bg-black">
        <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
          <color attach="background" args={["#000000"]} />
          <Scene
            spheres={spheres}
            setSpheres={setSpheres}
            selectedSphere={selectedSphere}
            setSelectedSphere={setSelectedSphere}
            removeSphere={removeSphere}
            isRendering={isRendering}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default ThreeDRenderer;