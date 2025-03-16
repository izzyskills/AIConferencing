from fastapi.testclient import TestClient
from src import app

client = TestClient(app)


def test_lemur_endpoint_missing_prompt():
    # Send a request without a prompt to test error handling.
    request_data = {"prompt": "what is the current date"}
    response = client.post("/lemur", json=request_data)
    assert response.status_code == 400


def test_assembly_token_generation():
    # Test token generation when API key is set correctly.
    response = client.get("/assembly/token")
    # Depending on your config, check for proper status code and response structure.
    assert response.status_code == 200
    data = response.json()
    assert "token" in data


def test_stream_token_generation():
    # Test the stream token endpoint using a valid auth token.
    token = "df5d64c2adf91f58d6ac963041d7d253-623424ea-38440929 "
    headers = {"Authorization": token}

    response = client.post("/stream/token", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "userId" in data and "token" in data
