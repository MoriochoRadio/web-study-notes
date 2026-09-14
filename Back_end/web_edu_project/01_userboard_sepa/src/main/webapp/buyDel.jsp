<%@page import="com.hk.board.dao.BuyDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>구매 내역 삭제 처리</title>
</head>
<body>
<%
	// 1. buyList.jsp에서 링크나 스크립트로 넘겨준 "num" 파라미터를 받습니다.
	String sNum = request.getParameter("num");
	
	//숫자가 아니거나 값이 없으면 파싱에서 예외가 나므로 먼저 걸러낸다.
	if (sNum == null || !sNum.matches("\\d+")) {
		response.sendRedirect("error.jsp");
		return;
	}
	
	// 2. BuyDao의 deleteBuy(int num) 메서드 규격에 맞게 숫자로 변환(파싱)합니다.
	int num = Integer.parseInt(sNum);

	// 3. BuyDao 객체를 생성하고 삭제 메서드를 호출합니다.
	BuyDao dao = new BuyDao();
	boolean isS = dao.deleteBuy(num);
	
	// 4. 삭제 성공 여부에 따라 화면을 이동시킵니다.
	if (isS) {
		// 성공 시 구매 목록 페이지로 리다이렉트
		response.sendRedirect("buyList.jsp");
	} else {
		// 실패 시 에러 페이지로 이동
		response.sendRedirect("error.jsp");
	}
%>
</body>
</html>