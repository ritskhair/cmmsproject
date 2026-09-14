from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, require_roles
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountResponse, AccountUpdate

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("", response_model=list[AccountResponse])
def list_accounts(db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    return db.query(Account).order_by(Account.created_at.desc()).all()


@router.post("", response_model=AccountResponse, status_code=201)
def create_account(payload: AccountCreate, db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    account = Account(username=payload.username, password=hash_password(payload.password), role=payload.role)
    db.add(account)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username already exists")
    db.refresh(account)
    return account


@router.patch("/{account_id}", response_model=AccountResponse)
def update_account(account_id: UUID, payload: AccountUpdate, db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    values = payload.model_dump(exclude_unset=True)
    if "password" in values:
        values["password"] = hash_password(values["password"])
    for key, value in values.items():
        setattr(account, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username already exists")
    db.refresh(account)
    return account


@router.delete("/{account_id}", status_code=204)
def delete_account(account_id: UUID, db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
