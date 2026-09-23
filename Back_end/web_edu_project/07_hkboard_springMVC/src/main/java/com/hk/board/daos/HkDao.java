package com.hk.board.daos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.hk.board.dtos.HkDto;

@Repository
public class HkDao implements IHkDao{

	private String namespace="com.hk.board.dao.";
	
	// @Autowired: 등록된 객체의 타입과 같은 타입을 찾아서 주입한다. 
	@Autowired
	private SqlSessionTemplate sqlSession;
	
	@Override
	public List<HkDto> getAllList() {
		return sqlSession.selectList(namespace+"boardList");
	}

	@Override
	public boolean insertBoard(HkDto dto) {
		int count =sqlSession.insert(namespace+"insertBoard",dto);
		return count>0;
	}

	@Override
	public HkDto getBoard(int seq) {
		return sqlSession.selectOne(namespace+"getBoard",seq);
	}

	@Override
	public boolean updateBoard(HkDto dto) {
		int count =sqlSession.update(namespace+"updateBoard",dto);
		return count>0;
	}

	@Override
	public boolean deleteBoard(HkDto dto) {
	    int count = sqlSession.delete(namespace + "deleteBoard", dto);
	    return count > 0;
	}

	@Override
	public boolean mulDel(String[] seqs) {
		//동적쿼리에 파라미터를 전달할 경우
		//Map에 담아서 전달해줘야 한다.
		Map<String, String[]> map = new HashMap<>();
		map.put("seqs", seqs);
		int count=sqlSession.delete(namespace+"mulDel",map);
		return count>0;
	}

}
