<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>구매 상품 등록</title>
</head>
<body>
<h1>구매 상품 등록</h1>
<form action="buyInsert.jsp" method="post">
    <table border="1">
        <tr>
            <th>구매번호</th>
            <td><input type="text" name="num" placeholder="숫자 입력"/></td>
        </tr>
        <tr>
            <th>회원아이디</th>
            <td><input type="text" name="userId" placeholder="usertbl에 존재하는 ID"/></td>
        </tr>
        <tr>
            <th>상품명</th>
            <td><input type="text" name="prodName"/></td>
        </tr>
        <tr>
            <th>그룹이름</th>
            <td><input type="text" name="groupName" placeholder="예: 전자, 의류 등"/></td>
        </tr>
        <tr>
            <th>가격</th>
            <td><input type="text" name="price"/></td>
        </tr>
        <tr>
            <th>수량</th>
            <td><input type="text" name="amount"/></td>
        </tr>
        <tr>
            <td colspan="2">
                <input type="submit" value="상품등록"/>
                <input type="button" value="목록으로" onclick="location.href='buyList.jsp'"/>
            </td>
        </tr>
    </table>
</form>
</body>
</html>