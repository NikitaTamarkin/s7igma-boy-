import time
import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from app.logics.openai_sql import get_sql_query_from_gpt
from app.logics.sql_search import execute_sql_query
from app.logics.body_requests import UserQuery

app = FastAPI(title="Пользовательский запрос -> SQL -> Результаты", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В production нужно указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Проверяем наличие build директории и используем ее, если она существует
dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str, request: Request):
        if full_path.startswith("process_query"):
            return None
            
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    app.mount("/static", StaticFiles(directory="app/static"), name="static")
    
    @app.get("/")
    async def read_root():
        return FileResponse("app/static/index.html")

@app.post("/process_query")
async def process_query(user_data: UserQuery):
    current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    
    sql_query = get_sql_query_from_gpt(user_data.user_age, current_time, user_data.user_location, user_data.user_query)
    
    results = execute_sql_query(sql_query)
    
    return {"sql_query": sql_query, "results": results}
