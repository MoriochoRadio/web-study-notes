<%@page import="com.hk.board.dto.userDto"%>
<%@page import="com.hk.board.dao.UserDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>회원 정보 수정 처리</title>
</head>
<body>
<%
	// =========================================================================
	// [ 1. 한글 인코딩 처리 (POST 방식 필수) ]
	// =========================================================================
	// form 태그가 method="post"로 전송되었을 때, 주소(addr) 같은 한글이 깨지지 않도록 UTF-8로 맞춰줍니다.
	request.setCharacterEncoding("UTF-8");

	// =========================================================================
	// [ 2. 폼에서 넘어온 파라미터 꺼내기 ]
	// =========================================================================
	// 브라우저에서 넘어오는 모든 입력값은 숫자든 문자든 일단 무조건 'String(문자열)' 타입으로 들어옵니다.
	String userId = request.getParameter("userid");
	String addr = request.getParameter("addr");
	String mobile1 = request.getParameter("mobile1");
	String mobile2 = request.getParameter("mobile2");
	String sHeight = request.getParameter("height"); // 문자로 넘어온 키 (예: "178")
	
	// [중요 타입 변환: String -> int]
	// userDto의 height는 숫자(int) 타입인데, request로 받은 것은 String이므로 변환(파싱)하지 않으면 에러가 납니다!
	int height = Integer.parseInt(sHeight);
	
	// =========================================================================
	// [ 3. DTO 상자 포장 & DAO에 DB 업데이트 요청 ]
	// =========================================================================
	// 1) DB 작업 전담 창구(UserDao) 객체 생성
	UserDao dao = new UserDao();
	
	// 2) 수정한 5가지 정보를 5개짜리 생성자를 이용해 DTO 상자에 한 번에 담습니다.
	
	// 3) DAO의 updateUser 메서드에 상자를 넘겨 DB를 갱신합니다.
	// - 수정 성공 시: isS = true
	// - 수정 실패 시: isS = false
	boolean isS = dao.updateUser(new userDto(userId, addr, mobile1, mobile2, height));

	if (isS) {
// 		response.sendRedirect("index.jsp");

//javascript 코드도 작성 가능함 -> html과 java를 같이 사용할 수 있기 때문에
		%>
		<script type="text/javascript">
			alert("회원정보를 수정했습니다.!!");
// 			location.href="index.jsp";
			location.href="userDetail.jsp?userid=<%=userId%>";
// 그냥 <나눗셈기호 는 자바 코드를 조용히 실행만 하는 영역이고, <나눗셈기호=가붙은거는 자바 변수나 연산 결과를 화면에 직접 출력하는 영역입니다
		</script>
		<%
	} else{
		response.sendRedirect("error.jsp");
	}
%>


</body>
</html>