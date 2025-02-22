// import React from 'react';

// const TimelineTrack = ({ clips, type }) => {
//   return (
//     <div className="h-12 border-b border-gray-700 relative">
//       {clips.map(clip => (
//         <div
//           key={clip.id}
//           className={`absolute h-8 mt-2 ${clip.color} rounded opacity-80`}
//           style={{
//             left: `${clip.start}px`,
//             width: `${clip.duration}px`
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default TimelineTrack;


// import React from 'react';

// const TimelineTrack = ({ clips, type, timelineWidth, duration }) => {
//   return (
//     <div className="h-12 border-b border-gray-700 relative">
//       {clips.map(clip => (
//         <div
//           key={clip.id}
//           className={`absolute h-8 mt-2 ${clip.color} rounded opacity-80`}
//           style={{
//             left: `${(clip.start / duration) * timelineWidth}px`,
//             width: `${(clip.duration / duration) * timelineWidth}px`
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default TimelineTrack;


// import React from 'react';

// const TimelineTrack = ({ 
//   clips, 
//   type, 
//   timelineWidth, 
//   duration,
//   onClipUpdate,
//   setDraggingClip,
//   setDragOffset,
//   draggingClip,
//   dragOffset
// }) => {
//   const handleClipMouseDown = (e, clip) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     const offsetX = e.clientX - rect.left;
//     setDraggingClip(clip);
//     setDragOffset(offsetX);
//   };

//   const handleClipMouseMove = (e) => {
//     if (draggingClip) {
//       const rect = e.currentTarget.parentElement.getBoundingClientRect();
//       const x = e.clientX - rect.left - dragOffset;
//       const newStart = Math.max(0, (x / timelineWidth) * duration);
      
//       // Ensure clip doesn't go beyond timeline
//       const maxStart = duration - draggingClip.duration;
//       const clampedStart = Math.min(newStart, maxStart);
      
//       onClipUpdate({
//         ...draggingClip,
//         start: clampedStart
//       });
//     }
//   };

//   return (
//     <div 
//       className="h-12 border-b border-gray-700 relative"
//       onMouseMove={handleClipMouseMove}
//     >
//       {clips.map(clip => {
//         const isDragging = draggingClip?.id === clip.id;
//         return (
//           <div
//             key={clip.id}
//             className={`absolute h-8 mt-2 ${clip.color} rounded opacity-80 cursor-move
//               ${isDragging ? 'z-10 shadow-lg' : ''}`}
//             style={{
//               left: `${(clip.start / duration) * timelineWidth}px`,
//               width: `${(clip.duration / duration) * timelineWidth}px`
//             }}
//             onMouseDown={(e) => handleClipMouseDown(e, clip)}
//           >
//             <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
//               {type}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default TimelineTrack;


import React from 'react';

const TimelineTrack = ({ 
  clips, 
  type, 
  timelineWidth, 
  duration,
  onClipUpdate,
  setDraggingClip,
  setDragOffset,
  draggingClip,
  dragOffset,
  allClips // Add this to check for collisions
}) => {
  const handleClipMouseDown = (e, clip) => {
    e.stopPropagation();
    // Only allow dragging of audio clips
    if (type !== 'audio') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    setDraggingClip(clip);
    setDragOffset(offsetX);
  };

  const checkForCollisions = (newStart, draggedClip) => {
    const draggedEnd = newStart + draggedClip.duration;
    
    // Get all audio clips except the one being dragged
    const otherAudioClips = allClips.filter(
      clip => clip.type === 'audio' && clip.id !== draggedClip.id
    );

    // Check for collisions with other audio clips
    return otherAudioClips.some(clip => {
      const clipEnd = clip.start + clip.duration;
      return (
        (newStart >= clip.start && newStart < clipEnd) || // Start collision
        (draggedEnd > clip.start && draggedEnd <= clipEnd) || // End collision
        (newStart <= clip.start && draggedEnd >= clipEnd) // Encompassing collision
      );
    });
  };

  const handleClipMouseMove = (e) => {
    if (draggingClip && type === 'audio') {
      const rect = e.currentTarget.parentElement.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset;
      const newStart = Math.max(0, (x / timelineWidth) * duration);
      
      // Ensure clip doesn't go beyond timeline
      const maxStart = duration - draggingClip.duration;
      const clampedStart = Math.min(newStart, maxStart);
      
      // Only update if there's no collision
      if (!checkForCollisions(clampedStart, draggingClip)) {
        onClipUpdate({
          ...draggingClip,
          start: clampedStart
        });
      }
    }
  };

  const loadAudioDuration = async (clip) => {
    if (clip.file && clip.type === 'audio') {
      const audio = new Audio();
      audio.src = URL.createObjectURL(clip.file);
      
      return new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          const updatedClip = {
            ...clip,
            duration: audio.duration
          };
          onClipUpdate(updatedClip);
          URL.revokeObjectURL(audio.src);
          resolve();
        });
      });
    }
  };

  return (
    <div 
      className="h-12 border-b border-gray-700 relative"
      onMouseMove={handleClipMouseMove}
    >
      {clips.map(clip => {
        const isDragging = draggingClip?.id === clip.id;
        const isAudio = type === 'audio';
        
        return (
          <div
            key={clip.id}
            className={`absolute h-8 mt-2 ${clip.color} rounded opacity-80
              ${isAudio ? 'cursor-move' : 'cursor-default'}
              ${isDragging ? 'z-10 shadow-lg' : ''}`}
            style={{
              left: `${(clip.start / duration) * timelineWidth}px`,
              width: `${(clip.duration / duration) * timelineWidth}px`
            }}
            onMouseDown={(e) => handleClipMouseDown(e, clip)}
          >
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
              {clip.file ? clip.file.name : type}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineTrack;
