"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { boardApi } from "../api/boardApi";
import './globals.css';

export default function BoardList() {
  const [list, setList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchBoardList();
  }, []);

  // 1. 서버에서 게시판 전체 목록을 불러와서 화면(state)에 세팅해 주는 함수
  //    (useEffect에 의해 화면이 처음 렌더링될 때 자동으로 실행됩니다)
  const fetchBoardList = async () => {
    try {
      const data = await boardApi.getList();
      setList(data.list); // API 모듈에서 파싱을 끝낸 객체 반환
    } catch (error) {
      console.error("Failed to fetch board list", error);
    }
  };

  // 2. 개별 체크박스를 클릭할 때마다 배열(checkedItems)에 글 번호(seq)를 넣거나 빼는 함수
  const handleCheckbox = (seq) => {
    if (checkedItems.includes(seq)) {
      setCheckedItems(checkedItems.filter((item) => item !== seq));
    } else {
      setCheckedItems([...checkedItems, seq]);
    }
  };

  // 3. [선택 삭제] 버튼을 눌렀을 때 체크된 항목들의 배열을 서버로 보내 일괄 삭제하는 함수
  const handleMultipleDelete = async () => {
    if (checkedItems.length === 0) return alert("삭제할 항목을 선택하세요.");
    if (!confirm("선택한 게시물을 삭제하시겠습니까?")) return;

    try {
      await boardApi.deleteMultiple(checkedItems.map(String));
      fetchBoardList();
      setCheckedItems([]);
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">게시판 목록</h1>
      
      <div className="board-wrapper">
        <table className="board-table">
          <thead>
            <tr>
              <th>선택</th>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.seq}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.seq)}
                    onChange={() => handleCheckbox(item.seq)}
                  />
                </td>
                <td>{item.seq}</td>
                <td className="board-title">
                  <Link href={`/detail/${item.seq}`}>{item.title}</Link>
                </td>
                <td>{item.id}</td>
                <td>{new Date(item.regdate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="button-group">
          <button className="btn btn-danger" onClick={handleMultipleDelete}>선택 삭제</button>
          <button className="btn btn-primary" onClick={() => router.push("/write")}>글쓰기</button>
        </div>
      </div>
    </div>
  );
}
