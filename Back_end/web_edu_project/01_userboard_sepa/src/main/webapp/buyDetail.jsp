<%@page import="com.hk.board.dto.BuyDto"%>
<%@page import="com.hk.board.dao.BuyDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>구매상세정보</title>
</head>
<%
	// 1. 목록 화면에서 넘겨준 구매 고유번호(num) 수신
	String sNum = request.getParameter("num");
	
	//num이 아예 없거나 숫자가 아니면 Integer.parseInt에서 NumberFormatException이 난다.
	//주소를 직접 치거나 링크가 잘못된 경우이므로 파싱하기 전에 먼저 걸러낸다.
	if (sNum == null || !sNum.matches("\\d+")) {
		response.sendRedirect("error.jsp");
		return;
	}
	int num = Integer.parseInt(sNum);

	// 2. BuyDao를 통해 해당 구매 건 1개 조회
	BuyDao dao = new BuyDao();
	BuyDto dto = dao.getBuy(num);
	
	//없는 구매번호면 dto가 null이다. 확인하지 않으면 아래에서 NullPointerException.
	if (dto == null) {
		response.sendRedirect("error.jsp");
		return;
	}
%>
<body>
<h1>구매상세정보</h1>
<form action="buyUpdate.jsp" method="post">
	<!-- 수정 대상 식별 번호 (hidden) -->
	<input type="hidden" name="num" value="<%=dto.getNum()%>"/>

	<table border="1">
		<tr>
			<th>구매번호</th>
			<td><%=dto.getNum()%></td>
		</tr>
		<tr>
			<th>아이디</th>
			<td><%=dto.getUserId()%></td>
		</tr>
		<tr>
			<th>상품명</th>
			<td><%=dto.getProudName()%></td>
		</tr>
		<tr>
			<th>그룹이름</th>
			
			<td><%=dto.getGroupName()%></td>
		</tr>
		<tr>
			<th>가격</th>
			<td><input type="text" name="price" value="<%=dto.getPrice()%>"/></td>
		</tr>
		<tr>
			<th>수량</th>
			<td><input type="text" name="amount" value="<%=dto.getAmount()%>"/></td>
		</tr>
		<tr>
			<td colspan="2">
				<input type="submit" value="수정완료"/>
				<input type="button" value="목록" onclick="location.href='buyList.jsp'"/>
				<input type="button" value="메인" onclick="main()"/>
			</td>
		</tr>
	</table>
</form>

<script type="text/javascript">
	function main(){
		location.href = "index.jsp";
	}
</script>
</body>
</html>