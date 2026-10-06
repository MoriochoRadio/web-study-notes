package com.hk.ansboard.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

//해당 클래스를 인터셉터로 사용하려면, HandlerInterceptor를 구현한다
//Controller로 진입하기 전후로 동작한다.

public class LoginChkInterceptor implements HandlerInterceptor {

	//slf4j는 로그 출력 위치, 형식을 정의
	// --> log4j는 실제 그 형식을 출력하는 작업을 수행
	Logger logger = LoggerFactory.getLogger(getClass());
	
	//Controller 진입 전에 실행된다
	// -> 예시) 로그인 정보를 확인해서 true면 Controller 진입시킴
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		//로그인 상태 확인하기
		//로그인기능: id/pw 입력하고 로그인 실행
		// --> session객체에 id 정보를 저장해야함
		// -->session.setAttribute("id","hk")
		// 클라이언트에서 생성되는 cookie에 본인을 확인할 수 있는 값이 생성됨
		// --> 서버에서 확인 가능 --> 개인 session객체를 생성
		// false를 설정하면 기존에 생성된게 있으면 사용하고
		// 없으면 null을 반환
		HttpSession session = request.getSession(false);
		if(session == null || session.getAttribute("id")==null) {
			logger.info("로그인이 필요함");
			response.sendRedirect("index.jsp");
			return false; //컨트롤러로 진입 못함
		}
		
		
		return true; //true가 반환되면 컨트롤러로 진입
	}
	
	//Controller 진입 후 DisatcherServlet이 뷰로 보내기 전에 호출
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		logger.info("인터셉터: postHandle 실행");
	}
	
	//Controller 에서 뷰까지 실행이 완료된 후 호출
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		logger.info("인터셉터:afterCompletion실행");
	}
}
