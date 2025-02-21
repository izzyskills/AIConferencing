import { ref, onUnmounted } from "vue";
import { usePostAudioRecording } from "@/adapters/requests";

export default function useAudioRecorder(localStream, isHost, rid) {
  const mediaRecorder = ref(null);
  const recordedChunks = ref([]);
  const recordingBlob = ref(null);
  const { postAudioRecording } = usePostAudioRecording();

  function startRecording() {
    // Only record if this client is the host and a local stream exists.
    if (!isHost.value || !localStream.value) return;

    // Create a new MediaStream containing only the audio tracks from the local stream.
    const audioStreamToRecord = new MediaStream();
    localStream.value.getAudioTracks().forEach((track) => {
      audioStreamToRecord.addTrack(track);
    });

    const options = { mimeType: "audio/webm;codecs=opus" };
    try {
      mediaRecorder.value = new MediaRecorder(audioStreamToRecord, options);
    } catch (err) {
      console.error("Failed to initialize MediaRecorder:", err);
      return;
    }

    // When data is available, collect it.
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.value.push(event.data);
      }
    };

    // When recording stops, combine the chunks into a Blob.
    mediaRecorder.value.onstop = () => {
      recordingBlob.value = new Blob(recordedChunks.value, {
        type: options.mimeType,
      });
      // Clear the recorded chunks (optional, if you plan on reusing the recorder).
      recordedChunks.value = [];
      // Optionally, automatically upload the blob for transcription.
      uploadRecording(recordingBlob.value);
    };

    mediaRecorder.value.start();
    console.log("Recording started.");
  }

  function stopRecording() {
    if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
      mediaRecorder.value.stop();
      console.log("Recording stopped.");
    }
  }

  async function uploadRecording(blob) {
    // Replace this with your API call to send 'blob' to your transcription service.
    console.log("Recording ready for transcription:", blob);
    await postAudioRecording.mutateAsync({ rid: rid, blob: blob });
    // For example:
    // axios.post('/api/upload-audio', formData);
  }

  // Automatically stop recording if the component is unmounted.
  onUnmounted(() => {
    stopRecording();
  });

  return { startRecording, stopRecording, recordingBlob, recordedChunks };
}
