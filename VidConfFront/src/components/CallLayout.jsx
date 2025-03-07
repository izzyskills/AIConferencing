import { createMicrophone } from "@/helpers/createMicrophone";
import { CallingState } from "@stream-io/video-client";
import {
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useCallback, useState, useEffect } from "react";
import robotImage from "../assets/robot.png";
import llamaImage from "../assets/llama.png";
import { useAssemblyToken, useLemur } from "@/adapters/Requests";
import { useNavigate } from "react-router-dom";
import { useTranscriber } from "@/hooks/useTranscriber";

export default function CallLayout() {
  // Text to display what is transcribed from AssemblyAI
  const [transcribedText, setTranscribedText] = useState("");
  const assemblyToken = useAssemblyToken();
  const [llmActive, setLlmActive] = useState(false);
  const [llmResponse, setLlmResponse] = useState("");
  const [robotActive, setRobotActive] = useState(false);
  const [mic, setMic] = useState(undefined); // Collecting data from the Stream SDK using hooks
  const lemur = useLemur();
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount, useMicrophoneState } =
    useCallStateHooks();
  const participantCount = useParticipantCount();
  const callingState = useCallCallingState();
  const { mediaStream } = useMicrophoneState();

  const processPrompt = useCallback(
    async (prompt) => {
      const response = await lemur.mutateAsync(prompt);
      const lemurResponse = response.response;
      console.log(lemurResponse);
      setLlmResponse(lemurResponse);

      setTimeout(() => {
        setLlmResponse("");
        setLlmActive(false);
        setTranscribedText("");
      }, 7000);
    },
    [lemur],
  );
  const transcriber = useTranscriber(
    setTranscribedText,
    setLlmActive,
    processPrompt,
  );

  const handleLeave = async () => {
    if (mic) {
      mic.stopRecording();
      setMic(null);
    }
    if (transcriber) {
      try {
        await transcriber.close(false);
      } catch (error) {
        console.error("Error closing transcriber:", error);
      }
    }
    navigate("/dashboard");
  };

  useEffect(() => {
    if (!robotActive || !transcriber || !mediaStream) return;

    let currentMic = null;

    const setup = async () => {
      try {
        try {
          await transcriber.connect();
        } catch (error) {
          if (error.message.includes("Already connected")) {
            console.log("Transcriber already connected, skipping connect()");
          } else {
            throw error;
          }
        }

        const newMic = createMicrophone(mediaStream);
        currentMic = newMic;

        console.log("Mic: ", newMic, ", starting recording");
        newMic.startRecording((audioData) => {
          transcriber.sendAudio(audioData);
        });

        setMic(newMic);
      } catch (error) {
        console.error("Error setting up transcription:", error);
        setRobotActive(false);
      }
    };

    setup();

    // Cleanup when effect dependencies change
    return () => {
      if (currentMic) {
        currentMic.stopRecording();
        setMic(null);
      }
    };
  }, [robotActive, transcriber, mediaStream]);

  useEffect(() => {
    return () => {
      if (mic) {
        mic.stopRecording();
      }

      if (transcriber) {
        transcriber.close(false).catch(console.error);
      }
    };
  }, []);

  const switchRobot = async (isActive) => {
    if (isActive) {
      console.log("Robot is active");
      if (mic) {
        mic.stopRecording();
        setMic(null);
      }
      if (transcriber) {
        try {
          await transcriber.close(false);
        } catch (error) {
          console.error("Error closing transcriber:", error);
        }
      }
      setRobotActive(false);
    } else {
      console.log("Robot is inactive");
      setRobotActive(true);
    }
  };
  if (callingState !== CallingState.JOINED) {
    return (
      <section className="h-screen w-screen flex items-center justify-center animate-pulse font-bold">
        Loading...
      </section>
    );
  }

  return (
    <StreamTheme>
      <h2>Participants: {participantCount}</h2>
      <div className="relative overflow-hidden rounded-xl">
        <SpeakerLayout participantsBarPosition="bottom" />
        {llmResponse && (
          <div className="absolute mx-8 top-8 right-8 bg-white text-black p-4 rounded-lg shadow-md">
            {llmResponse}
          </div>
        )}
        <div className="flex items-center justify-center w-full absolute bottom-2">
          <h3 className="text-white text-center bg-black rounded-xl px-6 py-1">
            {transcribedText}
          </h3>
        </div>
        <div
          className={`absolute transition ease-in-out duration-300 bottom-1 right-4 ${
            llmActive
              ? "translate-x-0 translate-y-0 opacity-100"
              : "translate-x-60 translate-y-60 opacity-0"
          }`}
        >
          <img
            src={llamaImage}
            width={200}
            height={200}
            alt="llama"
            className="relative"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mx-4">
        <CallControls onLeave={handleLeave} />
        <button className="ml-8" onClick={() => switchRobot(robotActive)}>
          <img
            src={robotImage}
            width={50}
            height={50}
            alt="robot"
            className={`border-2 border-black dark:bg-white rounded-full transition-colors ease-in-out duration-200 ${
              robotActive ? "bg-black animate-pulse" : ""
            }`}
          />
        </button>
      </div>
    </StreamTheme>
  );
}
