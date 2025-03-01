import { useStreamToken } from "@/adapters/Requests";
import CallContainer from "@/components/CallContainer";
import ErrorScreen from "@/components/ErrorScreen";
import useAuth from "@/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MeetingView() {
  const [homeState, setHomeState] = useState();
  const [error, setError] = useState();
  const { user } = useAuth();
  const { roomId } = useParams();
  const streamToken = useStreamToken();

  const getUserTokenFunction = useCallback(() => {
    getUserToken(
      user.user_uid,
      user.email,
      streamToken,
      setHomeState,
      setError,
      roomId,
    );
  }, [user, streamToken, roomId]);

  useEffect(() => {
    getUserTokenFunction();
  }, [getUserTokenFunction]);
  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (homeState) {
    return <CallContainer {...homeState} />;
  }

  return (
    <section className="w-screen-h-screen flex items-center justify-center">
      <h1 className="animate-pulse">Loading</h1>
    </section>
  );

  async function getUserToken(
    userId,
    userName,
    streamToken,
    setHomeState,
    setError,
    roomId,
  ) {
    try {
      const response = await streamToken.mutateAsync();
      const token = response.token;

      if (!token) {
        setError("No token found");
        return;
      }

      const user = {
        id: userId,
        name: userName,
        image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
      };

      const apiKey = import.meta.env.VITE_REACT_PUBLIC_STREAM_API_KEY;
      if (apiKey) {
        setHomeState({
          apiKey: apiKey,
          user: user,
          token: token,
          roomId: roomId,
        });
      } else {
        setError("API key not found. Please add to your environment file.");
      }
    } catch (error) {
      setError("An error occurred while fetching the token");
    }
  }
}
