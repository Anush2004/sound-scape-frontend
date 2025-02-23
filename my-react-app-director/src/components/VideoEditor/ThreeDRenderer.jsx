// import React, { useEffect, useState } from 'react';
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import * as THREE from "three";

// const CommentDialog = ({ isOpen, onClose, comments, onAddComment, onDeleteComment }) => {
//   const [newComment, setNewComment] = useState('');

//   if (!isOpen) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
    
//     onAddComment({
//       id: Date.now(),
//       text: newComment,
//       timestamp: new Date().toLocaleString()
//     });
//     setNewComment('');
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-gray-800 text-white p-6 rounded-lg w-[600px] max-h-[80vh] flex flex-col">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Discussion</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-white text-2xl"
//           >
//             ×
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto my-6 space-y-4 min-h-[300px] max-h-[500px]">
//           {comments.map((comment) => (
//             <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
//               <div className="flex justify-between items-start">
//                 <span className="text-sm text-gray-400">{comment.timestamp}</span>
//                 <button
//                   onClick={() => onDeleteComment(comment.id)}
//                   className="text-red-400 hover:text-red-300"
//                 >
//                   Delete
//                 </button>
//               </div>
//               <p className="mt-2 whitespace-pre-wrap">{comment.text}</p>
//             </div>
//           ))}
//           {comments.length === 0 && (
//             <div className="text-gray-400 text-center pt-4">
//               No comments yet. Start the discussion!
//             </div>
//           )}
//         </div>

//         <form onSubmit={handleSubmit} className="mt-auto">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             className="w-full h-32 p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Add to the discussion..."
//           />
//           <div className="mt-4 flex justify-end">
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Post Comment
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere }) => {
//   // ... (keep existing Scene component code unchanged)
// };

// const ThreeDRenderer = () => {
//   const [spheres, setSpheres] = useState([]);
//   const [selectedSphere, setSelectedSphere] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

//   const removeSphere = (id) => {
//     setSpheres(prevSpheres => prevSpheres.filter(sphere => sphere.id !== id));
//     setSelectedSphere(null);
//   };

//   const handleAddComment = (comment) => {
//     setComments(prevComments => [...prevComments, comment]);
//   };

//   const handleDeleteComment = (commentId) => {
//     setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
//   };

//   return (
//     <div className="bg-gray-900 h-full rounded-lg p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-white">3D Audio Visualizer</h2>
//         <button
//           onClick={() => setIsCommentDialogOpen(true)}
//           className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//         >
//           Open Discussion
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

//       <CommentDialog
//         isOpen={isCommentDialogOpen}
//         onClose={() => setIsCommentDialogOpen(false)}
//         comments={comments}
//         onAddComment={handleAddComment}
//         onDeleteComment={handleDeleteComment}
//       />
//     </div>
//   );
// };

// export default ThreeDRenderer;

import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";

const CommentDialog = ({ isOpen, onClose, comments, onAddComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment({
      id: Date.now(),
      text: newComment,
      timestamp: new Date().toLocaleString()
    });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Discussion</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-6 space-y-4 min-h-[300px] max-h-[500px]">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-400">{comment.timestamp}</span>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{comment.text}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-gray-400 text-center pt-4">
              No comments yet. Start the discussion!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-auto">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full h-32 p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add to the discussion..."
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Scene = ({ spheres, setSpheres, selectedSphere, setSelectedSphere, removeSphere, isRendering, isPlaying, currentTime }) => {
  const { camera } = useThree();
  const cubeSize = 10;
  const animationSpeedRef = useRef(0.05); // Adjust speed as needed
  const lastTimeRef = useRef(currentTime);
  const lastEventTimeRef = useRef(0);
  const eventIntervalRef = useRef(Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

  useFrame((state, delta) => {
    if (!isPlaying) return;

    // Handle random events (add/remove spheres)
    const currentTime = state.clock.getElapsedTime() * 1000;
    if (currentTime - lastEventTimeRef.current > eventIntervalRef.current) {
      lastEventTimeRef.current = currentTime;
      eventIntervalRef.current = Math.random() * 3000 + 2000;

      // 30% chance to add sphere, 20% chance to remove sphere
      const eventRoll = Math.random();
      if (eventRoll < 0.3 && spheres.length < 12) {
        // Add new sphere with natural movement
        const newSphere = {
          id: Math.random(),
          position: [
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 9
          ],
          velocity: [0, 0, 0],
          acceleration: [
            (Math.random() - 0.5) * 0.001,
            (Math.random() - 0.5) * 0.001,
            (Math.random() - 0.5) * 0.001
          ],
          maxSpeed: Math.random() * 0.05 + 0.02
        };
        setSpheres(prev => [...prev, newSphere]);
      } else if (eventRoll < 0.5 && spheres.length > 4) {
        // Remove random sphere (except selected one)
        const removableSpheresIndexes = spheres
          .map((s, i) => s.id !== selectedSphere ? i : -1)
          .filter(i => i !== -1);
        if (removableSpheresIndexes.length > 0) {
          const indexToRemove = removableSpheresIndexes[
            Math.floor(Math.random() * removableSpheresIndexes.length)
          ];
          setSpheres(prev => prev.filter((_, i) => i !== indexToRemove));
        }
      }
    }

    // Update sphere physics
    setSpheres(prevSpheres => {
      return prevSpheres.map(sphere => {
        if (!sphere.velocity) {
          sphere.velocity = [0, 0, 0];
          sphere.acceleration = [
            (Math.random() - 0.5) * 0.0003, // Reduced from 0.001
            (Math.random() - 0.5) * 0.0003,
            (Math.random() - 0.5) * 0.0003
          ];
          sphere.maxSpeed = Math.random() * 0.03 + 0.01; // Reduced max speed range
        }

        // Update velocity with acceleration
        const newVelocity = sphere.velocity.map((v, i) => {
          let newV = v + sphere.acceleration[i];
          // More gentle damping
          newV *= 0.995; // Changed from 0.99
          // Limit speed
          if (Math.abs(newV) > sphere.maxSpeed) {
            newV = sphere.maxSpeed * Math.sign(newV);
          }
          return newV;
        });

        // Calculate new position
        const newPosition = sphere.position.map((p, i) => 
          p + newVelocity[i]
        );

        // Handle collisions
        const constrained = constrainPosition(newPosition);
        const finalVelocity = newVelocity.map((v, i) => {
          if (constrained[i] !== newPosition[i]) {
            // Bounce with random direction change
            return -v * 0.8 + (Math.random() - 0.5) * 0.02;
          }
          return v;
        });

        // Change acceleration occasionally
        if (Math.random() < 0.002) { // Changed from 0.01
          sphere.acceleration = sphere.acceleration.map(() => 
            (Math.random() - 0.5) * 0.0003
          );
        }

        return {
          ...sphere,
          position: constrained,
          velocity: finalVelocity
        };
      });
    });
  });

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

  // Handle keyboard controls
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

  // Animation frame
  useFrame(() => {
    if (!isRendering || !isPlaying) return;

    setSpheres(prevSpheres => {
      return prevSpheres.map(sphere => {
        if (!sphere.velocity) {
          sphere.velocity = [
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05
          ];
        }

        const newPosition = [
          sphere.position[0] + sphere.velocity[0],
          sphere.position[1] + sphere.velocity[1],
          sphere.position[2] + sphere.velocity[2]
        ];

        const constrained = constrainPosition(newPosition);
        const newVelocity = sphere.velocity.map((vel, i) => 
          constrained[i] !== newPosition[i] ? -vel : vel
        );

        return {
          ...sphere,
          position: constrained,
          velocity: newVelocity
        };
      });
    });
  });

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
        </group>
      ))}
    </>
  );
};

