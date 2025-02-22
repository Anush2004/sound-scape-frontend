// import React from 'react';
// import TimelineTrack from './TimelineTrack';
// import TimeMarkers from './TimeMarkers';

// const Timeline = ({ timelineData }) => {
//   return (
//     <div className="h-1/3 bg-gray-800 p-4 border-t border-gray-700">
//       <div className="flex flex-col h-full">
//         <div className="flex justify-between mb-2">
//           <h2 className="text-lg font-semibold">Timeline</h2>
//           <div className="text-sm text-gray-400">00:00:00:00</div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           <TimeMarkers />
//           <TimelineTrack 
//             clips={timelineData.filter(clip => clip.type === 'video')} 
//             type="video" 
//           />
//           <TimelineTrack 
//             clips={timelineData.filter(clip => clip.type === 'audio')} 
//             type="audio" 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Timeline;

// import React, { useRef, useEffect, useState } from 'react';
// import TimelineTrack from './TimelineTrack';
// import TimeMarkers from './TimeMarkers';

// const Timeline = ({ timelineData, currentTime, duration, onTimeUpdate, isPlaying }) => {
//   const timelineRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [timelineWidth, setTimelineWidth] = useState(0);

//   useEffect(() => {
//     const updateTimelineWidth = () => {
//       if (timelineRef.current) {
//         setTimelineWidth(timelineRef.current.clientWidth);
//       }
//     };

//     updateTimelineWidth();
//     window.addEventListener('resize', updateTimelineWidth);
//     return () => window.removeEventListener('resize', updateTimelineWidth);
//   }, []);

//   useEffect(() => {
//     let animationFrame;
//     if (isPlaying) {
//       const updatePlayback = () => {
//         onTimeUpdate(currentTime + 0.1);
//         animationFrame = requestAnimationFrame(updatePlayback);
//       };
//       animationFrame = requestAnimationFrame(updatePlayback);
//     }
//     return () => cancelAnimationFrame(animationFrame);
//   }, [isPlaying, currentTime, onTimeUpdate]);

//   const handleTimelineClick = (e) => {
//     if (!timelineRef.current) return;
    
//     const rect = timelineRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const percentage = x / rect.width;
//     onTimeUpdate(percentage * duration);
//   };

