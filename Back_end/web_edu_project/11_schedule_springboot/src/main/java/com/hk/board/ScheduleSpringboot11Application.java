package com.hk.board;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ===== 앱의 시작점 =====
// @SpringBootApplication = 이 클래스가 있는 패키지(com.hk.board)와 그 아래 패키지를 전부 훑어서
//   @Controller · @Service · @Mapper · @Component · @Configuration 이 붙은 클래스를 찾아 객체(빈)로 만들어 둔다.
//   그래서 controller/ service/ mapper/ utils/ handler/ config/ 는 모두 com.hk.board 아래에 있어야 한다.
@SpringBootApplication
public class ScheduleSpringboot11Application {

	// main() 실행 → 스프링이 빈을 만들고 → 내장 톰캣을 켠다 (포트는 application.properties 의 server.port)
	public static void main(String[] args) {
		SpringApplication.run(ScheduleSpringboot11Application.class, args);
	}

}
