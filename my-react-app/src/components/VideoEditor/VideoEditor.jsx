// import React, { useState, useCallback, useEffect } from 'react';
// import ThreeDRenderer from './ThreeDRenderer';
// import VideoPlayback from './VideoPlayback';
// import Timeline from './Timeline';


// const VideoEditor = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(600); // 10 minutes in seconds for example
  
//   // Sample timeline data - could be moved to a separate data file
//   const [timelineData, setTimelineData] = useState([
//     { id: 1, start: 0, duration: 0, type: 'video', color: 'bg-blue-500' },
//     { id: 2, start: 50, duration: 150, type: 'audio', color: 'bg-green-500' },
//     { id: 3, start: 200, duration: 100, type: 'audio', color: 'bg-green-500' },
//   ]);

//   const handleTimeUpdate = useCallback((newTime) => {
//     setCurrentTime(Math.max(0, Math.min(newTime, duration)));
//   }, [duration]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleClipUpdate = (updatedClip) => {
//     setTimelineData(clips => 
//       clips.map(clip => 
//         clip.id === updatedClip.id ? updatedClip : clip
//       )
//     );
//   };

//   // useEffect(() => {
//   //   const handleKeyPress = (e) => {
//   //     if (e.code === 'Space') {
//   //       setIsPlaying(prev => !prev);
//   //     }
//   //   };
    
//   //   window.addEventListener('keydown', handleKeyPress);
//   //   return () => window.removeEventListener('keydown', handleKeyPress);
//   // }, []);


//   return (
//     <div className="h-screen bg-gray-900 text-white flex flex-col">
//       <div className="flex flex-1">
//         <div className="w-1/2 p-4 border-r border-gray-700">
//           <ThreeDRenderer />
//         </div>
//         <div className="w-1/2 p-4">
//           <VideoPlayback 
//             isPlaying={isPlaying} 
//             setIsPlaying={setIsPlaying}
//             currentTime={currentTime}
//             duration={duration}
//             onTimeUpdate={handleTimeUpdate}
//             setDuration={setDuration}
//             setTimelineData={setTimelineData}
//           />
//         </div>
//       </div>
//       <Timeline 
//         timelineData={timelineData}
//         currentTime={currentTime}
//         duration={duration}
//         onTimeUpdate={handleTimeUpdate}
//         onClipUpdate={handleClipUpdate}
//         isPlaying={isPlaying}
//       />
//     </div>
//   );
// };

// export default VideoEditor;

import React, { useState, useCallback, useEffect } from 'react';
import ThreeDRenderer from './ThreeDRenderer';
import VideoPlayback from './VideoPlayback';
import Timeline from './Timeline';
import SidePanel from './SidePanel';

const VideoEditor = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes in seconds for example
  
  // Sample timeline data - could be moved to a separate data file
  const [timelineData, setTimelineData] = useState([
    { id: 1, start: 0, duration: 0, type: 'video', color: 'bg-blue-500' },
    { id: 2, start: 50, duration: 150, type: 'audio', color: 'bg-green-500' },
    { id: 3, start: 200, duration: 100, type: 'audio', color: 'bg-green-500' },
  ]);

  const handleTimeUpdate = useCallback((newTime) => {
    setCurrentTime(Math.max(0, Math.min(newTime, duration)));
  }, [duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClipUpdate = (updatedClip) => {
    setTimelineData(clips => {
      // Check if the clip already exists
      const clipExists = clips.some(clip => clip.id === updatedClip.id);
      
      if (clipExists) {
        // Update existing clip
        return clips.map(clip => 
          clip.id === updatedClip.id ? updatedClip : clip
        );
      } else {
        // Add new clip
        return [...clips, updatedClip];
      }
    });
  };

  const handleFileSelect = (file) => {
    // Handle the selected file here
    // For example, add it to the timeline
    const newClip = {
      id: Date.now(),
      start: currentTime,
      duration: 100, // Default duration
      type: file.type,
      color: file.type === 'video' ? 'bg-blue-500' : 'bg-green-500'
    };
    setTimelineData(prev => [...prev, newClip]);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      <SidePanel onFileSelect={handleFileSelect} />
      <div className="flex-1 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2 p-4 border-r border-gray-700">
            <ThreeDRenderer />
          </div>
          <div className="w-1/2 p-4">
            <VideoPlayback 
              isPlaying={isPlaying} 
              setIsPlaying={setIsPlaying}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              duration={duration}
              onTimeUpdate={handleTimeUpdate}
              setDuration={setDuration}
              setTimelineData={setTimelineData}
              timelineData={timelineData}
            />
          </div>
        </div>
        <Timeline 
          timelineData={timelineData}
          currentTime={currentTime}
          duration={duration}
          onTimeUpdate={handleTimeUpdate}
          onClipUpdate={handleClipUpdate}
          isPlaying={isPlaying}
        />
      </div>
    </div>
  );
};

export default VideoEditor;