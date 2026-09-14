<%@page import="com.hk.board.dto.userDto"%>
<%@page import="com.hk.board.dao.UserDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<%
	//파라미터 받기
	String userId = request.getParameter("userid");
	String name = request.getParameter("name");
	String addr = request.getParameter("addr");
	String pbirthyear = request.getParameter("birthyear");
	String mobile1 = request.getParameter("mobile1");
	String mobile2 = request.getParameter("mobile2");
	String sHeight = request.getParameter("height");
	int height = Integer.parseInt(sHeight);
	int birthyear = Integer.parseInt(pbirthyear);
	
	UserDao dao = new UserDao();
	
	boolean isS = dao.insertUser(new userDto(userId, name, birthyear, addr, mobile1, mobile2, height, null));
	
	if (isS) {
		%>
		<script type="text/javascript">
			alert("회원 추가함.!!");
 			location.href="userList.jsp";
		</script>
		<%
	} else{
		response.sendRedirect("error.jsp");
	}
%>
</body>
</html>