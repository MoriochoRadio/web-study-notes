<jsp:include page="header.jsp"/>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>boardInsertForm.jsp</title>
</head>
<body>
<div id="container">
<h1>글 추가하기</h1>
<form action="boardInsert.do" method="post">
	<table class="table table-striped" border="1">
		<tr>
			<th>작성자(ID)</th>
			<td><input class="form-control" type="text" name="id" required="required"/></td>
		</tr>
		<tr>
			<th>글제목</th>
			<td><input class="form-control" type="text" name="title" required="required"/></td>
		</tr>
		<tr>
			<th>글내용</th>
			<td>
				<textarea class="form-control" rows="10" cols="60" name="content" 
				                          required="required"></textarea>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				<input class="btn btn-primary" type="submit" value="글등록"/>
				<input class="btn btn-primary" type="button" value="글목록" 
			        onclick="location.href='boardList.do?pnum=${pnum}'"/>
			</td>
		</tr>
	</table>
</form>
</div>
<jsp:include page="footer.jsp"/>

</body>
</html>