import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


@pytest.mark.asyncio
async def test_user_get_by_id(db: AsyncSession, test_user: User):
    found_user = await User.get_by_id(db, test_user.id)
    assert found_user is not None
    assert found_user.id == test_user.id
    assert found_user.email == test_user.email


@pytest.mark.asyncio
async def test_user_get_by_id_not_found(db: AsyncSession):
    found_user = await User.get_by_id(db, 99999)
    assert found_user is None


@pytest.mark.asyncio
async def test_user_get_by_email(db: AsyncSession, test_user: User):
    found_user = await User.get_by_email(db, test_user.email)
    assert found_user is not None
    assert found_user.email == test_user.email


@pytest.mark.asyncio
async def test_user_get_by_email_not_found(db: AsyncSession):
    found_user = await User.get_by_email(db, "nonexistent@example.com")
    assert found_user is None


@pytest.mark.asyncio
async def test_user_creation(db: AsyncSession):
    user = User(
        email="newuser@example.com",
        hashed_password="hashed_password",
        full_name="New User",
        is_active=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    assert user.id is not None
    assert user.email == "newuser@example.com"
    assert user.is_active is True