const ThreeDRenderer = ({ isPlaying, currentTime }) => {
  const [spheres, setSpheres] = useState([]);
  const [selectedSphere, setSelectedSphere] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [comments, setComments] = useState([]);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  useEffect(() => {
    const checkVideo = () => {
      const videoElement = document.querySelector('video');
      const hasValidVideo = videoElement && videoElement.src && videoElement.src !== '';
      setHasVideo(hasValidVideo);
    };

    // Initial check
    checkVideo();

    // Set up mutation observer to watch for video changes
    const observer = new MutationObserver(checkVideo);
    const config = { attributes: true, childList: true, subtree: true };
    
    observer.observe(document.body, config);

    // Cleanup
    return () => observer.disconnect();
  }, []);

  const handleAddComment = (comment) => {
    setComments(prevComments => [...prevComments, comment]);
  };

  const handleDeleteComment = (commentId) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  };

  const generateRandomSpheres = () => {
    const count = Math.floor(Math.random() * 3) + 6; // 6-8 spheres
    const cubeSize = 10;
    const halfSize = cubeSize / 2;
    
    return Array.from({ length: count }, () => ({
      id: Math.random(),
      position: [
        Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
        Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
        Math.random() * (cubeSize - 0.6) - halfSize + 0.3,
      ]
    }));
  };

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
      setSpheres(generateRandomSpheres());
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
          } ${!hasVideo && 'opacity-50 cursor-not-allowed'}`}
          disabled={!hasVideo}
        >
          {isRendering ? "Stop Rendering" : "Start Rendering"}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsCommentDialogOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Open Discussion
        </button>
        <CommentDialog
          isOpen={isCommentDialogOpen}
          onClose={() => setIsCommentDialogOpen(false)}
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
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
            isPlaying={isPlaying}
            currentTime={currentTime}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default ThreeDRenderer;