import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Square, Volume2, Upload, Trash2 } from 'lucide-react';

const VideoPlayback = ({ isPlaying, setIsPlaying, setDuration, setCurrentTime, setTimelineData, timelineData, currentTime }) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState(null);
  const [audioElements, setAudioElements] = useState(new Map());


  // Modify the useEffect for audio sync:
  useEffect(() => {
    if (timelineData) {
      const audioClips = timelineData.filter(clip => clip.type === 'audio');
      
      audioClips.forEach(clip => {
        let audio = audioElements.get(clip.id);
        
        // Create new audio element if it doesn't exist
        if (clip.file && !audio) {
          audio = new Audio();
          audio.src = URL.createObjectURL(clip.file);
          setAudioElements(prev => new Map(prev).set(clip.id, audio));
        }

        if (audio) {
          // Update audio position and state
          const clipTime = currentTime - clip.start;
          if (Math.abs(audio.currentTime - clipTime) > 0.1) {
            audio.currentTime = Math.max(0, clipTime);
          }
          audio.volume = volume;

          // Play/pause based on current state and position
          if (isPlaying && currentTime >= clip.start && currentTime <= clip.start + clip.duration) {
            audio.play().catch(err => console.error('Error playing audio:', err));
          } else {
            audio.pause();
          }
        }
      });
      
      // Cleanup unused audio elements
      audioElements.forEach((audio, id) => {
        if (!audioClips.find(clip => clip.id === id)) {
          audio.pause();
          URL.revokeObjectURL(audio.src);
          setAudioElements(prev => {
            const next = new Map(prev);
            next.delete(id);
            return next;
          });
        }
      });
    }
  }, [timelineData, currentTime, isPlaying, volume]);

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      audioElements.forEach((audio) => {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      });
    };
  }, []); 

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError('No file selected');
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    try {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }

      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      setError(null);
      setIsPlaying(false);

      if (videoRef.current) {
        videoRef.current.load();
      }
    } catch (err) {
      setError('Error loading video file');
      console.error('Error creating object URL:', err);
    }
  };

  const handleDeleteVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
      setIsPlaying(false);
      setError(null);
      setDuration(600);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        audioElements.forEach(audio => audio.pause());
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSetCurrentTime = () => {
    setCurrentTime(videoRef.current.currentTime);
  }

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
      handleSetCurrentTime();
    }
  };

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
      handleSetCurrentTime();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      handleSetCurrentTime();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);

      setTimelineData((prevData) =>
      prevData.map((clip) =>
        clip.type === "video" ? { ...clip, duration: videoRef.current.duration} : clip
      )
    );
    }
  };

  return (
    <div className="bg-gray-800 h-full rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Video Preview</h2>
        {videoUrl && (
          <button
            onClick={handleDeleteVideo}
            className="p-2 hover:bg-gray-700 rounded-full text-red-500"
            title="Delete video"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-grow border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
        {!videoUrl ? (
          <div className="flex flex-col items-center gap-4">
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-500" />
              <span className="text-gray-500">Upload Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                onClick={(e) => {
                  e.currentTarget.value = '';
                }}
              />
            </label>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onLoadedMetadata={handleLoadedMetadata}
              onError={(e) => {
                console.error('Video error:', e);
                setError('Error playing video');
              }}
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleSkipBack}
            className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
            disabled={!videoUrl}
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
            disabled={!videoUrl}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <button
            onClick={handleStop}
            className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
            disabled={!videoUrl}
          >
            <Square className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleSkipForward}
            className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50"
            disabled={!videoUrl}
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 px-4">
          <Volume2 className="w-4 h-4 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
            disabled={!videoUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayback;