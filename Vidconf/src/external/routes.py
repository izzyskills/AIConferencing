from fastapi import APIRouter, HTTPException, Depends
import requests
from src.auth.dependencies import AccessTokenBearer
import stream_chat
import assemblyai as aai

from src.config import Config
from src.external.schemas import LemurRequest

external_router = APIRouter()

ASSEMBLY_API_URL = "https://api.assemblyai.com/lemur/v3/generate/task"

# set the API key
aai.settings.api_key = f"{Config.ASSEMBLY_API_KEY}"


@external_router.post("/lemur")
async def process_lemur_request(request_data: LemurRequest):
    if not Config.ASSEMBLY_API_KEY:
        raise HTTPException(status_code=500, detail="Missing API key")

    prompt = request_data.prompt
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    final_prompt = f"""You act as an assistant during a video call. You get a question and I want you to answer it directly without repeating it.
    If you do not know the answer, clearly state that.
    Here is the user question:
    {prompt}"""

    response = requests.post(
        ASSEMBLY_API_URL,
        json={
            "final_model": "anthropic/claude-3-haiku",
            "temperature": 0.5,
            "prompt": final_prompt,
            "input_text": "This is a conversation during a video call.",
        },
        headers={
            "Authorization": Config.ASSEMBLY_API_KEY,
            "Content-Type": "application/json",
        },
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail="Error from AssemblyAI"
        )

    return response.json()


@external_router.get("/assembly/token")
async def generate_assembly_token():
    api_key = Config.ASSEMBLY_API_KEY

    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    try:
        # Initialize the AssemblyAI client

        # Create a temporary token for real-time transcription
        token = aai.RealtimeTranscriber.create_temporary_token(
            expires_in=360000  # Expiration time in milliseconds
        )

        return {"token": token}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate token: {str(e)}"
        )


@external_router.post("/stream/token")
async def get_stream_token(token: dict = Depends(AccessTokenBearer())):
    user_id = token["user"]["user_uid"]

    if not user_id:
        raise HTTPException(status_code=400, detail="Missing userId")

    if not Config.STREAM_API_KEY or not Config.STREAM_SECRET:
        raise HTTPException(status_code=500, detail="Missing API credentials")

    client = stream_chat.StreamChat(
        api_key=Config.STREAM_API_KEY, api_secret=Config.STREAM_SECRET
    )
    token = client.create_token(user_id)

    return {"userId": user_id, "token": token}
