from fastapi import APIRouter, HTTPException
from typing import List
from app.models import Item, ItemCreate, ItemUpdate

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}},
)

# In-memory storage (for demo purposes)
items_db = []
item_counter = 1

@router.get("/", response_model=List[Item])
async def get_items():
    """Get all items"""
    return items_db

@router.get("/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """Get a specific item by ID"""
    item = next((item for item in items_db if item.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=Item)
async def create_item(item: ItemCreate):
    """Create a new item"""
    global item_counter
    new_item = Item(id=item_counter, **item.model_dump())
    items_db.append(new_item)
    item_counter += 1
    return new_item

@router.put("/{item_id}", response_model=Item)
async def update_item(item_id: int, item_update: ItemCreate):
    """Update an existing item"""
    item_index = next((i for i, item in enumerate(items_db) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    updated_item = Item(id=item_id, **item_update.model_dump())
    items_db[item_index] = updated_item
    return updated_item

@router.delete("/{item_id}")
async def delete_item(item_id: int):
    """Delete an item"""
    item_index = next((i for i, item in enumerate(items_db) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    deleted_item = items_db.pop(item_index)
    return {"message": f"Item '{deleted_item.name}' deleted successfully"} 