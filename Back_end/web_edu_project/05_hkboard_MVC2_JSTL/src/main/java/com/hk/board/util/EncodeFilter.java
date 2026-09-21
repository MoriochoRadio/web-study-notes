package com.hk.board.util;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//url Mapping 방법 2가지 (xml, 어노테이션)
@WebFilter(
			urlPatterns = {"/*"},//여러 패턴 정의 가능
			initParams = {
					@WebInitParam(name="encoding",value="utf-8")
			}
		)
public class EncodeFilter extends HttpFilter{

	private String encode;

	@Override
	public void init(FilterConfig config) throws ServletException {
		encode=config.getInitParameter("encoding");
	}

	@Override
	public void doFilter(ServletRequest request,
						 ServletResponse response, FilterChain chain)
			             throws IOException, ServletException {

		System.out.println("요청할때 실행할 코드");
		//인코딩처리하는 코드
		request.setCharacterEncoding(encode);
		response.setContentType("text/html;charset="+encode);

		//요청 URI를 가져온다면
		//자식타입으로 형변환하기 --> HttpSevletRequest가 됨
		HttpServletRequest httpReq=(HttpServletRequest)request;
		System.out.println("요청URI(filter):"
		                   +httpReq.getRequestURI());

		//chain.doFilter 코드 실행 전 위치에 있는 코드--> 요청할때 실행될 코드
		chain.doFilter(request, response);

		//응답할때 실행될 코드
		System.out.println("응답할때 실행할 코드");
	}
}
