package com.hk.ansboard.controller;

import static org.junit.jupiter.api.Assertions.*;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
@ExtendWith(SpringExtension.class)
@ContextConfiguration(
		locations = {"file:src/main/webapp/WEB-INF/spring/**/*.xml"}		
		)
@WebAppConfiguration
class AnsControllerTest {

	// web 테스트 환경에서 서버 없이 컨트롤러 테스트를
	// 수행하기 위한 Spring Context 객체
	@Autowired
	private WebApplicationContext wac;
	
	//가상의 클라이언트 요청을 처리할 객체
	private MockMvc mock;
	
	@Test
	void testAnsController() {
		fail("Not yet implemented");
	}

	@Test
	void testBoardList() throws Exception {
		//mock객체 생성
		this.mock=MockMvcBuilders.webAppContextSetup(wac).build();
		
		//boardList.do 요청하기
		MvcResult result= mock.perform(
				MockMvcRequestBuilders.get("/boardList.do")
				.param("pnum", "1")
				).andExpect(MockMvcResultMatchers.status().isOk())
		.andReturn();//MvcResult객체 반환
		//처리된 결과 내용을 받아옴
		int statusCode=result.getResponse().getStatus();
		System.out.println("status코드:"+statusCode);
		System.out.println("HttpStatus:"+HttpStatus.OK.value());
		//ok는 200코드의미 == 현재 실행된 상태코드와 비교
		assertEquals(HttpStatus.OK.value(), statusCode);
	}

	@Test
	void testBoardInsertForm() {
		fail("Not yet implemented");
	}

	@Test
	void testBoardInsert() {
		fail("Not yet implemented");
	}

	@Test
	void testBoardDetail() {
		fail("Not yet implemented");
	}

	@Test
	void testBoardUpdate() {
		fail("Not yet implemented");
	}

	@Test
	void testMulDel() {
		fail("Not yet implemented");
	}

	@Test
	void testBoardReply() {
		fail("Not yet implemented");
	}

}
