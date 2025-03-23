import time
import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from app.logics.openai_sql import get_sql_query_from_gpt, get_support_answer, classify_support_question, format_delay_decision_response
from app.logics.sql_search import execute_sql_query
from app.logics.body_requests import UserQuery, QueryRequest, UserRequest, SupportRequest, DelaySupport
from app.logics.opensearch import get_embedding, search
from fastapi import HTTPException
import json
from pydantic import BaseModel

app = FastAPI(title="Пользовательский запрос -> SQL -> Результаты", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.post("/search")
async def search_endpoint(query: QueryRequest):
    embedding = get_embedding(query.question)
    if embedding is None:
        raise HTTPException(status_code=500, detail="Ошибка генерации эмбеддинга")
    
    result_json = search(
        query_text=query.question,
        answer_model_bge_m3=embedding,
        answer_model_e5=embedding,
        query_id=query.query_id,
        total=query.size,
        model=None,
        index=query.index,
        k=None,
        fields=query.fields,
        tie_breaker=None,
        size=query.size,
        sematic=query.sematic,
        keyword=query.keyword
    )
    
    ans = json.loads(result_json)

    formatted_answer = get_support_answer(query.question, ans)

    return {"answer": formatted_answer}

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd

# Загружаем датасет
df = pd.read_csv("/Users/admin/Desktop/S7-2/dataset_with_3city_routes.csv", encoding="utf-8-sig")

@app.post("/get_decision/")
async def get_decision(user: UserRequest):
    passenger = df[(df["Имя"] == user.first_name) & (df["Фамилия"] == user.last_name)]
    
    if passenger.empty:
        raise HTTPException(status_code=404, detail="Пассажир не найден")
    
    decision = passenger["Принятое_решение"].values[0]
    ans = format_delay_decision_response(decision,user.question,str(user.first_name + user.last_name))
    return {"decision": ans}

@app.post("/classify_question")
async def classify_question(support_request: SupportRequest):
    """Endpoint для классификации вопросов в службу поддержки"""
    classification = classify_support_question(support_request.query)
    return classification

class DelayResponseRequest(BaseModel):
    decision: str
    query: str
    user_name: str

@app.post("/format_delay_response")
async def format_delay_response(request: DelayResponseRequest):
    """Endpoint для форматирования ответа о задержке рейса"""
    formatted_response = format_delay_decision_response(
        decision=request.decision,
        user_query=request.query,
        user_name=request.user_name
    )
    return {"response": formatted_response}

