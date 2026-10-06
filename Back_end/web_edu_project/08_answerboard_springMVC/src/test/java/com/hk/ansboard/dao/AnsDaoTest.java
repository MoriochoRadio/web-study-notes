package com.hk.ansboard.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;

import com.hk.ansboard.dtos.AnsDto;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(
		locations = {"file:src/main/webapp/WEB-INF/spring/**/*.xml"}		
		)
@WebAppConfiguration
public class AnsDaoTest {
	
	@Autowired
	private SqlSessionTemplate sqlSession;
	private String namespace="com.hk.ansboard.dao.";
	
	@Test
	void testGetAllList() {
		Map<String, String>map=new HashMap<>();
		map.put("pnum","1");
		List<AnsDto>list=sqlSession.selectList(namespace+"boardList",map);
		System.out.println("글목록개수:"+list.size());
		assertEquals(10, list.size());
				
	}
}
