package com.hk.hello;

import java.io.IOException;
import java.io.PrintWriter;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

//url-mapping 어노테이션 방식: tomcat7.0부터 지원
@WebServlet(
		 urlPatterns = {"/HelloServlet.do"},
		 initParams = {
				 @WebInitParam(name="name",value="한경닷컴")
		 }
		)
public class HelloServlet extends HttpServlet{

	//init(): 서블릿 객체가 생성될때 최초 한번 실행되는 메서드
	@Override
	public void init() throws ServletException {
		System.out.println("init():최초 한번 실행");
	}

	//ServletConfig객체의 사용
	//  ---> init()메서드에서 파라미터를 통해 얻을 수 있다.
	@Override
	public void init(ServletConfig config) throws ServletException {
		//서블릿에 정의된 초기값 가져오기
		String name=config.getInitParameter("name");
		System.out.println("서블릿 초기값:"+name);

		//ServletContext객체 얻어오기(JSP: application객체)
		ServletContext application=config.getServletContext();
		application.setAttribute("id", "hk");//객체 저장
		System.out.println((String)application.getAttribute("id"));

		//web.xml에 정의하고 가져올 경우
		System.out.println((String)application.getInitParameter("driver"));
	}

	//service(): 요청과 응답에 대한 처리 --> doGet(), doPost() 로 구현함
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse respose) throws ServletException, IOException {

		//인코딩처리
//		request.setCharacterEncoding("utf-8");
//		respose.setContentType("text/html;charset=utf-8");

		//request에서 제공하는 메서드 일부 살펴보면
		System.out.println("요청주소:"+request.getRequestURL());

		//파라미터 받기
		String param = request.getParameter("param");

		//서블릿에서 클라이언트로 응답하기
		PrintWriter out=respose.getWriter();
		out.print("<h1 style='color:blue;'>서블릿개념</h1>");
		out.print("<h2>서블릿 기본 내용 알아보기</h2>");
		out.print("<h2>서블릿에서 받은 파라미터:"+param+"</h2>");
		out.print("<h3><a href='index.jsp'>메인으로 돌아가기</a></h3>");

		//페이지로 응답할 경우
//		respose.sendRedirect("index.jsp");

		//session 객체 얻어오기
		HttpSession session = request.getSession();
		session.setAttribute("id", "hk");
		// --> 요청한 pc에 브라우저에 쿠키를 확인해보면 session_id
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		//post방식으로 요청된 req,resp를 doGet으로 전달하면
		//  --> doGet에서 요청, 응답처리 할 수 있다.
		doGet(req, resp);
	}

	@Override
	public void destroy() {
		System.out.println("요청이 더이상 없으면 자동으로 서블릿 객체를 소멸시킨다.");
	}
}
