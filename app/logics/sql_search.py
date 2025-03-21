import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import HTTPException
from typing import Any
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

load_dotenv()

#logging.info(f"DB_HOST: {os.getenv('DB_HOST')}")
#logging.info(f"DB_USER: {os.getenv('DB_USER')}")
#logging.info(f"DB_NAME: {os.getenv('DB_NAME')}")

def execute_sql_query(query: str) -> Any:
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            dbname=os.getenv("DB_NAME")
        )
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query)
        results = cursor.fetchall()
        conn.commit()
        return results
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Ошибка работы с БД: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()