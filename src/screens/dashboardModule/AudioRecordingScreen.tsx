import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform, 
  PermissionsAndroid,
  AppState,
  AppStateStatus
} from 'react-native'
import HeaderComponent from '../../components/HeaderComponent'
import Colors from '../../constants/Colors'
import fonts from '../../assets/fonts'
import { showErrorToast, showSuccessToast } from '../../components/ToastMessage'
import Sound, { RecordBackType, PlayBackType } from 'react-native-nitro-sound'

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped' | 'saved'

const AudioRecordingScreen = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [recordTime, setRecordTime] = useState('00:00:00')
  const [savedRecordTime, setSavedRecordTime] = useState('00:00:00')
  const [hasPermission, setHasPermission] = useState(false)
  const [recordedFilePath, setRecordedFilePath] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  // Request microphone permission
  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true)
          return true
        } else {
          showErrorToast('Microphone permission denied')
          return false
        }
      } catch (err) {
        console.warn(err)
        return false
      }
    } else {
      setHasPermission(true)
      return true
    }
  }

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => {
      subscription.remove()
      // Cleanup listeners on unmount
      Sound.removeRecordBackListener()
      Sound.removePlayBackListener()
    }
  }, [recordingState])

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (
      appStateRef.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      if (recordingState === 'recording') {
        pauseRecording()
      }
    }
    appStateRef.current = nextAppState
  }, [recordingState])

  // Format milliseconds to HH:MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Start recording
  const startRecording = async () => {
    const permission = hasPermission || await requestMicrophonePermission()
    if (!permission) return

    try {
      // Set subscription duration for recording progress updates (in seconds)
      await Sound.setSubscriptionDuration(0.1) // Update every 100ms
      
      // Set up recording progress listener
      Sound.addRecordBackListener((e: RecordBackType) => {
        console.log('Recording progress:', e.currentPosition)
        setRecordTime(formatTime(e.currentPosition))
      })

      const result = await Sound.startRecorder()
      console.log('Recording started:', result)
      setRecordedFilePath(result)
      setRecordingState('recording')
      showSuccessToast('Recording started')
    } catch (error) {
      console.error('Failed to start recording:', error)
      showErrorToast('Failed to start recording')
    }
  }

  // Pause recording
  const pauseRecording = async () => {
    try {
      await Sound.pauseRecorder()
      setRecordingState('paused')
      console.log('Recording paused')
    } catch (error) {
      console.error('Failed to pause recording:', error)
      showErrorToast('Failed to pause recording')
    }
  }

  // Resume recording
  const resumeRecording = async () => {
    try {
      await Sound.resumeRecorder()
      setRecordingState('recording')
      console.log('Recording resumed')
    } catch (error) {
      console.error('Failed to resume recording:', error)
      showErrorToast('Failed to resume recording')
    }
  }

  // Stop recording
  const stopRecording = async () => {
    try {
      const result = await Sound.stopRecorder()
      Sound.removeRecordBackListener()
      console.log('Recording stopped:', result)
      if (result) {
        setRecordedFilePath(result)
      }
      setRecordingState('stopped')
      showSuccessToast('Recording stopped')
    } catch (error) {
      console.error('Failed to stop recording:', error)
      showErrorToast('Failed to stop recording')
      setRecordingState('stopped')
    }
  }

  // Save recording
  const saveRecording = () => {
    try {
      showSuccessToast('Recording saved')
      setSavedRecordTime(recordTime)
      setRecordingState('saved')
    } catch (error) {
      console.error('Failed to save recording:', error)
      showErrorToast('Failed to save recording')
    }
  }

  // Start new recording
  const startNewRecording = async () => {
    // Stop any playing audio first
    try {
      await Sound.stopPlayer()
      Sound.removePlayBackListener()
    } catch (e) {
      // Ignore
    }
    setRecordingState('idle')
    setRecordTime('00:00:00')
    setSavedRecordTime('00:00:00')
    setRecordedFilePath(null)
    setIsPlaying(false)
  }

  // Start playback
  const startPlayback = async () => {
    if (!recordedFilePath) {
      showErrorToast('No recording available')
      return
    }

    try {
      console.log('Playing file:', recordedFilePath)
      
      // Set up playback progress listener
      Sound.addPlayBackListener((e: PlayBackType) => {
        console.log('Playback progress:', e.currentPosition, e.duration)
        if (e.currentPosition >= e.duration) {
          // Playback finished
          console.log('Playback completed')
          setIsPlaying(false)
          Sound.stopPlayer()
          Sound.removePlayBackListener()
        }
      })

      setIsPlaying(true)
      const result = await Sound.startPlayer(recordedFilePath)
      console.log('Playback started:', result)
    } catch (error) {
      console.error('Failed to start playback:', error)
      showErrorToast('Failed to play recording')
      setIsPlaying(false)
    }
  }

  // Stop playback
  const stopPlayback = async () => {
    try {
      await Sound.stopPlayer()
      Sound.removePlayBackListener()
      setIsPlaying(false)
      console.log('Playback stopped')
    } catch (error) {
      console.error('Failed to stop playback:', error)
      setIsPlaying(false)
    }
  }

  // Render bottom controls based on state
  const renderBottomControls = () => {
    // State 1: Idle - Show "New Recording" button
    if (recordingState === 'idle') {
      return (
        <View style={styles.newRecordingContainer}>
          <Text style={styles.newRecordingText}>New{'\n'}Recording:</Text>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={startRecording}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icons/ic_microphone.png')}
              style={styles.controlIcon}
            />
          </TouchableOpacity>
        </View>
      )
    }

    // State 2: Recording/Paused - Show Pause, Stop, Save buttons
    if (recordingState === 'recording' || recordingState === 'paused') {
      return (
        <View style={styles.controlsContainer}>
          <View style={styles.controlItem}>
            <Text style={styles.controlLabel}>{recordingState === 'recording' ? 'Pause' : 'Resume'}</Text>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={recordingState === 'recording' ? pauseRecording : resumeRecording}
              activeOpacity={0.7}
            >
              <Image
                source={recordingState === 'recording' 
                  ? require('../../assets/icons/ic_pause.png') 
                  : require('../../assets/icons/ic_play.png')}
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.controlItem}>
            <Text style={styles.controlLabel}>Stop</Text>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={stopRecording}
              activeOpacity={0.7}
            >
              <View style={styles.stopIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.controlItem}>
            <Text style={styles.controlLabel}>Save</Text>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={saveRecording}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/icons/save.png')}
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    // State 3: Stopped - Show Play, Save buttons
    if (recordingState === 'stopped') {
      return (
        <View style={styles.controlsContainer}>
          <View style={styles.controlItem}>
            <Text style={styles.controlLabel}>{isPlaying ? 'Stop' : 'Play'}</Text>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={isPlaying ? stopPlayback : startPlayback}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/icons/ic_play.png')}
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.controlItem}>
            <Text style={styles.controlLabel}>Save</Text>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={saveRecording}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/icons/save.png')}
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    // State 4: Saved - Show Play and New Recording buttons
    if (recordingState === 'saved') {
      return (
        <View style={styles.savedContainer}>
          <View style={styles.controlsContainer}>
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>{isPlaying ? 'Stop' : 'Play'}</Text>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={isPlaying ? stopPlayback : startPlayback}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../assets/icons/ic_play.png')}
                  style={styles.controlIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.newRecordingContainer}>
            <Text style={styles.newRecordingText}>New{'\n'}Recording:</Text>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={startNewRecording}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/icons/ic_microphone.png')}
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    return null
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        showBackButton
        title="Audio Recording" />
      
      <View style={styles.contentContainer}>
        {/* Main Recording Button with Rings */}
        <TouchableOpacity 
          style={styles.recordingButtonContainer}
          onPress={recordingState === 'idle' ? startRecording : undefined}
          activeOpacity={0.8}
          disabled={recordingState !== 'idle'}
        >
          <View style={[styles.outerRing, recordingState === 'recording' && styles.outerRingActive]}>
            <View style={[styles.middleRing, recordingState === 'recording' && styles.middleRingActive]}>
              <View style={styles.mainButton}>
                <Image
                  source={require('../../assets/icons/ic_microphone.png')}
                  style={styles.microphoneIcon}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Timer Display */}
        <Text style={[
          styles.timerText,
          recordingState !== 'idle' && styles.timerTextActive
        ]}>
          {recordingState === 'saved' ? savedRecordTime : recordTime}
        </Text>

        {/* Bottom Controls */}
        {renderBottomControls()}
      </View>
    </View>
  )
}

export default AudioRecordingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'rgba(13, 68, 122, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRingActive: {
    borderColor: 'rgba(13, 68, 122, 0.3)',
  },
  middleRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 15,
    borderColor: 'rgba(13, 68, 122, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRingActive: {
    borderColor: 'rgba(13, 68, 122, 0.2)',
  },
  mainButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microphoneIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.white,
  },
  timerText: {
    fontSize: 48,
    fontFamily: fonts.PlusJakartaSansBold,
    color: Colors.black,
    marginTop: 40,
    letterSpacing: 2,
  },
  timerTextActive: {
    color: Colors.primary,
  },
  savedContainer: {
    alignItems: 'center',
  },
  newRecordingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  newRecordingText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 40,
  },
  controlItem: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
    color: Colors.black,
    marginBottom: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(13, 68, 122, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.primary,
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
})
