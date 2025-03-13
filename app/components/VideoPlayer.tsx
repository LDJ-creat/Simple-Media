import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';
import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';

interface VideoPlayerProps {
  uri: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      if (Math.abs(position - duration) < 400) {
        await videoRef.current.setPositionAsync(0);
        setPosition(0);
      }
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlaybackStatusUpdate = async (newStatus: AVPlaybackStatus) => {
    if ('isLoaded' in newStatus && newStatus.isLoaded) {
      if (!isSeeking) {
        setPosition(newStatus.positionMillis);
        setDuration(newStatus.durationMillis || 0);
      }
      if (newStatus.didJustFinish) {
        await videoRef.current?.pauseAsync();
        setIsPlaying(false);
      }
    }
  };

  const onSlidingStart = () => {
    setIsSeeking(true);
  };

  const onSlidingComplete = async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
      setPosition(value);
    }
    setIsSeeking(false);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <View style={styles.controls}>
        
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={handlePlayPause}
          >
            <Icon name={isPlaying ? "pause" : "play"} 
                  size={40} 
                  color="white" 
            />
          </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingStart={onSlidingStart}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="rgba(255,255,255,0.5)"
            thumbTintColor={theme.colors.primary}
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -40 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default VideoPlayer; 


