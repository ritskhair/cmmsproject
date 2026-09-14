from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_session, verify_password
from app.models.account import Account
from app.schemas.account import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.username == payload.username).first()
    if not account or not verify_password(payload.password, account.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"token": create_session(account), "account": account}
