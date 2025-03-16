import { useVideoClient } from "@/hooks/useVideoClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import ErrorScreen from "./ErrorScreen";
import { useCallback, useEffect, useState } from "react";
import CallLayout from "./CallLayout";

export default function CallContainer({
  apiKey,
  user,
  token,
  roomId,
  isAdmin,
}) {
  const [call, setCall] = useState();
  const [joining, setJoining] = useState(false);

  const videoClient = useVideoClient({
    apiKey,
    user,
    tokenOrProvider: token,
  });

  const callId = roomId;

  const createCall = useCallback(async () => {
    const callToCreate = videoClient?.call("default", callId);
    await callToCreate?.camera.disable();
    await callToCreate?.join({ create: true });
    setCall(callToCreate);
    setJoining(false);
  }, [videoClient]);

  useEffect(() => {
    if (!videoClient) {
      return;
    }

    if (!call) {
      if (joining) {
        createCall();
      } else {
        setJoining(true);
      }
    }
  }, [call, videoClient, createCall, joining]);

  if (!call) {
    return (
      <div className="w-full h-full text-xl font-semibold flex items-center justify-center animate-pulse">
        Joining call ...
      </div>
    );
  }

  if (!videoClient) {
    return <ErrorScreen error="Client could not be initialized" />;
  }

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <CallLayout isAdmin={isAdmin} />
      </StreamCall>
    </StreamVideo>
  );
}
