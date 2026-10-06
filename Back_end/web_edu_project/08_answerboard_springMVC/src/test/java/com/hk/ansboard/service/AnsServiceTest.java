package com.hk.ansboard.service;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;

import com.hk.ansboard.dao.AnsDao;
import com.hk.ansboard.dtos.AnsDto;
@ExtendWith(SpringExtension.class)
@ContextConfiguration(
		locations = {"file:src/main/webapp/WEB-INF/spring/**/*.xml"}		
		)
@WebAppConfiguration
class AnsServiceTest {
	
	@Autowired
	private AnsDao ansDao;

	@Test
	void testGetAllList() {
		fail("Not yet implemented");			
	}

	@Test
	void testGetBoardListWithPaging() {
		fail("Not yet implemented");
	}

	@Test
	void testGetPcount() {
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
	void testReadCount() {
		fail("Not yet implemented");
	}

	@Test
	void testBoardReply() {
		fail("Not yet implemented");
	}

}
