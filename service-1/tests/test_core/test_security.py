import pytest
from datetime import timedelta

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)


def test_password_hashing():
    password = "testpassword123"
    hashed = get_password_hash(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_create_access_token():
    data = {"sub": "123"}
    token = create_access_token(data)
    
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_create_refresh_token():
    data = {"sub": "123"}
    token = create_refresh_token(data)
    
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_decode_token():
    data = {"sub": "123"}
    token = create_access_token(data)
    decoded = decode_token(token)
    
    assert decoded is not None
    assert decoded.get("sub") == "123"
    assert decoded.get("type") == "access"


def test_decode_invalid_token():
    decoded = decode_token("invalid.token.here")
    assert decoded is None


def test_token_with_expiry():
    data = {"sub": "123"}
    token = create_access_token(data, expires_delta=timedelta(minutes=5))
    decoded = decode_token(token)
    
    assert decoded is not None
    assert "exp" in decoded

