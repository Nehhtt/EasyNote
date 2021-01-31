/* eslint-disable react/jsx-filename-extension */
import React, { ReactNode, useEffect, useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as Permissions from "expo-permissions";
import { createIconSetFromFontello } from "@expo/vector-icons";

import Slider from "@react-native-community/slider";
import noteViewUtils from "./utils/index";
import styles, { BACKGROUND_COLOR } from "./styles/noteViewStyle";

import fontelloConfig from "../../../fontello/config.json";

const Icon = createIconSetFromFontello(
  fontelloConfig,
  "fontello",
  "fontello.ttf"
);

const { getMMSSFromMillis } = noteViewUtils;
const recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;

const RecordPlayView = (): ReactNode => {
  let isSeeking = false;
  let shouldPlayAtEndOfSeek = false;

  const [
    haveRecordingPermissions,
    setHaveRecordingPermissions,
  ] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [soundPosition, setSoundPosition] = useState<number | null>(null);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number | null>(
    null
  );
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [registeredSound, setRegisteredSound] = useState<Audio.Sound | null>(
    null
  );

  const askForPermissions = async (): Promise<void> => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    setHaveRecordingPermissions(response.status === "granted");
  };

  useEffect((): void => {
    askForPermissions();
  }, []);

  const updateScreenForSoundStatus = (status: AVPlaybackStatus): string => {
    if (status.isLoaded) {
      setSoundDuration(status.durationMillis ?? null);
      setSoundPosition(status.positionMillis);
      setShouldPlay(status.shouldPlay);
      setIsPlaying(status.isPlaying);
      setRate(status.rate);
      setMuted(status.isMuted);
      setVolume(status.volume);
      setIsPlaybackAllowed(true);
    } else {
      setSoundDuration(null);
      setSoundPosition(null);
      setIsPlaybackAllowed(false);
      if (status.error) {
        return "error";
      }
    }
    return "success";
  };

  const stopRecordingAndEnablePlayback = async (): Promise<unknown> => {
    setIsLoading(true);
    if (!recording) {
      return "error: recording does not exist";
    }
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      setIsLoading(false);
      return "error: recording stop ";
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound } = await recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: muted,
        volume,
        rate,
      },
      updateScreenForSoundStatus
    );
    setRegisteredSound(sound);
    setIsLoading(false);
    return "success";
  };

  const updateScreenForRecordingStatus = (
    status: Audio.RecordingStatus
  ): void => {
    if (status.canRecord) {
      setIsRecording(status.isRecording);
      setRecordingDuration(status.durationMillis);
    } else if (status.isDoneRecording) {
      setIsRecording(false);
      setRecordingDuration(status.durationMillis);
      if (!isLoading) {
        stopRecordingAndEnablePlayback();
      }
    }
  };

  const stopPlaybackAndBeginRecording = async (): Promise<void> => {
    setIsLoading(true);
    if (registeredSound !== null) {
      await registeredSound.unloadAsync();
      registeredSound.setOnPlaybackStatusUpdate(null);
      setRegisteredSound(null);
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (recording !== null) {
      recording.setOnRecordingStatusUpdate(null);
      setRecording(null);
    }

    const record = new Audio.Recording();
    await record.prepareToRecordAsync(recordingSettings);
    record.setOnRecordingStatusUpdate(updateScreenForRecordingStatus);

    await record.startAsync();
    setRecording(record);
    setIsLoading(false);
  };

  const onRecordPressed = (): void => {
    if (isRecording) stopRecordingAndEnablePlayback();
    else stopPlaybackAndBeginRecording();
  };

  const onPlayPausePressed = (): void => {
    if (registeredSound != null) {
      if (isPlaying) registeredSound.pauseAsync();
      else registeredSound.playAsync();
    }
  };

  const onStopPressed = (): void => {
    if (registeredSound != null) registeredSound.stopAsync();
  };

  const onMutePressed = (): void => {
    if (registeredSound != null) registeredSound.setIsMutedAsync(!muted);
  };

  const onVolumeSliderValueChange = (value: number): void => {
    if (registeredSound != null) registeredSound.setVolumeAsync(value);
  };

  const onSeekSliderValueChange = (): void => {
    if (registeredSound != null && !isSeeking) {
      isSeeking = true;
      shouldPlayAtEndOfSeek = shouldPlay;
      registeredSound.pauseAsync();
    }
  };

  const onSeekSliderSlidingComplete = async (value: number): Promise<void> => {
    if (registeredSound != null) {
      isSeeking = false;
      const seekPosition = value * (soundDuration || 0);
      if (shouldPlayAtEndOfSeek)
        registeredSound.playFromPositionAsync(seekPosition);
      else registeredSound.setPositionAsync(seekPosition);
    }
  };

  const getSeekSliderPosition = (): number => {
    if (
      registeredSound != null &&
      soundPosition != null &&
      soundDuration != null
    )
      return soundPosition / soundDuration;
    return 0;
  };

  const getPlaybackTimestamp = (): string => {
    if (
      registeredSound != null &&
      soundPosition != null &&
      soundDuration != null
    ) {
      return `${getMMSSFromMillis(soundPosition)} / ${getMMSSFromMillis(
        soundDuration
      )}`;
    }
    return "";
  };

  const displayError = (): ReactNode => {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          You must enable audio recording permissions
        </Text>
      </View>
    );
  };

  if (!haveRecordingPermissions) {
    return displayError();
  }
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.halfScreenContainer,
          { opacity: isLoading ? DISABLED_OPACITY : 1.0 },
        ]}
      >
        <View />
        <View style={styles.recordingContainer}>
          <View />
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            onPress={onRecordPressed}
            disabled={isLoading}
          >
            <Icon
              style={{ backgroundColor: BACKGROUND_COLOR }}
              name="mic"
              size={70}
            />
          </TouchableHighlight>
          <View style={styles.recordingDataContainer}>
            <View />
            <Text style={{ color: LIVE_COLOR }}>
              {isRecording ? "LIVE" : ""}
            </Text>
            <View style={styles.recordingDataRowContainer}>
              <Icon
                style={{
                  opacity: isRecording ? 1.0 : 0.0,
                  backgroundColor: BACKGROUND_COLOR,
                  color: "red",
                }}
                color="red"
                name="record"
                size={30}
              />
              <Text style={{ paddingLeft: 20 }}>
                {`${getMMSSFromMillis(recordingDuration || 0)}`}
              </Text>
            </View>
            <View />
          </View>
          <View />
        </View>
        <View />
      </View>
      <View
        style={[
          styles.halfScreenContainer,
          { opacity: !isPlaybackAllowed || isLoading ? DISABLED_OPACITY : 1.0 },
        ]}
      >
        <View />
        <View style={styles.playbackContainer}>
          <Slider
            style={{ alignSelf: "stretch" }}
            value={getSeekSliderPosition()}
            onValueChange={onSeekSliderValueChange}
            onSlidingComplete={onSeekSliderSlidingComplete}
            disabled={!isPlaybackAllowed || isLoading}
          />
          <Text style={[styles.playbackTimestamp]}>
            {getPlaybackTimestamp()}
          </Text>
        </View>
        <View
          style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}
        >
          <View style={styles.volumeContainer}>
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              onPress={onMutePressed}
              disabled={!isPlaybackAllowed || isLoading}
            >
              <Icon
                style={{ backgroundColor: BACKGROUND_COLOR, paddingLeft: 10 }}
                name={muted ? "volume-off" : "volume-up"}
                size={40}
              />
            </TouchableHighlight>
            <Slider
              style={styles.volumeSlider}
              value={1}
              onValueChange={onVolumeSliderValueChange}
              disabled={!isPlaybackAllowed || isLoading}
            />
          </View>
          <View style={styles.playStopContainer}>
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              onPress={onPlayPausePressed}
              disabled={!isPlaybackAllowed || isLoading}
            >
              <Icon
                style={{ backgroundColor: BACKGROUND_COLOR }}
                name={isPlaying ? "pause" : "play"}
                size={30}
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              onPress={onStopPressed}
              disabled={!isPlaybackAllowed || isLoading}
            >
              <Icon
                style={{ backgroundColor: BACKGROUND_COLOR }}
                name="stop"
                size={30}
              />
            </TouchableHighlight>
          </View>
          <View />
        </View>
        <View />
      </View>
    </View>
  );
};
export default RecordPlayView;
