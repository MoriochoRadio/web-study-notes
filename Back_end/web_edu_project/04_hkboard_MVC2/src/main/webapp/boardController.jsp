<%@page import="com.hk.board.dto.HkDto"%>
<%@page import="java.util.List"%>
<%@page import="com.hk.board.dao.HkDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<%
	//1단계:command값 받기 -> 어떤 요청인지 확인하기 위한 값을 받는다
	String command=request.getParameter("command");

	//2단계: DAO 객체 생성
	HkDao dao=new HkDao();

	//3단계: 요청분기(요청확인하기)
	if(command.equalsIgnoreCase("boardlist")){//글목록요청확인
		//4단계: 파라미터 받기 생략
		//5단계:dao메서드 실행
		List<HkDto>list=dao.getAllList();
		//6단계:Scope객체에 담기
		request.setAttribute("list", list);
// 		response.sendRedirect("boardlist.jsp");// 객체 전달 못함 (X)
		//7단계: 페이지 이동
		pageContext.forward("boardlist.jsp");
	}else if(command.equalsIgnoreCase("boardInsertForm")){//글쓰기폼 이동
		//글쓰기 폼으로 이동 요청
		response.sendRedirect("boardInsertForm.jsp");
	}else if(command.equalsIgnoreCase("boardInsert")){// 글추가하기
		//글추가 요청
		//파라미터 받기: id, title, content
		String id = request.getParameter("id");
		String title = request.getParameter("title");
		String content = request.getParameter("content");

		boolean isS= dao.insertBoard(new HkDto(id, title, content));
		if(isS){
			//그냥 boardlist.jsp 페이지로 가면 안된고,
			//반드시 컨트롤러를 거쳐서 가야 한다. --> list객체가 필요하기때문
			response.sendRedirect("boardController.jsp?command=boardlist");
		}else{
			response.sendRedirect("error.jsp");
		}
	}else if(command.equalsIgnoreCase("boardDetail")){
		//seq 파라미터 받기
		String pseq=request.getParameter("seq");
		int seq=Integer.parseInt(pseq);// String -> int 형변환

		HkDto dto = dao.getBoard(seq);

		//dto객체를 저장하고 이동해야 전달됨
		request.setAttribute("dto", dto);
		pageContext.forward("boardDetail.jsp");
	}else if(command.equalsIgnoreCase("boardUpdate")){
		//파라미터 받기: seq, title, content
		String pseq=request.getParameter("seq");
		int seq=Integer.parseInt(pseq);// String -> int 형변환
		String title = request.getParameter("title");
		String content = request.getParameter("content");

		boolean isS=dao.updateBoard(new HkDto(seq,title,content));

		if(isS){
		%>
		<script type="text/javascript">
 			alert("수정성공");
 			location.href
 			="boardController.jsp?command=boardDetail&seq=<%=seq%>";
 		</script>
		<%
// 		out.println(
// 				"<script type='text/javascript'>"
// 				+" alert('수정성공'); "
// 				+" location.href "
// 		+" ='boardController.jsp?command=boardDetail&seq="+seq+"';"
// 				+" </script> "
// 				);
		}else{
			response.sendRedirect("error.jsp");
		}
	}else if(command.equalsIgnoreCase("boardDelete")){//글삭제하기
		//파라미터 받기: seq
		String pseq=request.getParameter("seq");
		int seq=Integer.parseInt(pseq);// String -> int 형변환

		boolean isS=dao.deleteBoard(new HkDto(seq,null,null));

		if(isS){
			response
			.sendRedirect("boardController.jsp?command=boardlist");
		}else{
			response.sendRedirect("error.jsp");
		}
	}else if(command.equalsIgnoreCase("muldel")){//여러글 삭제
		//파라미터 받기:   대략 이런 형태라고 생각해보기 {seq: [1,32,4,5,6,7]}
		// -> 파라미터가 같은 이름으로 여러개의 값을 전송할 경우
		String[] seqs = request.getParameterValues("seq");

		boolean isS=dao.mulDel(seqs);
		if(isS){
			response.sendRedirect("boardController.jsp?command=boardlist");
		}else{
			response.sendRedirect("error.jsp");
		}
	}


%>
</body>
</html>
