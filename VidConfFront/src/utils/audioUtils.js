export const startAudioRecording = (stream, onDataAvailable) => {
  if (!stream || !stream.getAudioTracks().length) {
    console.error("No audio tracks found in the stream");
    return null;
  }

  try {
    // Create a media recorder instance with just the audio tracks
    const audioStream = new MediaStream(stream.getAudioTracks());
    const mediaRecorder = new MediaRecorder(audioStream, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 128000, // 128 kbps for good audio quality
    });

    // Set up data available handler
    mediaRecorder.ondataavailable = onDataAvailable;

    // Start recording in chunks (30 seconds each)
    mediaRecorder.start(30000);

    return mediaRecorder;
  } catch (error) {
    console.error("Error starting audio recording:", error);
    return null;
  }
};
