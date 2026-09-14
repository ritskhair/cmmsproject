import hashlib
import hmac
import secrets
from typing import Callable

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.account import Account


_sessions: dict[str, Account] = {}


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, stored_password: str) -> bool:
    try:
        salt_hex, digest_hex = stored_password.split("$", 1)
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), bytes.fromhex(salt_hex), 120_000
        )
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, TypeError):
        return False


def create_session(account: Account) -> str:
    token = secrets.token_urlsafe(32)
    _sessions[token] = account
    return token


def get_current_account(
    token: str | None = Header(default=None, alias="X-Session-Token"),
    db: Session = Depends(get_db),
) -> Account:
    if not token or token not in _sessions:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing session token")

    session_account = _sessions[token]
    account = db.query(Account).filter(Account.id == session_account.id).first()
    if not account:
        _sessions.pop(token, None)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account no longer exists")
    return account


def require_roles(*roles: str) -> Callable:
    def dependency(account: Account = Depends(get_current_account)) -> Account:
        if account.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role permissions")
        return account

    return dependency
