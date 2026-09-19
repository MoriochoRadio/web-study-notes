<%@page import="com.hk.board.dto.HkDto"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<%
	// requestScope에서 HkDto객체 가져오기
	HkDto dto =(HkDto)request.getAttribute("dto");
%>
<body>
	<h1>글 상세보기</h1>
	<form action="boardController.jsp" method="post">
		<input type="hidden" name="command" value="boardUpdate"/>
		<input type="hidden" name="seq" value="<%=dto.getSeq()%>" />
		<table border="1">
			<tr>
				<th>작성자(ID)</th>
				<td><%=dto.getId()%></td>
			</tr>
			<tr>
				<th>글제목</th>
				<td><input type="text" name="title" value="<%=dto.getTitle()%>"
					required="required" /></td>
			</tr>
			<tr>
				<th>글내용</th>
				<td><textarea rows="10" cols="60" name="content"
						required="required"><%=dto.getContent()%></textarea></td>
			</tr>
			<tr>
				<td colspan="2">
				<input type="submit" value="글수정" />

				<input type="button" value="글삭제"
				       onclick="boardDelete(<%=dto.getSeq()%>)"/>

				<input type="button" value="글목록"
					onclick="location.href='boardController.jsp?command=boardlist'" />
				</td>
			</tr>
		</table>
	</form>
	<script type="text/javascript">
		function boardDelete(seq){
			if(confirm("정말 삭제하겠습니까?")){
				location.href='boardController.jsp?'
						     +'command=boardDelete&seq='+seq;
			}
		}
	</script>
</body>
</html>
