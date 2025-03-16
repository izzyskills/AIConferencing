import { useAssemblyToken } from "@/adapters/requests";
import { RealtimeTranscriber } from "assemblyai";
import { useEffect, useState } from "react";

export const useTranscriber = (
  setTranscribedText,
  setLlamaActive,
  processPrompt,
) => {
  const [transcriber, setTranscriber] = useState(null);
  const assemblyToken = useAssemblyToken();
  const token = assemblyToken.data?.token;

  useEffect(() => {
    let isMounted = true;

    const createTranscriber = async () => {
      try {
        if (!token || !isMounted) return;

        const newTranscriber = new RealtimeTranscriber({
          sampleRate: 16_000,
          token: token,
          wordBoost: ["Llama"],
          endUtteranceSilenceThreshold: 1000,
        });

        const texts = {};

        newTranscriber.on("open", ({ sessionId }) => {
          console.log(`Transcriber opened with session ID: ${sessionId}`);
        });

        newTranscriber.on("error", (error) => {
          console.error("Transcriber error:", error);
          // Error handled with cleanup in the return function
        });

        newTranscriber.on("close", (code, reason) => {
          console.log(
            `Transcriber closed with code ${code} and reason: ${reason}`,
          );
        });

        newTranscriber.on("transcript", (transcript) => {
          if (!transcript.text) return;

          // Detect if we're asking something for the LLM
          const jarvisRegex = /\bjarvis\b[\s,]*/i;
          setLlamaActive(jarvisRegex.test(transcript.text));

          if (transcript.message_type === "PartialTranscript") {
            let msg = "";
            texts[transcript.audio_start] = transcript.text;
            const keys = Object.keys(texts);

            for (const key of keys) {
              if (texts[key]) {
                msg += ` ${texts[key]}`;
              }
            }

            console.log("[Transcript] Msg: ", msg);
            console.log("[Transcript] Partial:", transcript.text);
            setTranscribedText(transcript.text);
          } else {
            console.log("[Transcript] Final:", transcript.text);
            setTranscribedText(transcript.text);

            if (jarvisRegex.test(transcript.text)) {
              console.log("Setting prompt to: ", transcript.text);
              setTimeout(() => {
                const prompt = transcript.text.replace(jarvisRegex, "").trim();
                processPrompt(prompt);
              }, 1000); // 1 second delay
            }
          }
        });

        if (isMounted) {
          setTranscriber(newTranscriber);
        } else {
          // Clean up if component unmounted during async operation
          newTranscriber.close(true).catch(console.error);
        }
      } catch (error) {
        console.error("Failed to create transcriber:", error);
      }
    };

    createTranscriber();

    // Cleanup function
    return () => {
      isMounted = false;

      // No need to close transcriber here as we're just setting the state
      // The actual closing happens in the component when needed
    };
  }, [token]);

  console.log("Transcriber: ", transcriber);
  return transcriber;
};
