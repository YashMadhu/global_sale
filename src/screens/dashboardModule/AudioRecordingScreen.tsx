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
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderComponent from '../../components/HeaderComponent'
import Colors from '../../constants/Colors'
import fonts from '../../assets/fonts'
import { showErrorToast, showSuccessToast } from '../../components/ToastMessage'
import Sound, { RecordBackType, PlayBackType } from 'react-native-nitro-sound'
import LottieView from 'lottie-react-native'

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped' | 'saved'

const AudioRecordingScreen = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [recordTime, setRecordTime] = useState('00:00:00')
  const [savedRecordTime, setSavedRecordTime] = useState('00:00:00')
  const [hasPermission, setHasPermission] = useState(false)
  const [recordedFilePath, setRecordedFilePath] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  const recordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
const recordStartTimeRef = useRef<number>(0)
const recordedDurationRef = useRef<number>(0)   // accumulated time (ms)


const startRecordTimer = () => {
  recordStartTimeRef.current = Date.now()

  recordIntervalRef.current = setInterval(() => {
    const totalElapsed =
      recordedDurationRef.current +
      (Date.now() - recordStartTimeRef.current)

    setRecordTime(formatTime(totalElapsed))
  }, 1000)
}


const stopRecordTimer = () => {
  if (recordIntervalRef.current) {
    clearInterval(recordIntervalRef.current)
    recordIntervalRef.current = null
  }
}

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


  const startRecording = async () => {
    const permission = hasPermission || await requestMicrophonePermission()
    if (!permission) return
  
    try {
      // FULL RESET FOR NEW RECORDING
      stopRecordTimer()
      recordedDurationRef.current = 0
      recordStartTimeRef.current = 0
  
      setRecordTime('00:00:00')
      setSavedRecordTime('00:00:00')
  
      const result = await Sound.startRecorder()
      setRecordedFilePath(result)
      setRecordingState('recording')
  
      // START TIMER
      startRecordTimer()
  
      showSuccessToast('Recording started')
    } catch (error) {
      showErrorToast('Failed to start recording')
    }
  }
  
  

  // Pause recording
  const pauseRecording = async () => {
    try {
      // STORE ELAPSED TIME
      recordedDurationRef.current += Date.now() - recordStartTimeRef.current
  
      stopRecordTimer()
      await Sound.pauseRecorder()
      setRecordingState('paused')
    } catch (error) {
      showErrorToast('Failed to pause recording')
    }
  }
  

  // Resume recording
  const resumeRecording = async () => {
    try {
      await Sound.resumeRecorder()   // resume native recorder FIRST
      startRecordTimer()             // then restart timer
      setRecordingState('recording')
    } catch (error) {
      showErrorToast('Failed to resume recording')
    }
  }
  
  
  

  // Stop recording
  const stopRecording = async () => {
    try {
      // ADD LAST SEGMENT
      recordedDurationRef.current += Date.now() - recordStartTimeRef.current
  
      stopRecordTimer()
  
      const result = await Sound.stopRecorder()
      setRecordedFilePath(result)
      setRecordingState('stopped')
  
      showSuccessToast('Recording stopped')
    } catch (error) {
      showErrorToast('Failed to stop recording')
    }
  }
  
  

  // Save recording
 const saveRecording = async () => {
  try {
    let finalPath = recordedFilePath

    // 🔥 CRITICAL FIX:
    // If recording is still active, STOP it first
    if (recordingState === 'recording' || recordingState === 'paused') {
      stopRecordTimer()

      const result = await Sound.stopRecorder()
      Sound.removeRecordBackListener()

      if (result) {
        finalPath = result
        setRecordedFilePath(result)
      }
    }

    setSavedRecordTime(recordTime)
    setRecordingState('saved')
    showSuccessToast('Recording saved')
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
    // setRecordTime('00:00:00')
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
      // 🛑 Stop & clean any previous player instance
      await Sound.stopPlayer()
      Sound.removePlayBackListener()
  
      // ✅ Ensure correct file URI
      const filePath = recordedFilePath.startsWith('file://')
        ? recordedFilePath
        : `file://${recordedFilePath}`
  
      console.log('Playing file:', filePath)
  
      // Attach listener AFTER player is reset
      Sound.addPlayBackListener((e: PlayBackType) => {
        if (e.currentPosition >= e.duration && e.duration > 0) {
          setIsPlaying(false)
          Sound.stopPlayer()
          Sound.removePlayBackListener()
        }
      })
  
      setIsPlaying(true)
  
      // ✅ Start player with valid URI
      await Sound.startPlayer(filePath)
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
    } catch (e) {
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
    <SafeAreaView style={styles.container}>
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
                <LottieView
                  source={require('../../assets/animation/recording.json')}
                  autoPlay={recordingState === 'recording'}
                  loop={recordingState === 'recording'}
                  style={styles.lottieAnimation}
                />
              </View>
            </View>
          </View>

           {/* <LottieView
                  source={require('../../assets/animation/recording.json')}
                  autoPlay={recordingState === 'recording'}
                  loop={recordingState === 'recording'}
                  style={styles.lottieAnimation}
                /> */}
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
    </SafeAreaView>
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
  lottieAnimation: {
    width: 60,
    height: 60,
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
