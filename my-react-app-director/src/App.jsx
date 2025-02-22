import { useState } from "react";
import VideoEditor from "./components/VideoEditor/VideoEditor";
import "./App.css";
export default function AudioSpatializer() {
  return <VideoEditor />;
}

// import React, { useState } from 'react';
// import { Play, Pause, SkipBack, SkipForward, Square, Volume2 } from 'lucide-react';

// const VideoEditor = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
  
//   // Sample timeline data
//   const timelineData = [
//     { id: 1, start: 0, duration: 100, type: 'video', color: 'bg-blue-500' },
//     { id: 2, start: 50, duration: 150, type: 'audio', color: 'bg-green-500' },
//     { id: 3, start: 200, duration: 100, type: 'video', color: 'bg-blue-500' },
//   ];

//   return (
//     <div className="h-screen bg-gray-900 text-white flex flex-col">
//       {/* Top Section */}
//       <div className="flex flex-1">
//         {/* 3D Renderer */}
//         <div className="w-1/2 p-4 border-r border-gray-700">
//           <div className="bg-gray-800 h-full rounded-lg p-4">
//             <h2 className="text-lg font-semibold mb-4">3D Renderer</h2>
//             <div className="border-2 border-dashed border-gray-600 h-[calc(100%-2rem)] rounded-lg flex items-center justify-center">
//               <div className="text-gray-500">3D Preview Area</div>
//             </div>
//           </div>
//         </div>

//         {/* Video Playback */}
//         <div className="w-1/2 p-4">
//           <div className="bg-gray-800 h-full rounded-lg p-4">
//             <h2 className="text-lg font-semibold mb-4">Video Preview</h2>
//             <div className="border-2 border-dashed border-gray-600 h-[calc(100%-6rem)] rounded-lg flex items-center justify-center">
//               <div className="text-gray-500">Video Preview Area</div>
//             </div>
            
//             {/* Playback Controls */}
//             <div className="mt-4 flex items-center justify-center gap-4">
//               <button className="p-2 hover:bg-gray-700 rounded-full">
//                 <SkipBack size={20} />
//               </button>
//               <button 
//                 className="p-2 hover:bg-gray-700 rounded-full"
//                 onClick={() => setIsPlaying(!isPlaying)}
//               >
//                 {isPlaying ? <Pause size={20} /> : <Play size={20} />}
//               </button>
//               <button className="p-2 hover:bg-gray-700 rounded-full">
//                 <SkipForward size={20} />
//               </button>
//               <button className="p-2 hover:bg-gray-700 rounded-full">
//                 <Square size={20} />
//               </button>
//               <div className="flex items-center gap-2">
//                 <Volume2 size={20} />
//                 <input type="range" className="w-24" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Timeline Section */}
//       <div className="h-1/3 bg-gray-800 p-4 border-t border-gray-700">
//         <div className="flex flex-col h-full">
//           {/* Timeline Header */}
//           <div className="flex justify-between mb-2">
//             <h2 className="text-lg font-semibold">Timeline</h2>
//             <div className="text-sm text-gray-400">00:00:00:00</div>
//           </div>

//           {/* Timeline Tracks */}
//           <div className="flex-1 overflow-y-auto">
//             {/* Time Markers */}
//             <div className="h-6 border-b border-gray-700 flex">
//               {[...Array(10)].map((_, i) => (
//                 <div key={i} className="flex-1 border-r border-gray-700 text-xs text-gray-500 pl-1">
//                   {i}:00
//                 </div>
//               ))}
//             </div>

//             {/* Video Track */}
//             <div className="h-12 border-b border-gray-700 relative">
//               {timelineData.map(clip => (
//                 clip.type === 'video' && (
//                   <div
//                     key={clip.id}
//                     className={`absolute h-8 mt-2 ${clip.color} rounded opacity-80`}
//                     style={{
//                       left: `${clip.start}px`,
//                       width: `${clip.duration}px`
//                     }}
//                   />
//                 )
//               ))}
//             </div>

//             {/* Audio Track */}
//             <div className="h-12 border-b border-gray-700 relative">
//               {timelineData.map(clip => (
//                 clip.type === 'audio' && (
//                   <div
//                     key={clip.id}
//                     className={`absolute h-8 mt-2 ${clip.color} rounded opacity-80`}
//                     style={{
//                       left: `${clip.start}px`,
//                       width: `${clip.duration}px`
//                     }}
//                   />
//                 )
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoEditor;
