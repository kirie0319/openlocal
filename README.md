# Test Ninja Project

Welcome to the Test Ninja project! This is a sample repository to demonstrate various testing concepts and practices with a FastAPI backend and beautiful web interface.

## Overview

This project serves as a learning playground for testing methodologies, frameworks, and best practices in software development. It now includes a fully functional FastAPI application with organized structure, comprehensive endpoints, and a modern web interface built with Jinja2 templates.

## Features

- Clean and organized code structure
- FastAPI web application with RESTful API
- **Beautiful Web Interface** with Jinja2 templates
- **Bootstrap 5** responsive design
- Modular router-based architecture
- Pydantic models for data validation
- Comprehensive testing examples
- Documentation and guides
- Best practices implementation
- Auto-generated API documentation (Swagger/OpenAPI)
- **Interactive web forms** for managing items and users

## Project Structure

```
test_ninja/
├── app/
│   ├── __init__.py
│   ├── main.py              # Main FastAPI application with templates
│   ├── models.py            # Pydantic models
│   └── routers/
│       ├── __init__.py
│       ├── items.py         # Items API endpoints
│       └── users.py         # Users API endpoints
├── templates/               # Jinja2 HTML templates
│   ├── base.html           # Base template with navigation
│   ├── index.html          # Home page
│   ├── items.html          # Items management page
│   └── users.html          # Users management page
├── main.py                  # Simple FastAPI app (alternative)
├── run.py                   # Application runner
├── requirements.txt         # Python dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.7+
- pip (Python package installer)

### Installation

1. Clone this repository
```bash
git clone <repository-url>
cd test_ninja
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

### Running the Application

You can run the FastAPI application in several ways:

#### Option 1: Using the run script (Recommended)
```bash
python run.py
```

#### Option 2: Using the organized app structure
```bash
python -m app.main
```

#### Option 3: Using uvicorn directly
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Option 4: Using the simple main.py
```bash
python main.py
```

### Accessing the Application

Once the application is running, you can access:

#### **Web Interface (NEW!)**
- **Home Page**: http://localhost:8000 - Beautiful landing page with stats
- **Items Management**: http://localhost:8000/items - Interactive items CRUD interface
- **Users Management**: http://localhost:8000/users - Interactive users CRUD interface

#### **API Documentation**
- **Interactive API Documentation (Swagger)**: http://localhost:8000/docs
- **Alternative API Documentation (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **API Info**: http://localhost:8000/api/v1/info

### API Endpoints

#### Items API (`/api/v1/items`)
- `GET /api/v1/items/` - Get all items
- `GET /api/v1/items/{item_id}` - Get specific item
- `POST /api/v1/items/` - Create new item
- `PUT /api/v1/items/{item_id}` - Update item
- `DELETE /api/v1/items/{item_id}` - Delete item

#### Users API (`/api/v1/users`)
- `GET /api/v1/users/` - Get all users
- `GET /api/v1/users/{user_id}` - Get specific user
- `POST /api/v1/users/` - Create new user
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user

### Web Interface Features

#### **🏠 Home Page**
- Modern hero section with gradient background
- Feature cards showcasing API capabilities
- Real-time statistics (items count, users count, API status)
- Quick navigation to all sections

#### **📦 Items Management**
- Grid layout displaying all items with cards
- **Add New Item** modal with form validation
- **Edit Item** functionality with pre-populated forms
- **Delete Item** with confirmation
- Price formatting and availability status badges
- Responsive design for mobile and desktop

#### **👥 Users Management**
- User cards with avatar initials
- **Add New User** modal with email validation
- **Edit User** functionality
- **Delete User** with confirmation
- Active/inactive status indicators
- Email display with icons

### Example Usage

#### Using the Web Interface
1. Visit http://localhost:8000
2. Navigate to "Items" or "Users" from the navigation
3. Use the "Add New" buttons to create items/users
4. Click edit/delete buttons on cards to manage existing data

#### Using the API directly

##### Creating an Item
```bash
curl -X POST "http://localhost:8000/api/v1/items/" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Item",
       "description": "A sample item for testing",
       "price": 29.99,
       "is_available": true
     }'
```

##### Creating a User
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "is_active": true
     }'
```

## Development

### Code Organization

- **Models** (`app/models.py`): Pydantic models for request/response validation
- **Routers** (`app/routers/`): Modular API endpoints organized by resource
- **Main App** (`app/main.py`): FastAPI application setup with template rendering
- **Templates** (`templates/`): Jinja2 HTML templates with Bootstrap styling

### Template Structure

- **Base Template** (`base.html`): Common layout with navigation, footer, and Bootstrap
- **Page Templates**: Extend base template with specific content
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Interactive Forms**: JavaScript-powered CRUD operations

### Adding New Features

1. Define new Pydantic models in `app/models.py`
2. Create new router files in `app/routers/`
3. Include new routers in `app/main.py`
4. Create corresponding HTML templates in `templates/`
5. Update navigation in `base.html`
6. Update this README with new endpoints

## Testing

The application includes comprehensive testing options:

### **Web Interface Testing**
- Use the beautiful web interface at http://localhost:8000
- Interactive forms with real-time validation
- Responsive design testing on different screen sizes

### **API Testing**
- Interactive Swagger documentation at `/docs`
- curl commands
- Postman or similar API testing tools
- Python requests library

## Technologies Used

- **Backend**: FastAPI, Uvicorn
- **Frontend**: Jinja2, Bootstrap 5, Font Awesome
- **Data Validation**: Pydantic v2
- **Documentation**: Auto-generated OpenAPI/Swagger
- **Styling**: Custom CSS with Bootstrap components

## Contributing

Feel free to contribute by:
- Adding new API endpoints
- Improving the web interface design
- Adding new template pages
- Improving error handling
- Adding database integration
- Implementing authentication
- Adding comprehensive tests
- Improving documentation

## License

This project is open source and available under the MIT License.
