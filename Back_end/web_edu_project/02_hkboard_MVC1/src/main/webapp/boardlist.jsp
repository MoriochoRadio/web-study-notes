<%@page import="com.hk.board.dto.HkDto"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<style type="text/css">
	#boardList{
		width:800px;
		border-collapse: collapse;
	}
</style>
<script type="text/javascript">
	//글쓰기 폼 요청: controller를 통해 처리
	function boardInsertForm(){
		location.href="boardController.jsp?command=boardInsertForm";
	}

	//전체 선택 체크박스 기능
	function allSel(bool) {
		// 체크박스 요소들을 구한다(배열형태)
		const chkObj=document.getElementsByName("seq");//[chk,chk...]
		for(let i=0;i<chkObj.length;i++){
			chkObj[i].checked=bool; //체크박스 요소에 속성 checked에 true/false 대입하면 체크설정 또는 해제
		}
	}
</script>
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
		<th><input type="checkbox" name="all" onclick="allSel(this.checked)"/></th>
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
					<td><a href="boardController.jsp?command=boardDetail&seq=<%=dto.getSeq()%>">
					<%=dto.getTitle()%>
						</a>
					</td>
					<td><%=dto.getRegDate()%></td>
				</tr>
			<%
		}
	%>
	<tr>
		<td colspan="5">
			<button type="button" onclick="boardInsertForm()">글추가</button>
			<button type="submit">글삭제</button>
		</td>
	</tr>
</table>
</body>
</html>
