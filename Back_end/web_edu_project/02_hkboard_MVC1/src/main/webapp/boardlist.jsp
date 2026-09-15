<%@page import="com.hk.board.dto.HkDto"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<%
	//boardController.jsp 에서 전달된 scope객체로 부터 list객체를 가져온다.
	List<HkDto>list = (List<HkDto>)request.getAttribute("list"); //저장된 객체의 타입은 Object임
%>
<body>
<h1>게시판</h1>
<h2>글목록</h2>
<table border="1">
	<tr>
		<th><input type="checkbox" name="all" /></th>
		<th>번호</th>
		<th>작성자</th>
		<th>제목</th>
		<th>작성일</th>
	</tr>
	<%
		for(HkDto dto:list){
			%>
				<tr>
					<td><input type="checkbox" name="seq" value="<%=dto.getSeq()%>" /></td>
					<td><%=dto.getSeq()%></td>
					<td><%=dto.getId()%></td>
					<td><%=dto.getTitle()%></td>
					<td><%=dto.getRegDate()%></td>
				</tr>
			<%
		}
	%>	
	<tr>
		<td colspan="5">
			<button type="button">글추가</button>
			<button type="submit">글삭제</button>
		</td>
	</tr>
</table>
</body>
</html>