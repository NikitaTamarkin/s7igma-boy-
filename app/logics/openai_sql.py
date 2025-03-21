import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_sql_query_from_gpt(user_age: int, current_time: str, user_location: str, user_query: str) -> str:
    
    prompt = f"""
    Ты – специалист по ETL процессам и SQL. Перед тобой запрос пользователя:
    "{user_query}"

    Также у тебя есть базовая информация о пользователе:
    - Возраст: {user_age}
    - Текущее время: {current_time}
    - Местоположение: {user_location}

    У тебя имеется таблица flights с такими колонками:
    - departure_city (Город отправки)
    - arrival_city (Город прибытия)
    - departure_time (Время вылета, по часовому поясу Новосибирска)
    - arrival_time (Время прибытия, по часовому поясу Новосибирска)
    - economy_basic_price (Цена Эконом-базовый)
    - economy_standard_price (Цена Эконом-стандарт)
    - economy_plus_price (Цена Эконом-плюс)
    - carry_on_weight (Размер ручной клади, кг)
    - baggage_price (Стоимость багажа, руб.)
    - meal_type (Тип питания)
    - pet_transport (Перевозка питомцев)

    Напиши SQL запрос для поиска подходящих рейсов. Важные правила:
    1. Используй точный синтаксис PostgreSQL
    2. Для работы с интервалами используй формат: departure_time >= CURRENT_TIMESTAMP и departure_time <= CURRENT_TIMESTAMP + INTERVAL '7 days'
    3. Всегда сортируй по времени вылета (departure_time) и цене (economy_basic_price)
    4. Ограничивай выборку 10 записями
    5. Используй только существующие колонки из таблицы flights

    Верни только SQL запрос, без пояснений."""

    response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Ты ассистент, генерирующий SQL запрос."},
                {"role": "user", "content": prompt}
            ],
                temperature=0.7,
                max_tokens=500
            )
    output_text = response.choices[0].message['content'].strip()
    if output_text.startswith("```"):
        output_text = "\n".join(output_text.splitlines()[1:-1]).strip()
    return output_text

