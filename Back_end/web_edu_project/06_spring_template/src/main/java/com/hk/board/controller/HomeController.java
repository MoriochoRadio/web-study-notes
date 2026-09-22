package com.hk.board.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {
	
	@RequestMapping(value ="/home.do",method = RequestMethod.GET)
	public String home() {
		
		//페이지 이름만 작성한다
		// --> WEB-INF/views + home + .jsp : ViewResolver가 해줌
		return "home";
	}
	
	
	@RequestMapping(value ="/main.do",method = RequestMethod.GET)
	public String main() {
		return "main";
	}
}