//   const handleMouseDown = (e) => {
//     setIsDragging(true);
//     handleTimelineClick(e);
//   };

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       handleTimelineClick(e);
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   useEffect(() => {
//     if (isDragging) {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDragging]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="h-1/3 bg-gray-800 p-4 border-t border-gray-700">
//       <div className="flex flex-col h-full">
//         <div className="flex justify-between mb-2">
//           <h2 className="text-lg font-semibold">Timeline</h2>
//           <div className="text-sm text-gray-400">
//             {formatTime(currentTime)} / {formatTime(duration)}
//           </div>
//         </div>
        
//         <div 
//           ref={timelineRef}
//           className="flex-1 overflow-y-auto relative cursor-pointer"
//           onMouseDown={handleMouseDown}
//         >
//           <TimeMarkers duration={duration} />
          
//           {/* Playhead */}
//           <div 
//             className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
//             style={{ 
//               left: `${(currentTime / duration) * 100}%`,
//               transform: 'translateX(-50%)'
//             }}
//           />
          
//           <TimelineTrack 
//             clips={timelineData.filter(clip => clip.type === 'video')} 
//             type="video"
//             timelineWidth={timelineWidth}
//             duration={duration}
//           />
//           <TimelineTrack 
//             clips={timelineData.filter(clip => clip.type === 'audio')} 
//             type="audio"
//             timelineWidth={timelineWidth}
//             duration={duration}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Timeline;




import React, { useRef, useEffect, useState } from 'react';
import TimelineTrack from './TimelineTrack';
import TimeMarkers from './TimeMarkers';

const Timeline = ({ 
  timelineData, 
  currentTime, 
  duration, 
  onTimeUpdate, 
  onClipUpdate,
  isPlaying 
}) => {
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [draggingClip, setDraggingClip] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);


  useEffect(() => {
    const updateTimelineWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.clientWidth);
      }
    };

    updateTimelineWidth();
    window.addEventListener('resize', updateTimelineWidth);
    return () => window.removeEventListener('resize', updateTimelineWidth);
  }, []);

  // Playback animation
  // useEffect(() => {
  //   let animationFrame;
  //   if (isPlaying) {
  //     const updatePlayback = () => {
  //       onTimeUpdate(currentTime + 0.1);
  //       animationFrame = requestAnimationFrame(updatePlayback);
  //     };
  //     animationFrame = requestAnimationFrame(updatePlayback);
  //   }
  //   return () => cancelAnimationFrame(animationFrame);
  // }, [isPlaying, currentTime, onTimeUpdate]);

  useEffect(() => {
    let animationFrame;
    let previousTime = performance.now();
  
    const updatePlayback = (currentFrameTime) => {
      const deltaTime = (currentFrameTime - previousTime) / 1000; // Convert to seconds
      previousTime = currentFrameTime;
  
      const compensationFactor = 2.7;
      const adjustedDeltaTime = deltaTime * compensationFactor;
  
      onTimeUpdate(currentTime + adjustedDeltaTime);
  
      // Request the next frame
      animationFrame = requestAnimationFrame(updatePlayback);
    };
  
    if (isPlaying) {
      previousTime = performance.now(); // Reset previousTime when playback starts
      animationFrame = requestAnimationFrame(updatePlayback);
    }
  
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, currentTime, onTimeUpdate]);

  const handleTimelineClick = (e) => {
    if (!timelineRef.current || draggingClip) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onTimeUpdate(percentage * duration);
  };

  const handleMouseDown = (e) => {
    if (!draggingClip) {
      setIsDragging(true);
      handleTimelineClick(e);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !draggingClip) {
      handleTimelineClick(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (draggingClip) {
      setDraggingClip(null);
    }
  };

  useEffect(() => {
    if (isDragging || draggingClip) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggingClip]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Inside Timeline component, add these handlers before the return statement:
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const audioFiles = Array.from(e.dataTransfer.files);
    // const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length > 0) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const dropTime = (x / timelineWidth) * duration;
      
      audioFiles.forEach(file => {
        // Create new audio clip at drop position
        const newClip = {
          id: Date.now(),
          start: dropTime,
          duration: 100, // Default duration - should be updated when audio loads
          type: 'audio',
          color: 'bg-green-500',
          file: file
        };

        console.log('New audio clip:', newClip);
        onClipUpdate(newClip);
      });
    }
  };

  return (
    <div className="h-1/3 bg-gray-800 p-4 border-t border-gray-700">
      <div className="flex flex-col h-full">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <div className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <div 
          ref={timelineRef}
          className="flex-1 overflow-y-auto relative cursor-pointer"
          onMouseDown={handleMouseDown}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <TimeMarkers duration={duration} />
          
          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ 
              left: `${(currentTime / duration) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          />
          
          <TimelineTrack 
            clips={timelineData.filter(clip => clip.type === 'video')} 
            type="video"
            timelineWidth={timelineWidth}
            duration={duration}
            onClipUpdate={onClipUpdate}
            setDraggingClip={setDraggingClip}
            setDragOffset={setDragOffset}
            draggingClip={draggingClip}
            dragOffset={dragOffset}
            allClips={timelineData}
          />
          <TimelineTrack 
            clips={timelineData.filter(clip => clip.type === 'audio')} 
            type="audio"
            timelineWidth={timelineWidth}
            duration={duration}
            onClipUpdate={onClipUpdate}
            setDraggingClip={setDraggingClip}
            setDragOffset={setDragOffset}
            draggingClip={draggingClip}
            dragOffset={dragOffset}
            allClips={timelineData}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;

