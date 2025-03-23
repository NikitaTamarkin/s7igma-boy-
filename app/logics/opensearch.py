import openai
import requests
import json
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv
from typing import List


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_embedding(text):
    try:
        response = openai.Embedding.create(
            model="text-embedding-3-large", 
            input=text
        )
        return response['data'][0]['embedding']
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None

def get_docs(text, answer_model_bge_m3, answer_model_e5, index, **kwargs):
    url = f"https://localhost:9200/{index}/_search"
    
    body = {
        "size": kwargs['size'],
        "query": {
            "function_score": {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "function_score": {
                                    "query": {
                                        "knn": {
                                            "question_knn": {   # используем поле question_knn
                                                "vector": answer_model_bge_m3,
                                                "k": kwargs['size']
                                            }
                                        }
                                    },
                                    "weight": kwargs['sematic']
                                }
                            },
                            {
                                "function_score": {
                                    "query": {
                                        "knn": {
                                            "answer_knn": {   # используем поле answer_knn
                                                "vector": answer_model_e5,
                                                "k": kwargs['size']
                                            }
                                        }
                                    },
                                    "weight": kwargs['sematic']
                                }
                            },
                            {
                                "function_score": {
                                    "query": {
                                        "multi_match": {
                                            "query": text,
                                            "fields": kwargs['fields'],
                                            "type": "most_fields"
                                        }
                                    },
                                    "weight": kwargs['keyword']
                                }
                            }
                        ]
                    }
                }
            }
        }
    }

    response = requests.post(url, json=body,
                             auth=HTTPBasicAuth('admin', 'Toshi545454!'),
                             verify=False)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Ошибка: {response.status_code}, {response.text}")
        return None

def search(
        query_text,
        answer_model_bge_m3 = None,
        answer_model_e5 = None,
        query_id=0,
        total=10,
        emb=None,
        model = None,
        index = None,
        k = None,
        fields = None,
        tie_breaker = None,
        size = None,
        sematic = None,
        keyword = None
):
    docs = get_docs(
        text=query_text, 
        answer_model_bge_m3 = answer_model_bge_m3,
        answer_model_e5 = answer_model_e5,
        index=index,
        size = size,
        sematic = sematic,
        keyword = keyword,
        fields = fields
    )

    if docs:
        if 'hits' in docs and 'hits' in docs['hits']:
            docs_list = docs['hits']['hits']
        else:
            docs_list = []
        
        for i, doc in enumerate(docs_list, start=1):
            source = doc["_source"]
            source["search_row"] = i
            source["query"] = query_text
            source["query-id"] = query_id
    
        return json.dumps(docs_list, indent=4, ensure_ascii=False)
    else:
        return json.dumps({"error": "No results found"}, indent=4, ensure_ascii=False)

