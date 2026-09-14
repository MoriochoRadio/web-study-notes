<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>고객관리 첫페이지</title>
</head>
<body>
<h1>고객관리시스템</h1>
<p><a href="userList.jsp">(1)회원 조회(조회 후 수정/삭제 가능)</a></p>
<p><a href="userInsertFrom.jsp">(2)신규회원등록</a></p>
<h1>구매목록관리</h1>
<p><a href="buyList.jsp">구매목록조회</a></p>
<!-- 구매목록 내용: num, userId, proudName, groupName, price, amount -->
<!--  목록 상세 조회: userId, proudName, groupName, price, amount -->
<!--  목록 내용 수정: price, amount -->
<!--  목록 삭제  -->
<p><a href="buyInsertForm.jsp">구매상품등록</a></p>
</body>
</html>	

