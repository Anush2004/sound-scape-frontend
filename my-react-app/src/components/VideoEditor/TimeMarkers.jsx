// import React from 'react';

// const TimeMarkers = () => {
//   return (
//     <div className="h-6 border-b border-gray-700 flex">
//       {[...Array(10)].map((_, i) => (
//         <div key={i} className="flex-1 border-r border-gray-700 text-xs text-gray-500 pl-1">
//           {i}:00
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TimeMarkers;


import React from 'react';

const TimeMarkers = ({ duration }) => {
  const markers = 10;
  const interval = duration / markers;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-6 border-b border-gray-700 flex">
      {[...Array(markers)].map((_, i) => (
        <div key={i} className="flex-1 border-r border-gray-700 text-xs text-gray-500 pl-1">
          {formatTime(i * interval)}
        </div>
      ))}
    </div>
  );
};

export default TimeMarkers;
