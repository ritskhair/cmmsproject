import hashlib
import hmac
import ipaddress
import secrets
from dataclasses import dataclass
from typing import Callable

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.account import Account
from app.core.config import OPERATOR_ALLOWED_NETWORKS


@dataclass(frozen=True)
class OperatorSession:
    role: str = "operator"
    username: str = "operator"


CurrentAccount = Account | OperatorSession
_sessions: dict[str, CurrentAccount] = {}


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


def create_session(account: CurrentAccount) -> str:
    token = secrets.token_urlsafe(32)
    _sessions[token] = account
    return token


def revoke_session(token: str | None) -> None:
    if token:
        _sessions.pop(token, None)


def get_current_account(
    token: str | None = Header(default=None, alias="X-Session-Token"),
    db: Session = Depends(get_db),
) -> CurrentAccount:
    if not token or token not in _sessions:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing session token")

    session_account = _sessions[token]
    if isinstance(session_account, OperatorSession):
        return session_account
    account = db.query(Account).filter(Account.id == session_account.id).first()
    if not account:
        _sessions.pop(token, None)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account no longer exists")
    return account


def operator_ip_allowed(client_host: str | None) -> bool:
    if not client_host:
        return False
    try:
        address = ipaddress.ip_address(client_host)
        networks = [ipaddress.ip_network(value.strip()) for value in OPERATOR_ALLOWED_NETWORKS.split(",") if value.strip()]
        return any(address in network for network in networks)
    except ValueError:
        return False


def require_roles(*roles: str) -> Callable:
    def dependency(account: CurrentAccount = Depends(get_current_account)) -> CurrentAccount:
        if account.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role permissions")
        return account

    return dependency
