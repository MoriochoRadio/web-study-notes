"""
🚀 FastAPI + MariaDB(SQLAlchemy) RESTful CRUD 백엔드
- 데이터베이스: MariaDB (localhost:3306, test DB)
- ORM: SQLAlchemy
- 스키마 검증: Pydantic v2
- 드라이버: PyMySQL
"""

import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ==============================================================================
# 1. 🛠️ 데이터베이스 연결 설정 (MariaDB + SQLAlchemy ORM)
# ==============================================================================
# 강사님 요청서 기본값: root:YOUR_DB_PASSWORD
# 현재 PC 수업용 계정: study:YOUR_DB_PASSWORD (스프링부트 수업 때 사용하던 계정으로 'test' DB 접근 가능)
DATABASE_URL = "mysql+pymysql://study:YOUR_DB_PASSWORD@localhost:3306/test?charset=utf8mb4"
# DATABASE_URL = "mysql+pymysql://root:YOUR_DB_PASSWORD@localhost:3306/test?charset=utf8mb4"

# 1) SQLAlchemy 엔진 생성 (echo=True로 설정하면 콘솔에 실행되는 SQL 쿼리가 출력됨)
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)

# 2) DB 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3) ORM 모델 기본 클래스
Base = declarative_base()


# ==============================================================================
# 2. 🗄️ SQLAlchemy ORM 모델 정의 (Database Table)
# ==============================================================================
class Product(Base):
    """
    MariaDB 'products' 테이블과 매핑되는 ORM 모델
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, comment="고유 식별자")
    name = Column(String(100), nullable=False, comment="상품명")
    price = Column(Integer, nullable=False, comment="상품 가격")
    stock = Column(Integer, default=0, nullable=False, comment="상품 재고 수량")
    in_stock = Column(Boolean, default=True, nullable=False, comment="판매 가능 여부")


# 서버 구동 시 테이블이 없으면 자동 생성
Base.metadata.create_all(bind=engine)


# ==============================================================================
# 3. 📋 Pydantic 스키마 정의 (요청/응답 DTO 계층 분리)
# ==============================================================================
class ProductBase(BaseModel):
    name: str = Field(description="상품명", max_length=100, examples=["기계식 키보드"])
    price: int = Field(description="상품 가격", ge=0, examples=[89000])
    stock: int = Field(default=0, ge=0, description="상품 재고 수량", examples=[15])
    in_stock: bool = Field(default=True, description="판매 가능 여부", examples=[True])

class ProductCreate(ProductBase):
    """상품 등록(POST) 요청 시 사용하는 스키마"""
    pass

class ProductUpdate(BaseModel):
    """상품 수정(PUT) 요청 시 사용하는 스키마"""
    name: str = Field(description="수정할 상품명", max_length=100, examples=["무접점 기계식 키보드"])
    price: int = Field(description="수정할 상품 가격", ge=0, examples=[105000])
    stock: int = Field(default=0, ge=0, description="수정할 상품 재고 수량", examples=[20])
    in_stock: bool = Field(default=True, description="판매 가능 여부", examples=[True])

class ProductResponse(ProductBase):
    """클라이언트에 반환하는 상품 응답 스키마"""
    id: int = Field(description="고유 식별자", examples=[1])

    # SQLAlchemy ORM 객체를 Pydantic 모델로 자동 변환 지원 (Pydantic v2)
    model_config = ConfigDict(from_attributes=True)



# ==============================================================================
# 4. 🔄 DB 세션 라이프사이클 관리 (의존성 주입 Dependency Injection)
# ==============================================================================
def get_db():
    """
    각 API 요청마다 독립된 DB 세션을 생성하고,
    요청 처리가 끝나면 자동으로 세션을 닫아(close) 반납합니다.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================================================================
# 5. 🔌 필수 구현 API (CRUD Controller 엔드포인트)
# ==============================================================================
app = FastAPI(
    title="상품 관리 RESTful API",
    description="FastAPI + MariaDB(SQLAlchemy)를 연동한 상품 관리 CRUD 백엔드",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {
        "message": "FastAPI + MariaDB(SQLAlchemy) 상품 관리 API 서버가 실행 중입니다.",
        "docs_url": "http://127.0.0.1:8000/docs"
    }

# [1] 상품 등록 (POST /products)
@app.post(
    "/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="상품 등록",
    description="새로운 상품 정보를 데이터베이스에 등록합니다."
)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# [2] 상품 전체 목록 조회 (GET /products)
@app.get(
    "/products",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    summary="상품 전체 목록 조회",
    description="데이터베이스에 저장된 모든 상품 목록을 조회합니다."
)
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).order_by(Product.id.desc()).all()
    return products

# [3] 단건 상세 조회 (GET /products/{product_id})
@app.get(
    "/products/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    summary="상품 단건 상세 조회",
    description="특정 ID의 상품 상세 정보를 조회합니다. 없으면 404 에러를 반환합니다."
)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"상품 ID {product_id}번을 찾을 수 없습니다."
        )
    return db_product

# [4] 상품 정보 수정 (PUT /products/{product_id})
@app.put(
    "/products/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    summary="상품 정보 수정",
    description="특정 ID의 상품 정보를 수정합니다. 없으면 404 에러를 반환합니다."
)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"상품 ID {product_id}번을 찾을 수 없습니다."
        )

    # 필드 값 업데이트 (setattr을 사용하여 동적 매핑)
    for field, value in product_update.model_dump().items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)
    return db_product

# [5] 상품 삭제 (DELETE /products/{product_id})
@app.delete(
    "/products/{product_id}",
    status_code=status.HTTP_200_OK,
    summary="상품 삭제",
    description="특정 ID의 상품을 삭제합니다. 없으면 404 에러를 반환합니다."
)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"상품 ID {product_id}번을 찾을 수 없습니다."
        )

    db.delete(db_product)
    db.commit()
    return {"message": f"상품(ID: {product_id})이 성공적으로 삭제되었습니다."}


# ==============================================================================
# 6. 🚀 단독 실행 지원 (main:app 또는 db_main:app 자동 인식)
# ==============================================================================
if __name__ == "__main__":
    import uvicorn
    # 현재 파일명(db_main 등)을 자동으로 감지하여 uvicorn 실행
    module_name = os.path.splitext(os.path.basename(__file__))[0]
    uvicorn.run(f"{module_name}:app", host="127.0.0.1", port=8000, reload=True)
