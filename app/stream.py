import streamlit as st
import requests

# API URL (убедитесь, что FastAPI запущен на этом адресе)
API_BASE_URL = "http://localhost:8001"

st.title("Техническая поддержка")

# Инициализируем переменные в session_state
if "user_query" not in st.session_state:
    st.session_state.user_query = ""
if "submitted" not in st.session_state:
    st.session_state.submitted = False
if "question_type" not in st.session_state:
    st.session_state.question_type = ""
if "classification_done" not in st.session_state:
    st.session_state.classification_done = False

# Ввод вопроса
st.session_state.user_query = st.text_area("Введите ваш вопрос:", value=st.session_state.user_query)

# Кнопка отправки вопроса на классификацию
if st.button("Отправить запрос") and st.session_state.user_query:
    classify_response = requests.post(f"{API_BASE_URL}/classify_question", json={"query": st.session_state.user_query})
    if classify_response.status_code == 200:
        classification = classify_response.json()
        st.session_state.question_type = classification.get("type", "other")
        st.session_state.submitted = True
        st.session_state.classification_done = True
    else:
        st.error("Ошибка классификации вопроса.")

# Если вопрос отправлен и классификация выполнена, продолжаем
if st.session_state.submitted and st.session_state.classification_done:
    if st.session_state.question_type == "delay":
        st.write("Этот вопрос связан с задержкой рейса.")
        # Форма для ввода имени и фамилии
        with st.form(key="delay_form"):
            first_name = st.text_input("Введите ваше имя:")
            last_name = st.text_input("Введите вашу фамилию:")
            submit_delay = st.form_submit_button("Получить решение")
        if submit_delay and first_name and last_name:
            decision_response = requests.post(f"{API_BASE_URL}/get_decision/", json={
                "first_name": first_name,
                "last_name": last_name,
                "question": st.session_state.user_query
            })
            if decision_response.status_code == 200:
                answer = decision_response.json().get("decision")
                st.write("Ответ:", answer)
            else:
                st.error("Пассажир не найден или произошла ошибка.")
    else:
        st.write("Этот вопрос не связан с задержкой рейса.")
        search_response = requests.post(f"{API_BASE_URL}/search", json={
            "question": st.session_state.user_query,
            "query_id": 0,
            "size": 5,
            "sematic": 1,
            "keyword": 0.5,
            "fields": [
                "question_translit_anylyzer",
                "answer_translit_anylyzer"
            ],
            "index": "s7-hack-answer"
        })
        if search_response.status_code == 200:
            answer = search_response.json().get("answer")
            st.write("Ответ:", answer)
        else:
            st.error("Ошибка поиска ответа.")

