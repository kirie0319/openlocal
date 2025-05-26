from fastapi import APIRouter, HTTPException
from typing import List
from app.models import User, UserCreate, UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

# In-memory storage (for demo purposes)
users_db = []
user_counter = 1

@router.get("/", response_model=List[User])
async def get_users():
    """Get all users"""
    return users_db

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int):
    """Get a specific user by ID"""
    user = next((user for user in users_db if user.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    global user_counter
    # Check if username already exists
    if any(u.username == user.username for u in users_db):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = User(id=user_counter, **user.model_dump())
    users_db.append(new_user)
    user_counter += 1
    return new_user

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user_update: UserUpdate):
    """Update an existing user"""
    user_index = next((i for i, user in enumerate(users_db) if user.id == user_id), None)
    if user_index is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_user = users_db[user_index]
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Check if username is being updated and if it already exists
    if "username" in update_data:
        if any(u.username == update_data["username"] and u.id != user_id for u in users_db):
            raise HTTPException(status_code=400, detail="Username already exists")
    
    updated_user = current_user.model_copy(update=update_data)
    users_db[user_index] = updated_user
    return updated_user

@router.delete("/{user_id}")
async def delete_user(user_id: int):
    """Delete a user"""
    user_index = next((i for i, user in enumerate(users_db) if user.id == user_id), None)
    if user_index is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    deleted_user = users_db.pop(user_index)
    return {"message": f"User '{deleted_user.username}' deleted successfully"} 