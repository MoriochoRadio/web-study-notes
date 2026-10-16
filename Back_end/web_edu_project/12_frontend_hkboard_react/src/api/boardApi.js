const BASE_URL = 'http://localhost:8085/api/boards';

// fetch 에러 처리를 도와주고 JSON 파싱을 자동으로 해주는 유틸리티 함수 (Axios 대체용)
const fetchWrapper = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // 상태 코드가 200~299가 아닐 경우 명시적으로 에러를 던짐 (Axios처럼 동작하게 만들기 위함)
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'API 요청에 실패했습니다.');
  }

  return response.json();
};

// 게시판과 관련된 모든 통신(API)을 한 곳에서 모듈화하여 관리
export const boardApi = {
  // 1. 전체 목록 조회
  getList: () => fetchWrapper(BASE_URL),
  
  // 2. 단일 조회
  getDetail: (seq) => fetchWrapper(`${BASE_URL}/${seq}`),
  
  // 3. 글 추가
  insert: (data) => fetchWrapper(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // 4. 글 수정
  update: (seq, data) => fetchWrapper(`${BASE_URL}/${seq}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // 5. 글 삭제
  deleteMultiple: (chkArray) => fetchWrapper(BASE_URL, {
    method: 'DELETE',
    body: JSON.stringify(chkArray)
  })
};
