import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Square, Volume2 } from 'lucide-react';

const PlaybackControls = ({ isPlaying, setIsPlaying }) => {
  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      <button className="p-2 hover:bg-gray-700 rounded-full">
        <SkipBack size={20} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded-full"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button className="p-2 hover:bg-gray-700 rounded-full">
        <SkipForward size={20} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded-full">
        <Square size={20} />
      </button>
      <div className="flex items-center gap-2">
        <Volume2 size={20} />
        <input type="range" className="w-24" />
      </div>
    </div>
  );
};

export default PlaybackControls;