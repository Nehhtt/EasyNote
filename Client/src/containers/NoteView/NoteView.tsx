import * as React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform,
} from 'react-native';
import { Audio, Permissions, FileSystem } from 'expo';

const recordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1e88e5',
    paddingVertical: 20,
    width: '90%',
    alignItems: 'center',
    borderRadius: 5,
    padding: 8,
    marginTop: 20,
  },
  text: {
    color: '#fff',
  }
})

const SpeechToTextButton = () => {
  const [recording, setRecording] = React.useState(null);
  const [isFetching, setisFetching] = React.useState(false);
  const [isRecording, setisRecording] = React.useState(false);
  const [transcript, settranscript] = React.useState('');

  const deleteRecordingFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI())
      await FileSystem.deleteAsync(info.uri)
    } catch (error) {
      console.log('There was an error deleting recorded file', error)
    }
  }

  const getTranscription = async () => {
    setisFetching(true)
    try {
      const { uri } = await FileSystem.getInfoAsync(recording.getURI())

      const formData = new FormData()
      formData.append('file', {
        uri,
        type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
        name: Platform.OS === 'ios' ? `${Date.now()}.wav` :`${Date.now()}.m4a`,
      })

      const { data } = await axios.post('http://localhost:3005/speech', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      settranscript(data.transcript)
    } catch (error) {
      console.log('There was an error reading file', error)
      stopRecording()
      resetRecording()
    }
    setisFetching(false)
  }

  const startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (status !== 'granted') return

    setisRecording(true)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    })
    const record = new Audio.Recording()

    try {
      await record.prepareToRecordAsync(recordingOptions)
      await record.startAsync()
    } catch (error) {
      stopRecording()
    }

    setRecording(record)
  }

  const stopRecording = async () => {
    setisRecording(false)
    try {
      await recording.stopAndUnloadAsync()
    } catch (error) {
      // noop
    }
  }

  const resetRecording = () => {
    deleteRecordingFile()
    setRecording(null)
  }

  const handleOnPressOut = () => {
    stopRecording()
    getTranscription()
  }
    return (
        <View style={styles.container}>
        <TouchableOpacity
            style={styles.button}
            onPressIn={startRecording}
            onPressOut={handleOnPressOut}
        >
            {isFetching && <ActivityIndicator color="#ffffff" />}
            {!isFetching && 
            <Text style={styles.text}>
                {isRecording ? 'Recording...' : 'Start recording'}
            </Text>
            }
        </TouchableOpacity>
        <Text>
            {`${transcript}`}
        </Text>
        </View>
    )
}
export default SpeechToTextButton