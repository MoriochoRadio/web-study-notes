
<%@page import="com.hk.board.dao.UserDao"%>
<%@page import="com.hk.board.dto.userDto"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>고객 리스트</title>
</head>

<% //JSP 구성요소중 jsp tag: scriptlet(실행부) 
	UserDao dao = new UserDao();
	List<userDto> list = dao.getAllUser();
%>
<body>
<h1>고객 조회 결과</h1>
<table border = "1">
	<tr>
		<th>아이디</th><th>이름</th><th>가입일</th><th>삭제</th>
	</tr>
		<%
			for(userDto dto:list){
				%>
				<tr>
					<td><%=dto.getUserId()%></td>
					<td><a href="userDetail.jsp?userid=<%=dto.getUserId()%>"><%=dto.getName()%></a></td>
					<td><%=dto.getmDate()%></td>
					<td><a href="#" onClick="delUser('<%=dto.getUserId()%>')">삭제</a></td>
				</tr>
				<%
			}
		%>
	<tr>
		<td colspan="5">
		<a href="index.jsp">메인화면</a>
		</td>
	</tr>
</table>
<script type="text/javascript">
	function delUser(userId) {
		if(confirm("정말 삭제하겠습니까?")){
			location.href="userDel.jsp?userid="+userId;
		}
	}
</script>

</body>
</html>