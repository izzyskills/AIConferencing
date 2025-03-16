from fastapi.testclient import TestClient
from src import app

client = TestClient(app)


def test_signup():
    # Define test user data
    user_data = {
        "email": "testuser@example.com",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "password": "StrongPassword123",
    }
    response = client.post("/signup", json=user_data)
    # Expecting 201 status code for created account
    assert response.status_code == 201
    data = response.json()
    assert "message" in data and "user" in data


def test_login_unverified_user():
    # Login with an account that exists but is not yet verified
    login_data = {"email": "testuser@example.com", "password": "StrongPassword123"}
    response = client.post("/login", json=login_data)
    # Expect a failure due to unverified account (e.g., 400 or a custom error)
    assert response.status_code != 200


def test_login_users_success():
    login_data = {"email": "test@example.com", "password": "testpassword"}
    response = client.post("/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.cookies.get("refresh_token") is not None


def test_login_users_invalid_credentials():
    login_data = {"email": "wrong@example.com", "password": "wrongpassword"}
    response = client.post("/login", json=login_data)
    assert response.status_code == 401


def test_login_users_unverified_account():
    login_data = {"email": "unverified@example.com", "password": "testpassword"}
    response = client.post("/login", json=login_data)
    assert response.status_code == 403


def test_revoke_token():
    response = client.get("/logout")
    assert response.status_code == 200
    assert response.json() == {"message": "Logged Out Successfully"}


def test_get_new_access_token():
    response = client.get("/refresh_token")
    assert response.status_code == 401  # Assuming no refresh token is set

    # Simulate setting a refresh token
    client.cookies.set("refresh_token", "valid_refresh_token")
    response = client.get("/refresh_token")
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_protected_endpoint_access():
    protected_endpoint = "/protected"

    # Test access with no token
    response = client.get(protected_endpoint)
    assert response.status_code == 401  # Unauthorized

    # Test access with invalid token
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get(protected_endpoint, headers=headers)
    assert response.status_code == 401  # Unauthorized

    # Test access with valid token
    login_data = {"email": "test@example.com", "password": "testpassword"}
    login_response = client.post("/login", json=login_data)
    assert login_response.status_code == 200
    access_token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get(protected_endpoint, headers=headers)
    assert response.status_code == 200  # OK

    # Test access with valid token but insufficient role
    # Assuming you have role-based access control and the user role is insufficient
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/admin/protected", headers=headers)
    assert response.status_code == 403  # Forbidden
