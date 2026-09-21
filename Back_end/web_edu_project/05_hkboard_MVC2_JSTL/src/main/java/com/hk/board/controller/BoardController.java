package com.hk.board.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import com.hk.board.dao.HkDao;
import com.hk.board.dto.HkDto;
// 서블릿이 뭐야?? --> java파일 --> 클라이언트로부터 요청과 응답을 처리하는 라이프사이클이 있는 자바 객체
//DAO클래스 --> JDBC 6단계가 구현되어 있는 DB에 접근해서 처리하는 객체
@WebServlet("*.board")
public class BoardController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		//요청 주소를 통해 요청내용을 확인하기
		// 그 전에는 command값을 통해 요청을 구별
		// 클라이언트에서 boardlist.board 요청 --> "boardlist.board"
		// 요청 주소를 구해야함 --> request.getRequestURI()
		// command.equals("boardlist.board") 비교하는건 동일
		String requestURI=request.getRequestURI();
		String contextPath=request.getContextPath();
		String pathInfo=request.getPathInfo();
		System.out.println(requestURI+"\n"
				          +contextPath+"\n"
				          +pathInfo
						  );
		//command값 구하기 : "/boardlist.board" 추출
		String command=requestURI.substring(contextPath.length());

		//2단계: DAO 객체 생성
		HkDao dao=new HkDao();

		//3단계: 요청분기(요청확인하기)
		if(command.equalsIgnoreCase("/boardlist.board")){//글목록요청확인
			//4단계: 파라미터 받기 생략
			//5단계:dao메서드 실행
			List<HkDto>list=dao.getAllList();
			//6단계:Scope객체에 담기
			request.setAttribute("list", list);
//	 		response.sendRedirect("boardlist.jsp");// 객체 전달 못함 (X)
			//7단계: 페이지 이동
//			pageContext.forward("boardlist.jsp");
			dispatch("boardlist.jsp", request, response);
		}else if(command.equalsIgnoreCase("/boardInsertForm.board")){//글쓰기폼 이동
			//글쓰기 폼으로 이동 요청
			response.sendRedirect("boardInsertForm.jsp");
		}else if(command.equalsIgnoreCase("/boardInsert.board")){// 글추가하기
			//글추가 요청
			//파라미터 받기: id, title, content
			String id = request.getParameter("id");
			String title = request.getParameter("title");
			String content = request.getParameter("content");

			boolean isS= dao.insertBoard(new HkDto(id, title, content));
			if(isS){
				//그냥 boardlist.jsp 페이지로 가면 안된고,
				//반드시 컨트롤러를 거쳐서 가야 한다. --> list객체가 필요하기때문
				response.sendRedirect("boardlist.board");
				
				//테이블 수정 요청에 대한 응답은 forward를 사용하면 안된다
				// --> 주소창에 url이 갱신되지 않아서 동일한 양식을 또 제출하게 된다
				//dispatch("boardlist.board", request, response);
			}else{
				response.sendRedirect("error.jsp");

			}//=================여기까지 요청URL 변경했음==================

		}else if(command.equalsIgnoreCase("/boardDetail.board")){
			//seq 파라미터 받기
			String pseq=request.getParameter("seq");
			int seq=Integer.parseInt(pseq);// String -> int 형변환

			HkDto dto = dao.getBoard(seq);

			//dto객체를 저장하고 이동해야 전달됨
			request.setAttribute("dto", dto);
//			pageContext.forward("boardDetail.jsp");
			dispatch("boardDetail.jsp", request, response);
		}else if(command.equalsIgnoreCase("/boardUpdate.board")){
			//파라미터 받기: seq, title, content
			String pseq=request.getParameter("seq");
			int seq=Integer.parseInt(pseq);// String -> int 형변환
			String title = request.getParameter("title");
			String content = request.getParameter("content");

			boolean isS=dao.updateBoard(new HkDto(seq,title,content));

			if(isS){
				String url="boardDetail.board?seq="+seq;
				jsForward(url, "수정성공", response);

			}else{
				response.sendRedirect("error.jsp");
			}
		}else if(command.equalsIgnoreCase("/boardDelete.board")){//글삭제하기
			//파라미터 받기: seq
			String pseq=request.getParameter("seq");
			int seq=Integer.parseInt(pseq);// String -> int 형변환

			boolean isS=dao.deleteBoard(new HkDto(seq,null,null));

			if(isS){
				response
				.sendRedirect("boardlist.board");
			}else{
				response.sendRedirect("error.jsp");
			}
		}else if(command.equalsIgnoreCase("/muldel.board")){//여러글 삭제
			//파라미터 받기:   대략 이런 형태라고 생각해보기 {seq: [1,32,4,5,6,7]}
			// -> 파라미터가 같은 이름으로 여러개의 값을 전송할 경우
			String[] seqs = request.getParameterValues("seq");

			boolean isS=dao.mulDel(seqs);
			if(isS){
				response.sendRedirect("boardlist.board");
			}else{
				response.sendRedirect("error.jsp");
			}
		}
	}

	// forward 기능 구현
	public void dispatch(String url, HttpServletRequest request, HttpServletResponse response) 
	        throws ServletException, IOException {
	    request.getRequestDispatcher(url).forward(request, response);
	}

	// js forward 기능
	public void jsForward(String url, String msg, HttpServletResponse response) 
	        throws IOException {
	    PrintWriter out = response.getWriter();
	    String js = "<script type='text/javascript'>"
	              + "    alert('" + msg + "');"
	              + "    location.href = '" + url + "';"
	              + "</script>";
	    out.print(js);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
	        throws ServletException, IOException {
	    request.setCharacterEncoding("UTF-8");
	    response.setContentType("text/html; charset=UTF-8");
	    doGet(request, response);
	}



}
