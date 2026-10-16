"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { boardApi } from "../../../api/boardApi";
import '../../globals.css';

function BoardDetailContent() {
  const router = useRouter();
  const params = useParams(); // Client Component에서는 useParams()를 쓰는 것이 안전합니다.
  const seq = params?.seq;

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    regDate: ""
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (seq) {
      fetchBoardDetail();
    }
  }, [seq]);

  // 1. 화면이 처음 켜질 때 해당 글 번호(seq)의 상세 데이터를 서버에서 가져오는 함수
  const fetchBoardDetail = async () => {
    try {
      const data = await boardApi.getDetail(seq);
      setFormData(data.dto); // API 모듈에서 파싱을 끝낸 객체 반환
    } catch (error) {
      console.error("Failed to fetch board detail", error);
      alert("데이터를 불러오는데 실패했습니다.");
    }
  };

  // 2. 수정 모드일 때 사용자가 입력칸에 글자를 치면 formData(상태)를 실시간 업데이트하는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. [수정완료] 버튼을 눌렀을 때 변경된 formData를 서버에 보내서 덮어쓰기(PUT) 하는 함수
  const handleUpdate = async () => {
    try {
      await boardApi.update(seq, formData);
      alert("글이 성공적으로 수정되었습니다.");
      setIsEditMode(false);
      fetchBoardDetail();
    } catch (error) {
      console.error("Failed to update board", error);
      alert("글 수정에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">{isEditMode ? "글 수정하기" : "글 상세보기"}</h1>
      <div className="board-wrapper">
        <div className="form-group">
          <label className="form-label">작성자 ID</label>
          <input
            type="text"
            className="form-control readonly-text"
            value={formData.id || ""}
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">제목</label>
          <input
            type="text"
            name="title"
            className={`form-control ${!isEditMode ? 'readonly-text' : ''}`}
            value={formData.title || ""}
            onChange={handleChange}
            readOnly={!isEditMode}
          />
        </div>

        <div className="form-group">
          <label className="form-label">내용</label>
          <textarea
            name="content"
            className={`form-control ${!isEditMode ? 'readonly-text' : ''}`}
            value={formData.content || ""}
            onChange={handleChange}
            readOnly={!isEditMode}
          />
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={() => router.push("/")}>목록으로</button>
          
          {isEditMode ? (
            <>
              <button type="button" className="btn btn-danger" onClick={() => { setIsEditMode(false); fetchBoardDetail(); }}>취소</button>
              <button type="button" className="btn btn-primary" onClick={handleUpdate}>수정완료</button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setIsEditMode(true)}>수정하기</button>
          )}
        </div>
      </div>
    </div>
  );
}

// Next.js 15+ 에러를 방지하기 위해 전체 컴포넌트를 Suspense로 감싸줍니다.
export default function BoardDetail() {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <BoardDetailContent />
    </Suspense>
  );
}
