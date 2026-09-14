<%@page import="com.hk.board.dto.BuyDto"%>
<%@page import="java.util.List"%>
<%@page import="com.hk.board.dao.BuyDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>구매 리스트</title>
</head>
<%
	BuyDao dao = new BuyDao();
	// 1. 소괄호 오타 수정: dao.getAllBuy();
	List<BuyDto> list = dao.getAllBuy();
%>
<body>
<h1>구매 조회 결과</h1>
<table border="1">
	<!-- 2. 헤더 줄 닫기(</tr>) 추가 -->
	<tr>
		<th>번호</th><th>아이디</th><th>상품명</th><th>그룹이름</th><th>삭제</th>
	</tr>
	<%
		for (BuyDto dto : list) {
	%>
			<tr>
				<td><%=dto.getNum()%></td>
				<td><%=dto.getUserId()%></td>
				<!-- 3. 상세조회 링크: buyDetail.jsp?num=... 으로 변경 -->
				<td><a href="buyDetail.jsp?num=<%=dto.getNum()%>"><%=dto.getProudName()%></a></td>
				<td><%=dto.getGroupName()%></td>
				<!-- 4. 삭제 대상 식별자를 num으로 변경 -->
				<td><a href="#" onClick="delBuy('<%=dto.getNum()%>')">삭제</a></td>
			</tr>
	<%
		}
	%>
	<tr>
		<td colspan="5" align="center">
			<a href="index.jsp">메인화면</a>
		</td>
	</tr>
</table>

<script type="text/javascript">
	// 5. 삭제 대상 식별자를 num으로 받고 파라미터명도 ?num= 으로 통일
	function delBuy(num) {
		if (confirm("정말 이 구매 내역을 삭제하겠습니까?")) {
			location.href = "buyDel.jsp?num=" + num;
		}
	}
</script>
</body>
</html>