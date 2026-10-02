<jsp:include page="header.jsp"/>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<div id="container">
	<h1>글 상세보기</h1>
	<form action="boardUpdate.do" method="post">
		<input type="hidden" name="seq" value="${requestScope.dto.seq}" />
		<input type="hidden" name="pnum" value="${pnum}" />
		<table class="table table-striped" border="1">
			<tr>
				<th>작성자(ID)</th>
				<td>${requestScope.dto.id}</td>
			</tr>
			<tr>
				<th>글제목</th>
				<td><input class="form-control" type="text" name="title" value="${requestScope.dto.title}"
					required="required" /></td>
			</tr>
			<tr>
				<th>글내용</th>
				<td><textarea class="form-control" rows="10" cols="60" name="content"
						required="required">${requestScope.dto.content}</textarea></td>
			</tr>
			<tr>
				<td colspan="2">
				<input class="btn btn-primary" type="submit"  value="글수정" />				
				<input class="btn btn-primary" type="button" value="글삭제"
				       onclick="boardDelete(${requestScope.dto.seq})"/>
				        
				<input class="btn btn-primary" type="button" value="글목록"
					onclick="location.href='boardList.do?pnum=${pnum}'" />
				</td>
			</tr>
		</table>
	</form>
	<form id="deleteForm" action="mulDel.do" method="post">
		<input type="hidden" id="deleteSeq" name="seq" value=""/>
		<input type="hidden" name="pnum" value="${pnum}"/>
	</form>
	
	<div id="replyForm">
		<h1>답글 작성하기</h1>
		<form action="boardReply.do" method="post">
			<!-- 부모글에 seq를 전달한다. -->
			<input type="hidden" name="seq" value="${dto.seq}"/>
			<input type="hidden" name="pnum" value="${pnum}"/>
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
						<input class="btn btn-primary" type="submit" value="답글등록"/>
						<input class="btn btn-primary" type="button" value="글목록" 
					        onclick="location.href='boardList.do?pnum=${pnum}'"/>
					</td>
				</tr>
			</table>
		</form>
	</div>
</div>	
	<script type="text/javascript">
		function boardDelete(seq){
			if(confirm("정말 삭제하겠습니까?")){
// 				location.href='mulDel.do?seq='+seq;
				document.getElementById("deleteSeq").value=seq;
				//js에서 submit 하기
				document.getElementById("deleteForm").submit();
			}
		}
	</script>
<jsp:include page="footer.jsp"/>
</body>
</html>