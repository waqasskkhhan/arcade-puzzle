import { useCallback, useRef } from 'react';

/**
 * Custom hook for Web Audio API sound effects
 * No external audio files needed - generates tones programmatically
 * 
 * CUSTOMIZATION:
 * - Adjust frequencies for different pitch tones
 * - Modify durations for longer/shorter sounds
 * - Change waveform types: 'sine', 'square', 'sawtooth', 'triangle'
 */

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  /**
   * Play a tile move sound - short click tone
   * CUSTOMIZATION: Change frequency (440 = A note) or duration (0.1 seconds)
   */
  const playTileMove = useCallback(() => {
    try {
      const context = getAudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = 440; // A note
      oscillator.type = 'sine'; // Try 'square', 'sawtooth', 'triangle'
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [getAudioContext]);

  /**
   * Play a button click sound - soft tone
   * CUSTOMIZATION: Adjust frequency (523 = C note) or duration
   */
  const playButtonClick = useCallback(() => {
    try {
      const context = getAudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = 523; // C note
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.08);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.08);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [getAudioContext]);

  /**
   * Play a victory sound - celebratory chime sequence
   * CUSTOMIZATION: Add more notes or change melody pattern
   */
  const playWinSound = useCallback(() => {
    try {
      const context = getAudioContext();
      const notes = [523, 659, 784, 1047]; // C, E, G, C (major chord)
      
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        const startTime = context.currentTime + (index * 0.15);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
      });
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [getAudioContext]);

  return {
    playTileMove,
    playButtonClick,
    playWinSound,
  };
};
