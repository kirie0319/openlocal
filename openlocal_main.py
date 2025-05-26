from fastapi import FastAPI, HTTPException, Depends, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import uuid
import os
from datetime import datetime
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv
import aiofiles

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="OpenLocal - 翻訳対応型スレッド掲示板SNS",
    description="GPT + 地元住民が多言語で助け合う掲示板SNS",
    version="1.0.0"
)

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# OpenAI client setup
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Data models
class User(BaseModel):
    uuid: str
    username: str
    preferred_language: str = "ja"
    location: Optional[str] = None
    created_at: str

class Post(BaseModel):
    id: str
    author_uuid: str
    author_username: str
    title: str
    content: str
    original_language: str
    location: Optional[str] = None
    is_local_only: bool = False
    created_at: str
    reply_count: int = 0

class Reply(BaseModel):
    id: str
    post_id: str
    author_uuid: str
    author_username: str
    content: str
    original_language: str
    is_gpt_response: bool = False
    created_at: str

class TranslationCache(BaseModel):
    original_text: str
    original_language: str
    target_language: str
    translated_text: str

# In-memory storage (JSON-based)
DATA_DIR = "data"
USERS_FILE = f"{DATA_DIR}/users.json"
POSTS_FILE = f"{DATA_DIR}/posts.json"
REPLIES_FILE = f"{DATA_DIR}/replies.json"
TRANSLATIONS_FILE = f"{DATA_DIR}/translations.json"

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize data files if they don't exist
async def init_data_files():
    for file_path in [USERS_FILE, POSTS_FILE, REPLIES_FILE, TRANSLATIONS_FILE]:
        if not os.path.exists(file_path):
            async with aiofiles.open(file_path, 'w') as f:
                await f.write('[]')

# Data access functions
async def load_json_data(file_path: str) -> List[Dict]:
    try:
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
            return json.loads(content) if content.strip() else []
    except FileNotFoundError:
        return []

async def save_json_data(file_path: str, data: List[Dict]):
    async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(data, ensure_ascii=False, indent=2))

# User management
async def get_user_by_username(username: str) -> Optional[User]:
    users = await load_json_data(USERS_FILE)
    for user_data in users:
        if user_data['username'] == username:
            return User(**user_data)
    return None

async def get_user_by_uuid(user_uuid: str) -> Optional[User]:
    users = await load_json_data(USERS_FILE)
    for user_data in users:
        if user_data['uuid'] == user_uuid:
            return User(**user_data)
    return None

async def create_user(username: str, preferred_language: str = "ja", location: str = None) -> User:
    # Check if username already exists
    existing_user = await get_user_by_username(username)
    if existing_user:
        raise HTTPException(status_code=400, detail="ユーザー名が既に存在します")
    
    # Create new user
    new_user = User(
        uuid=str(uuid.uuid4()),
        username=username,
        preferred_language=preferred_language,
        location=location,
        created_at=datetime.now().isoformat()
    )
    
    # Save to file
    users = await load_json_data(USERS_FILE)
    users.append(new_user.dict())
    await save_json_data(USERS_FILE, users)
    
    return new_user

# Translation functions
async def translate_text(text: str, target_language: str, source_language: str = "auto") -> str:
    """Translate text using OpenAI GPT"""
    try:
        # Skip translation if source and target are the same
        if source_language == target_language:
            print(f"Translation skipped: same language ({source_language})")
            return text
            
        print(f"Translating from {source_language} to {target_language}: '{text[:50]}...'")
            
        # Check cache first
        translations = await load_json_data(TRANSLATIONS_FILE)
        for trans in translations:
            if (trans['original_text'] == text and 
                trans['target_language'] == target_language and
                trans['original_language'] == source_language):
                print(f"Translation found in cache")
                return trans['translated_text']
        
        # Translate using OpenAI
        language_names = {
            'ja': '日本語',
            'en': 'English',
            'ko': '한국어',
            'zh': '中文',
            'es': 'Español',
            'fr': 'Français'
        }
        
        target_lang_name = language_names.get(target_language, target_language)
        source_lang_name = language_names.get(source_language, source_language)
        
        # Create a more comprehensive system prompt for better translation
        system_prompt = f"あなたは多言語翻訳の専門家です。{source_lang_name}から{target_lang_name}への翻訳を行ってください。相手の文化を背景をしっかりと把握した上で、文脈と意味を正確に保ちながら、自然で読みやすい翻訳を提供してください。翻訳結果のみを返してください。"
        
        print(f"Calling OpenAI API for translation...")
        response = await client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            max_tokens=500,
            temperature=0.3
        )
        
        translated_text = response.choices[0].message.content.strip()
        print(f"Translation completed: '{translated_text[:50]}...'")
        
        # Cache the translation
        cache_entry = TranslationCache(
            original_text=text,
            original_language=source_language,
            target_language=target_language,
            translated_text=translated_text
        )
        translations.append(cache_entry.dict())
        await save_json_data(TRANSLATIONS_FILE, translations)
        
        return translated_text
        
    except Exception as e:
        print(f"Translation error: {e}")
        print(f"Error details: {type(e).__name__}: {str(e)}")
        return text  # Return original text if translation fails

