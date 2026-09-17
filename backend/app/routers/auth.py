from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import OperatorSession, create_session, operator_ip_allowed, revoke_session, verify_password
from app.models.account import Account
from app.schemas.account import LoginRequest, LoginResponse, OperatorLoginResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.username == payload.username).first()
    if not account or not verify_password(payload.password, account.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"token": create_session(account), "account": account, "role": account.role}


@router.post("/operator", response_model=OperatorLoginResponse)
def operator_login(request: Request):
    if not operator_ip_allowed(request.client.host if request.client else None):
        raise HTTPException(status_code=403, detail="Operator login is only available from the factory network")
    return {"token": create_session(OperatorSession()), "role": "operator"}


@router.post("/logout", status_code=204)
def logout(token: str | None = Header(default=None, alias="X-Session-Token")):
    revoke_session(token)
