from fastapi import APIRouter, HTTPException, Depends
import requests
from src.auth.dependencies import AccessTokenBearer
import stream_chat

from src.config import Config
from src.external.schemas import LemurRequest

external_router = APIRouter()

ASSEMBLY_API_URL = "https://api.assemblyai.com/v2/lemur/task"


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


@external_router.post("/assembly/token")
async def get_assembly_token():
    if not Config.ASSEMBLY_API_KEY:
        raise HTTPException(status_code=500, detail="Missing API key")

    response = requests.post(
        ASSEMBLY_API_URL,
        json={"expires_in": 3600000000},  # 1 hour in microseconds
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
