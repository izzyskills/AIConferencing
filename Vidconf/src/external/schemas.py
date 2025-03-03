from pydantic import BaseModel


class LemurRequest(BaseModel):
    prompt: str
