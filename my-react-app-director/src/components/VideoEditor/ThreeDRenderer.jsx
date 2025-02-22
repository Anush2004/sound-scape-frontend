// import React, { useEffect } from 'react';
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { useState } from "react";
// import * as THREE from "three";

// const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere, isRendering }) => {
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
//     if (!isRendering) return;
//     e.stopPropagation();
//     setSelectedSphere(id === selectedSphere ? null : id);
//   };

//   useEffect(() => {
//     const moveSpeed = 0.2;

//     const handleKeyDown = (e) => {
//       if (selectedSphere === null || !isRendering) return;

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
//   }, [selectedSphere, setSpheres, camera.quaternion, removeSphere, isRendering]);

//   return (
//     <>
//       <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

//       <ambientLight intensity={0.5} />
//       <pointLight position={[0, 0, 0]} intensity={0.8} />

//       {/* Main cube with gradient material */}
//       <mesh position={[0, 0, 0]}>
//         <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
//         <meshPhysicalMaterial
//           color="#ffffff"
//           transparent={true}
//           opacity={0.15}
//           roughness={0}
//           metalness={0.2}
//           iridescence={0.3}
//           iridescenceIOR={1.5}
//           transmission={0.6}
//           thickness={0.5}
//         />
//       </mesh>

//       {/* Blue edge lines */}
//       <lineSegments>
//         <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
//         <lineBasicMaterial color="#304050" />
//       </lineSegments>

//       {spheres.map((sphere) => (
//         <group key={sphere.id}>
//           <mesh
//             position={sphere.position}
//             // onClick={(e) => handleClick(e, sphere.id)}
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
//     if (!isRendering) return;
    
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
//       setSpheres([]);
//       setSelectedSphere(null);
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
//           disabled={true}
//         >
//           {isRendering ? "Stop Rendering" : "Start Rendering"}
//         </button>
//       </div>

//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={addSphere}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={true}
//         >
//           Add Sphere
//         </button>
//         <button
//           onClick={() => selectedSphere !== null && removeSphere(selectedSphere)}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={true}
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
//             isRendering={isRendering}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default ThreeDRenderer;

import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const CommentDialog = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Comment</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your comment here..."
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere }) => {
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
    e.stopPropagation();
    setSelectedSphere(id === selectedSphere ? null : id);
  };

  useEffect(() => {
    const moveSpeed = 0.2;

    const handleKeyDown = (e) => {
      if (selectedSphere === null) return;

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
  }, [selectedSphere, setSpheres, camera.quaternion, removeSphere]);

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={0.8} />

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
          {sphere.comment && (
            <mesh position={[sphere.position[0], sphere.position[1] + 0.5, sphere.position[2]]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
};

const ThreeDRenderer = () => {
  const [spheres, setSpheres] = useState([]);
  const [selectedSphere, setSelectedSphere] = useState(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const addSphere = () => {
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

  const handleAddComment = (comment) => {
    if (selectedSphere === null) return;
    
    setSpheres(prevSpheres => prevSpheres.map(sphere => 
      sphere.id === selectedSphere 
        ? { ...sphere, comment } 
        : sphere
    ));
  };

  return (
    <div className="bg-gray-900 h-full rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">3D Audio Visualizer</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={addSphere}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Sphere
        </button>
        <button
          onClick={() => selectedSphere !== null && removeSphere(selectedSphere)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={selectedSphere === null}
        >
          Remove Selected
        </button>
        <button
          onClick={() => setIsCommentDialogOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          disabled={selectedSphere === null}
        >
          Add Comment
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
          />
        </Canvas>
      </div>

      <CommentDialog
        isOpen={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        onSubmit={handleAddComment}
      />
    </div>
  );
};

export default ThreeDRenderer;