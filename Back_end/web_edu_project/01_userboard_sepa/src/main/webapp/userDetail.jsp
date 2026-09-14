<%@page import="com.hk.board.dto.userDto"%>
<%@page import="com.hk.board.dao.UserDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>회원상세정보</title>
<style type="text/css">
	input[type=button]{
		background-color: red;
		color:white;
		font-weight: bold;
	}
</style>
</head>
<%
	//request(httpServletRequest): 요청정보를 담고 있다.
	//userList 에서 이름을 클릭하면 해당 userid 값이 전송되고
	// -> 그 값을 request로 받을 수 있다.
	String userId = request.getParameter("userid");
	UserDao dao = new UserDao();
	userDto dto = dao.getUser(userId); //회원한명에 대한 정보 저장
	
	//getUser는 못 찾으면 null을 돌려준다. 그대로 두면 아래에서 값을 꺼낼 때
	//NullPointerException이 나면서 자바 에러 화면(HTTP 500)이 그대로 보인다.
	//목록에서 지운 회원의 상세 주소를 뒤로가기로 다시 여는 경우가 여기에 해당한다.
	if (dto == null) {
		response.sendRedirect("error.jsp");
		return; //sendRedirect는 아래 코드를 멈추지 않으므로 return이 꼭 필요하다
	}
%>
<body>
<h1>회원상세정보</h1>
<form action="userUpdate.jsp" method="post">
	<input type="hidden" name="userid" value="<%=dto.getUserId()%>"/>
	<table border="1">
		<tr>
			<th>아이디</th>
			<td><%=dto.getUserId() %></td>
		</tr>
		<tr>
			<th>이름</th>
			<td><%=dto.getName() %></td>
		</tr>
		<tr>
			<th>출생연도</th>
			<td><%=dto.getBirthYear() %></td>
		</tr>
		<tr>
			<th>지역</th>
			<td><input type="text" name ="addr" value="<%=dto.getAddr() %>"/></td>
		</tr>
		<tr>
			<th>휴대폰국번</th>
			<td><input type="text" name ="mobile1" value="<%=dto.getMobile1() %>"/></td>
		</tr>
		<tr>
			<th>휴대폰번호</th>
			<td><input type="text" name ="mobile2" value="<%=dto.getMobile2() %>"/></td>
		</tr>
		<tr>
			<th>신장</th>
			<td><input type="text" name ="height" value="<%=dto.getHeight() %>"/></td>
		</tr>
		<tr>
			<td colspan="2">
				<input type="submit" value="회원수정"/>
				<input type="button" value="메인"
										onClick = "main()"/>
			</td>
		</tr>
	</table>
</form>
<script type="text/javascript">
	function main(){
		location.href="index.jsp";
	}
</script>
</body>
</html>