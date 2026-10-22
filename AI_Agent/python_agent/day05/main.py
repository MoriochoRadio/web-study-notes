# main.py
from fastapi import FastAPI

app = FastAPI(title="나만의 첫 API 서버")

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"{name}님, 안녕하세요!"}

# [1번 문제]
# GET 방식으로 "/profile" 경로에 접속하면
# {"name": "나의 이름", "role": "student"} 형태의 딕셔너리를 반환하는
# profile 함수를 작성하고, @app.get("/profile") 데코레이터를 붙이세요.
@app.get("/profile")
def profile():
    return {"name": "나의 이름", "role": "student"}

# [2번 문제]
# GET 방식으로 "/square/{number}" 경로에 접속하면 number를 정수로
# 입력받아, 그 숫자의 제곱값을 {"number": number, "result": 제곱값}
# 형태로 반환하는 square 함수를 작성하세요.
@app.get("/square/{number}")
def square(number: int):
    return {"number": number, "result": number * number}

# [도전 문제]
# "/greet/{name}" 경로에서 쿼리 파라미터 age(정수, 기본값 20)를 받아
# "{name}님은 {age}살이시군요!" 메시지를 반환하는 함수를 작성하세요.
@app.get("/greet/{name}")
def greet(name: str, age: int = 20):
    return {"message": f"{name}님은 {age}살이시군요!"}

# [2번 문제]
# 위 [1번 문제] 함수보다 '먼저' "/courses/popular" 라는 고정 경로 함수를
# 추가해, {"title": "인기 강의 목록"} 을 반환하도록 만드세요.
# (고정 경로를 어느 위치에 작성해야 하는지 생각해보세요!)
@app.get("/courses/popular")
def courses_popular():
    return {"title": "인기 강의 목록"}
    

# [1번 문제]
# "/courses/{course_id}" 경로에 접속하면 course_id(정수)를 받아
# {"course_id": course_id, "title": "강의 정보"} 를 반환하는 함수를 작성하세요.
@app.get("/courses/{course_id}")
def courses(course_id: int):
    return {"course_id": course_id, "title": "강의 정보"}


# [도전 문제]
# "/students/{grade}/{number}/score" 경로에서 grade, number(둘 다 정수)를
# 받아 {"grade": grade, "number": number, "score": 90} 을 반환하세요.
@app.get("/students/{grade}/{number}/score")
def students(grade: str, number: int, score: int = 90):
    return {"grade": grade, "number": number, "score": score}


# [1번 문제]
# "/products/{product_id}" 경로에서 product_id(정수)와, 쿼리 파라미터로
# discount(정수, 기본값 0)를 받아 {"product_id": product_id, "discount": discount}
# 를 반환하는 함수를 작성하세요.
@app.get("/products/{product_id}")
def products(product_id: int, discount: int = 0):
    return {"product_id": product_id, "discount": discount}

# [2번 문제]
# 위 함수에 쿼리 파라미터 show_tax(불리언, 기본값 False)를 추가하고,
# show_tax가 True이면 반환 딕셔너리에 "tax_included": True를 추가로
# 넣어서 응답하도록 조건문으로 수정하세요.

@app.get("/products/{product_id}")
def products2(product_id: int, discount: int = 0, show_tax: bool = False):
    result = {"product_id": product_id, "discount": discount}
    if show_tax:
        result["tax_included"] = True
    return result
    
# [도전 문제]
# "/classes/{class_id}/students" 경로에서 class_id(정수)와 쿼리 파라미터
# keyword(문자열, 기본값 "")를 받아, keyword가 빈 문자열이 아니면 검색하는
# 상황을 가정한 메시지를 반환하는 함수를 작성하세요.

@app.get("/classes/{class_id}/students")
def classes_students(class_id: int, keyword: str = ""):
    if keyword:
        return {"message": f"{class_id}반에서 {keyword}를 검색했습니다."}
    else:
        return {"message": f"{class_id}반의 학생 목록을 반환합니다."}

# 여기에 코드를 작성해보세요




from pydantic import BaseModel
from typing import Optional

#임시 db 설정: 실제로는 DB에 저장하는 기능을 구현해야 함
members_db = []

# [1번 문제]
# name(문자열), age(정수), club(문자열), phone(문자열, 없을 수도 있음)을 갖는
# Member 라는 이름의 Pydantic 모델을 정의하세요. (phone은 Optional 사용)

class Member(BaseModel):
    name: str
    age: int
    club: str
    phone: Optional[str] = None
    #phone:str | None = None

# [2번 문제]
# POST 방식으로 "/members" 경로에 접속하면 Member 데이터를 받아
# members_db 리스트에 추가하고, {"message": "등록 완료", "data": 등록내용}
# 을 반환하는 함수를 작성하세요.

@app.post("/members")
def members(member: Member):
    members_db.append(member.model_dump()) #딕셔너리로 변환해서 추가
    return {"message": "등록 완료", "data": member}

# [도전 문제]
# GET 방식으로 "/members" 경로에 접속하면 {"count": 인원수, "members": 목록}
# 을 반환하는 함수를 작성하세요.

@app.get("/members")
def get_members():
    return {"count": len(members_db), "members": members_db}





from fastapi import HTTPException
class Product(BaseModel):
    name: str
    price: int
    in_stock: bool = True

products_db = {1: {"name": "노트북", "price": 1200000, "in_stock": True}}

# [1번 문제] GET "/products/{product_id}" : products_db에 해당 id가 없으면
# HTTPException(404, "상품을 찾을 수 없습니다.")를 발생시키고, 있으면 그 상품을 반환하세요.
@app.get("/products/{product_id}")
def products3(product_id: int):
    if product_id not in products_db:
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
    return products_db[product_id]

# [2번 문제] PUT "/products/{product_id}" : Product 데이터를 Body로 받아
# products_db[product_id]를 새 값으로 덮어쓰고 {"message": "수정 완료"} 를 반환하세요.

@app.put("/products/{product_id}")
def update_product(product: Product, product_id: int):
    if product_id not in products_db:
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
    products_db[product_id] = product.model_dump()
    return {"message": "수정 완료"}

# [도전 문제] DELETE "/products/{product_id}" : 없는 id면 404, 있으면 삭제 후
# {"message": "삭제 완료"} 를 반환하는 함수까지 작성해 CRUD를 완성하세요.


@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    if product_id not in products_db:
        raise HTTPException(status_code=404, detail="상품을 찾을 수 없습니다.")
    del products_db[product_id]
    return {"message": "삭제 완료"}



# 요청/응답을 처리하는 Controller 구현
# DB연결 -> Database:Table 연동 -> 실제 요청했을때 반영되도록 구현
# 상품관리하는 시스템: id, name, 수량, 가격 ...
# 👉 MariaDB(SQLAlchemy) 연동 완성 코드는 'db_main.py' 파일에 구현되어 있습니다.




