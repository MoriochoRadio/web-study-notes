<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>글 추가하기</title>
</head>
<body>
<h1>글 추가하기</h1>
<form action="boardController.jsp" method="post">
	<input type="hidden" name="command" value="boardInsert"/>
	<table border="1">
		<tr>
			<th>작성자(ID)</th>
			<td><input type="text" name="id" required="required" /></td>
		</tr>
		<tr>
			<th>글제목</th>
			<td><input type="text" name="title" required="required" /></td>
		</tr>
		<tr>
			<th>글내용</th>
			<td><textarea rows="10" cols="60"></textarea></td>
		</tr>
	</table>
</form>
</body>
</html>
