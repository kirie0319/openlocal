from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from app.routers import items, users
import uvicorn

# Create FastAPI instance
app = FastAPI(
    title="Test Ninja API",
    description="A well-organized FastAPI application for testing and learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Include API routers
app.include_router(items.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")

# HTML Routes
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # Get current stats
    items_count = len(items.items_db)
    users_count = len(users.users_db)
    
    return templates.TemplateResponse("index.html", {
        "request": request,
        "items_count": items_count,
        "users_count": users_count,
        "status": "Healthy",
        "version": "1.0.0"
    })

@app.get("/items", response_class=HTMLResponse)
async def items_page(request: Request):
    return templates.TemplateResponse("items.html", {
        "request": request,
        "items": items.items_db
    })

@app.get("/users", response_class=HTMLResponse)
async def users_page(request: Request):
    return templates.TemplateResponse("users.html", {
        "request": request,
        "users": users.users_db
    })

# API endpoints (JSON responses)
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Test Ninja API",
        "version": "1.0.0"
    }

# Keep the original health endpoint for backward compatibility
@app.get("/health")
async def health_check_legacy():
    return {
        "status": "healthy",
        "service": "Test Ninja API",
        "version": "1.0.0"
    }

# API info endpoint
@app.get("/api/v1/info")
async def api_info():
    return {
        "api_version": "v1",
        "endpoints": {
            "items": "/api/v1/items",
            "users": "/api/v1/users"
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc"
        },
        "web_interface": {
            "home": "/",
            "items": "/items",
            "users": "/users"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 