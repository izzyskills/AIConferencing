from src.auth.utils import (
    generate_passwd_hash,
    verify_password,
    create_access_token,
    decode_token,
    create_url_safe_token,
    decode_url_safe_token,
)


def test_generate_passwd_hash():
    password = "testpassword"
    hash = generate_passwd_hash(password)
    assert hash is not None
    assert verify_password(password, hash)


def test_verify_password():
    password = "testpassword"
    hash = generate_passwd_hash(password)
    assert verify_password(password, hash)
    assert not verify_password("wrongpassword", hash)


def test_create_access_token():
    user_data = {"email": "test@example.com", "user_uid": "12345", "role": "user"}
    token = create_access_token(user_data)
    assert token is not None


def test_decode_token():
    user_data = {"email": "test@example.com", "user_uid": "12345", "role": "user"}
    token = create_access_token(user_data)
    decoded_data = decode_token(token)
    assert decoded_data is not None
    assert decoded_data["user"] == user_data


def test_create_url_safe_token():
    data = {"email": "test@example.com"}
    token = create_url_safe_token(data)
    assert token is not None


def test_decode_url_safe_token():
    data = {"email": "test@example.com"}
    token = create_url_safe_token(data)
    decoded_data = decode_url_safe_token(token)
    assert decoded_data is not None
    assert decoded_data["email"] == data["email"]
