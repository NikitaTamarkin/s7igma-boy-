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

import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_support_answer(user_query: str, retrieved_data: dict) -> str:
    """
    Функция принимает:
    - user_query: вопрос пользователя
    - retrieved_data: список словарей с полями "question_translit_anylyzer" и "answer_translit_anylyzer"
    
    Формирует промпт, включающий вопрос пользователя и информацию из базы знаний,
    и возвращает ответ технической поддержки, сгенерированный OpenAI.
    """
    
    prompt = f"""
Ты специалист технической поддержки в компании S7. Пользователь задал тебе вопрос, и ты должен ответить, используя приведённые ниже данные из нашей базы знаний.

Вопрос пользователя:
"{user_query}"

Мы ншли релевантные для вопроса пользователя документы и тебе исходя из них нужно ответить на вопрос пользователя:

Название документа 1: {retrieved_data[0]['_source'].get("question_translit_anylyzer", "Нет вопроса")}
Документ 1: {retrieved_data[0]['_source'].get("answer_translit_anylyzer", "Нет ответа")}

Название документа 2: {retrieved_data[1]['_source'].get("question_translit_anylyzer", "Нет вопроса")}
Документ 2: {retrieved_data[1]['_source'].get("answer_translit_anylyzer", "Нет ответа")}

Название документа 3: {retrieved_data[2]['_source'].get("question_translit_anylyzer", "Нет вопроса")}
Документ 3: {retrieved_data[2]['_source'].get("answer_translit_anylyzer", "Нет ответа")}

Название документа 4: {retrieved_data[3]['_source'].get("question_translit_anylyzer", "Нет вопроса")}
Документ 4: {retrieved_data[3]['_source'].get("answer_translit_anylyzer", "Нет ответа")}

Название документа 5: {retrieved_data[4]['_source'].get("question_translit_anylyzer", "Нет вопроса")}
Документ 5: {retrieved_data[4]['_source'].get("answer_translit_anylyzer", "Нет ответа")}

На основе приведённой информации дай пользователю полный, точный и профессиональный ответ.
Бери информацию из ответов 1-5 чтоб ответить на впорос пользователя. Думай шаг за шагом и несколько раз посмотри на все ответы, там всегда есть релевантная информация.
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Ты ассистент технической поддержки из S7, дающий точные и подробные ответы на вопросы пользователей."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=500
    )

    answer = response.choices[0].message['content'].strip()
    if answer.startswith("```"):
        answer = "\n".join(answer.splitlines()[1:-1]).strip()
    return answer

def classify_support_question(user_query: str) -> dict:
    """
    Функция классифицирует вопрос пользователя на две категории:
    1. Вопрос по задержанию рейса
    2. Обычный вопрос
    
    Возвращает словарь с типом вопроса и дополнительной информацией.
    """
    prompt = f"""
    Ты – специалист S7 по классификации запросов пользователей. 
    Перед тобой запрос пользователя: "{user_query}"
    
    Твоя задача определить, относится ли вопрос к задержке рейса или это обычный вопрос.
    
    Примеры вопросов по задержке рейса:
    - Мой рейс задержали, что мне делать?
    - Как получить компенсацию за задержку рейса?
    - Я не могу вылететь из-за задержки рейса
    - Когда вылетит мой задержанный рейс?
    - Куда обратиться по задержке рейса?
    
    Если вопрос связан с задержкой рейса, ответь "delay".
    Если это обычный вопрос, ответь "regular".
    
    Дай ответ в формате одного слова: "delay" или "regular".
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Ты ассистент, классифицирующий вопросы."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=50
    )
    
    result = response.choices[0].message['content'].strip().lower()
    question_type = "delay" if "delay" in result else "regular"
    
    return {
        "type": question_type,
        "query": user_query
    }

def format_delay_decision_response(decision: str, user_query: str, user_name: str) -> str:
    """
    Функция форматирует ответ на запрос о задержке рейса.
    
    Параметры:
    - decision: решение из базы данных
    - user_query: исходный запрос пользователя
    - user_name: имя пользователя
    
    Возвращает отформатированный ответ от службы поддержки.
    """
    prompt = f"""
    Ты – специалист службы поддержки авиакомпании S7. 
    
    Пассажир {user_name} спрашивает: "{user_query}"
    
    Информация из системы:
    "{decision}"
    
    Сформулируй профессиональный, вежливый и подробный ответ пассажиру, включающий:
    1. Обращение по имени
    2. Понимание проблемы
    3. Четкое объяснение принятого решения
    4. Извинения за неудобства
    5. Инструкции по дальнейшим действиям
    6. Контактную информацию для дополнительных вопросов
    
    Отвечай от имени службы поддержки S7. Твоя задача сделать в ответе упор на Информация из системы, ты должен написать, что предлогаешь пользователю именно такой вариант решения, который прописан в Информация из системы.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Ты специалист службы поддержки авиакомпании S7."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    return response.choices[0].message['content'].strip()
