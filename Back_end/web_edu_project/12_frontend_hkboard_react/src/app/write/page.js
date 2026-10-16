"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { boardApi } from "../../api/boardApi";
import '../globals.css';

export default function WriteBoard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: ""
  });

  // 1. 사용자가 입력칸(input)에 글자를 칠 때마다 formData(상태)를 실시간으로 업데이트하는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. [등록하기] 버튼을 눌렀을 때 폼 전송을 막고 API를 통해 서버에 데이터를 보내는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.title || !formData.content) {
      return alert("모든 항목을 입력해주세요.");
    }

    try {
      await boardApi.insert(formData);
      alert("글이 성공적으로 등록되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Failed to insert board", error);
      alert("글 등록에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">새 글 쓰기</h1>
      <div className="board-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">작성자 ID</label>
            <input
              type="text"
              name="id"
              className="form-control"
              placeholder="아이디를 입력하세요"
              value={formData.id}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">제목</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="제목을 입력하세요"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">내용</label>
            <textarea
              name="content"
              className="form-control"
              placeholder="내용을 입력하세요"
              value={formData.content}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button type="button" className="btn btn-secondary" onClick={() => router.push("/")}>취소</button>
            <button type="submit" className="btn btn-primary">등록하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}
