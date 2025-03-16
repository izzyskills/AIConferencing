import uuid
from fastapi.testclient import TestClient
from src import app

client = TestClient(app)


def test_create_room():
    # Assume you already have a valid token from an authenticated user.
    token = "Bearer your_valid_token_here"

    room_data = {
        "created_by": "user_uuid_value",  # Use a valid UUID as string
        "room_name": "Team Meeting",
        "opens_at": "2025-03-15T12:00:00",
    }

    headers = {"Authorization": token}
    response = client.post("/create", json=room_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "rid" in data  # room id returned


def test_join_room():
    room_id = str(
        uuid.uuid4()
    )  # Example room id, in a real test this should match an existing room
    room_member_data = {
        "user_id": "user_uuid_value",
        "room_id": room_id,
    }
    token = "Bearer your_valid_token_here"
    headers = {"Authorization": token}

    response = client.post(f"/join/{room_id}", json=room_member_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "mid" in data  # member id returned
    # Validate the returned room/member data as needed.