# GPT response generation
async def generate_gpt_response(post_title: str, post_content: str) -> str:
    """Generate GPT response for a new post"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "あなたは地域コミュニティの親切なアシスタントです。投稿された質問や困りごとに対して、有用で建設的な回答を提供してください。地元の情報や一般的なアドバイスを含めて、親しみやすい口調で回答してください。"},
                {"role": "user", "content": f"タイトル: {post_title}\n内容: {post_content}"}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"GPT response error: {e}")
        return "申し訳ございませんが、現在自動回答を生成できません。他のユーザーからの回答をお待ちください。"

# API Endpoints

@app.on_event("startup")
async def startup_event():
    await init_data_files()

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/register")
async def register_user(
    username: str = Form(...),
    preferred_language: str = Form("ja"),
    location: str = Form(None)
):
    try:
        user = await create_user(username, preferred_language, location)
        return {"success": True, "user": user.dict()}
    except HTTPException as e:
        return {"success": False, "error": e.detail}

@app.post("/api/login")
async def login_user(username: str = Form(...)):
    user = await get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return {"success": True, "user": user.dict()}

@app.get("/api/posts")
async def get_posts(
    user_uuid: str = None,
    local_only: bool = False,
    user_location: str = None
):
    posts = await load_json_data(POSTS_FILE)
    
    # Filter posts based on local_only flag
    if local_only and user_location:
        posts = [p for p in posts if p.get('location') == user_location or not p.get('is_local_only')]
    
    # Sort by creation time (newest first)
    posts.sort(key=lambda x: x['created_at'], reverse=True)
    
    # Translate posts if user language is different from post language
    if user_uuid:
        user = await get_user_by_uuid(user_uuid)
        if user:
            print(f"User {user.username} preferred language: {user.preferred_language}")
            for post in posts:
                print(f"Post '{post['title'][:30]}...' original language: {post['original_language']}")
                # Translate if the post's original language is different from user's preferred language
                if post['original_language'] != user.preferred_language:
                    print(f"Translating post from {post['original_language']} to {user.preferred_language}")
                    post['translated_title'] = await translate_text(
                        post['title'], 
                        user.preferred_language, 
                        post['original_language']
                    )
                    post['translated_content'] = await translate_text(
                        post['content'], 
                        user.preferred_language, 
                        post['original_language']
                    )
                else:
                    print(f"No translation needed for post (same language)")
    
    return posts

@app.post("/api/posts")
async def create_post(
    user_uuid: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    location: str = Form(None),
    is_local_only: bool = Form(False)
):
    user = await get_user_by_uuid(user_uuid)
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # Create new post
    post_id = str(uuid.uuid4())
    new_post = Post(
        id=post_id,
        author_uuid=user.uuid,
        author_username=user.username,
        title=title,
        content=content,
        original_language=user.preferred_language,
        location=location,
        is_local_only=is_local_only,
        created_at=datetime.now().isoformat(),
        reply_count=0
    )
    
    # Save post
    posts = await load_json_data(POSTS_FILE)
    posts.append(new_post.dict())
    await save_json_data(POSTS_FILE, posts)
    
    # Generate GPT response
    gpt_response_content = await generate_gpt_response(title, content)
    
    # Create GPT reply
    gpt_reply = Reply(
        id=str(uuid.uuid4()),
        post_id=post_id,
        author_uuid="gpt-assistant",
        author_username="GPTアシスタント",
        content=gpt_response_content,
        original_language="ja",
        is_gpt_response=True,
        created_at=datetime.now().isoformat()
    )
    
    # Save GPT reply
    replies = await load_json_data(REPLIES_FILE)
    replies.append(gpt_reply.dict())
    await save_json_data(REPLIES_FILE, replies)
    
    # Update post reply count
    for post in posts:
        if post['id'] == post_id:
            post['reply_count'] = 1
            break
    await save_json_data(POSTS_FILE, posts)
    
    return {"success": True, "post": new_post.dict(), "gpt_reply": gpt_reply.dict()}

@app.get("/api/posts/{post_id}/replies")
async def get_replies(post_id: str, user_uuid: str = None):
    replies = await load_json_data(REPLIES_FILE)
    post_replies = [r for r in replies if r['post_id'] == post_id]
    
    # Sort by creation time
    post_replies.sort(key=lambda x: x['created_at'])
    
    # Translate replies if user language is different from reply language
    if user_uuid:
        user = await get_user_by_uuid(user_uuid)
        if user:
            print(f"User {user.username} preferred language: {user.preferred_language}")
            for reply in post_replies:
                print(f"Reply from {reply['author_username']} original language: {reply['original_language']}")
                # Translate if the reply's original language is different from user's preferred language
                if reply['original_language'] != user.preferred_language:
                    print(f"Translating reply from {reply['original_language']} to {user.preferred_language}")
                    reply['translated_content'] = await translate_text(
                        reply['content'], 
                        user.preferred_language, 
                        reply['original_language']
                    )
                else:
                    print(f"No translation needed for reply (same language)")
    
    return post_replies

@app.post("/api/posts/{post_id}/replies")
async def create_reply(
    post_id: str,
    user_uuid: str = Form(...),
    content: str = Form(...)
):
    user = await get_user_by_uuid(user_uuid)
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    
    # Create new reply
    new_reply = Reply(
        id=str(uuid.uuid4()),
        post_id=post_id,
        author_uuid=user.uuid,
        author_username=user.username,
        content=content,
        original_language=user.preferred_language,
        is_gpt_response=False,
        created_at=datetime.now().isoformat()
    )
    
    # Save reply
    replies = await load_json_data(REPLIES_FILE)
    replies.append(new_reply.dict())
    await save_json_data(REPLIES_FILE, replies)
    
    # Update post reply count
    posts = await load_json_data(POSTS_FILE)
    for post in posts:
        if post['id'] == post_id:
            post['reply_count'] += 1
            break
    await save_json_data(POSTS_FILE, posts)
    
    return {"success": True, "reply": new_reply.dict()}

@app.get("/api/translate")
async def translate_endpoint(
    text: str,
    target_language: str,
    source_language: str = "auto"
):
    translated = await translate_text(text, target_language, source_language)
    return {"translated_text": translated}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 