<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="jakarta.tags.core" prefix="c" %>
<%@taglib uri="jakarta.tags.fmt" prefix="fmt" %>
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
	// 글쓰기 폼 요청: controller를 통해 처리
	function boardInsertForm(){
		location.href="boardInsertForm.board";
	}
	
	//전체 선택 체크박스 기능
	function allSel(bool){
		// 체크박스 요소들을 구한다(배열형태)
		const chkObj=document.getElementsByName("seq");//[chk,chk...]
		for(let i=0;i<chkObj.length;i++){
			// 체크박스 요소에 속성 checked에 true/false 대입하면 체크설정 또는 해제
			chkObj[i].checked=bool;
		}
	}
	
	//삭제 체크박스 유효값 처리
	function isAllCheck(){
		const chks=document.querySelectorAll("input[name=seq]:checked");
		console.log(chks.length);
		if(chks.length==0){//체크 개수가 0
			document.querySelector("#msg").textContent="하나이상 체크하세요";
			return false;// submit이벤트를 취소하기 위해 false 반환
		}else{
			if(confirm("정말 삭제하겠습니까?")){
				return true;//submit O
			}else{
				document.querySelector("#msg").textContent="";
				return false;//submit X
			}
		}
	}
</script>
</head>
<body>
<h1>게시판</h1>
<h2>글목록</h2>
<form action="muldel.board" method="post" onsubmit="return isAllCheck()">
<!-- <input type="hidden" name="command" value="muldel"/> -->
	<table border="1" id="boardList">
		<tr>
			<th><input type="checkbox" name="all" onclick="allSel(this.checked)"/></th>
			<th>번호</th>
			<th>작성자</th>
			<th>제목</th>
			<th>작성일</th>
		</tr>
		<c:choose>
			<c:when test="${empty list}">
				<tr>
					<td style="text-align: center;"
					 colspan="5">--작성된 글이 없습니다.--</td>
				</tr>
			</c:when>
			<c:otherwise>
				<c:forEach items="${list}" var="dto">
					<tr>
						<td><input type="checkbox" name="seq" 
						                           value="${dto.seq}" /></td>
						<td>${dto.seq}</td>
						<td>${dto.id}</td>
						<td>
							<a href="boardDetail.board?seq=${dto.seq}">
						    ${dto.title}
						    </a>
						</td>
						<td>${dto.regDate}</td>
					</tr>
				</c:forEach>
			</c:otherwise>
		</c:choose>

		<tr>
			<td colspan="5">
				<button type="button" onclick="boardInsertForm()">글추가</button>
				<button type="submit">글삭제</button>
				<span id="msg" style="color:red;"></span>
			</td>
		</tr>
	</table>
</form>
</body>
</html>










