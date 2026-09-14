<%@page import="com.hk.board.dto.BuyDto"%>
<%@page import="com.hk.board.dao.BuyDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>구매 정보 수정 처리</title>
</head>
<body>
<%
	request.setCharacterEncoding("UTF-8");

	// 1. 수정 폼에서 넘어온 3가지 파라미터 수신
	String sNum = request.getParameter("num");
	String sPrice = request.getParameter("price");
	String sAmount = request.getParameter("amount");

	// 2. 숫자(int)로 변환
	int num = Integer.parseInt(sNum);
	int price = Integer.parseInt(sPrice);
	int amount = Integer.parseInt(sAmount);

	// 3. DTO 상자에 담기
	BuyDto dto = new BuyDto();
	dto.setNum(num);
	dto.setPrice(price);
	dto.setAmount(amount);

	// 4. DB 수정 실행
	BuyDao dao = new BuyDao();
	boolean isS = dao.updateBuy(dto);

	// 5. 이동 처리
	if (isS) {
%>
		<script type="text/javascript">
			alert("구매 정보(가격/수량)가 수정되었습니다.");
			location.href = "buyDetail.jsp?num=<%=num%>";
		</script>
<%
	} else {
		response.sendRedirect("error.jsp");
	}
%>
</body>
</html>