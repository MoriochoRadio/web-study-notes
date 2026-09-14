<%@page import="com.hk.board.dto.BuyDto"%>
<%@page import="com.hk.board.dao.BuyDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>구매 등록 처리</title>
</head>
<body>
<%
    request.setCharacterEncoding("UTF-8");

    // 1. 폼 파라미터 수신
    int num = Integer.parseInt(request.getParameter("num"));
    String userId = request.getParameter("userId");
    String prodName = request.getParameter("prodName");
    String groupName = request.getParameter("groupName");
    int price = Integer.parseInt(request.getParameter("price"));
    int amount = Integer.parseInt(request.getParameter("amount"));

    // 2. BuyDto 상자에 데이터 담기
    BuyDto dto = new BuyDto(num, userId, prodName, groupName, price, amount);

    // 3. BuyDao 호출하여 DB 저장 (기존 작성해둔 insertBuy 사용)
    BuyDao dao = new BuyDao();
    boolean isS = dao.insertBuy(dto);

    // 4. 결과 분기
    if (isS) {
        response.sendRedirect("buyList.jsp");
    } else {
        response.sendRedirect("error.jsp");
    }
%>
</body>
</html>