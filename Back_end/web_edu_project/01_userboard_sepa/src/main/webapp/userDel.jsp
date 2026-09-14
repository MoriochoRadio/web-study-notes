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
	String userId=request.getParameter("userid");

	//데이터베이스에 접근해야 되니까
	UserDao dao = new UserDao();
	boolean isS = dao.deleteUser(userId);
	
	if(isS){
		response.sendRedirect("userList.jsp");
	}else{
		response.sendRedirect("error.jsp");
	}
%>
</body>
</html>