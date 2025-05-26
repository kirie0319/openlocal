from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Create FastAPI instance
app = FastAPI(
    title="Test Ninja API",
    description="A basic FastAPI application for testing and learning",
    version="1.0.0"
)

# Pydantic models
class Item(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    is_available: bool = True

class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    is_available: bool = True

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    is_active: bool = True

# In-memory storage (for demo purposes)
items_db = []
users_db = []
item_counter = 1
user_counter = 1

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Test Ninja API!"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Test Ninja API"}

# Items endpoints
@app.get("/items", response_model=List[Item])
async def get_items():
    return items_db

@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    item = next((item for item in items_db if item.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/items", response_model=Item)
async def create_item(item: ItemCreate):
    global item_counter
    new_item = Item(id=item_counter, **item.dict())
    items_db.append(new_item)
    item_counter += 1
    return new_item

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item_update: ItemCreate):
    item_index = next((i for i, item in enumerate(items_db) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    updated_item = Item(id=item_id, **item_update.dict())
    items_db[item_index] = updated_item
    return updated_item

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    item_index = next((i for i, item in enumerate(items_db) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    deleted_item = items_db.pop(item_index)
    return {"message": f"Item '{deleted_item.name}' deleted successfully"}

# Users endpoints
@app.get("/users", response_model=List[User])
async def get_users():
    return users_db

@app.post("/users", response_model=User)
async def create_user(user: User):
    global user_counter
    # Check if username already exists
    if any(u.username == user.username for u in users_db):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = User(id=user_counter, **user.dict(exclude={'id'}))
    users_db.append(new_user)
    user_counter += 1
    return new_user

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 