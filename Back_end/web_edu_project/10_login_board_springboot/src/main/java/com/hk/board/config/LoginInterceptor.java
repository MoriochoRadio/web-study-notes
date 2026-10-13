package com.hk.board.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor{

	//controller로 진입하기 전에 실행하는 메서드
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		HttpSession session=request.getSession();
		if(session.getAttribute("mdto")==null) {// 로그인X
			log.warn("로그인 필요");
			response.sendRedirect("/user/login");//home.html로 이동
			return false;
		}else {
			return true;			
		}
	}
	
	
}





