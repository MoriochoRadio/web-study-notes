package com.hk.ansboard.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.ImportResource;
import org.springframework.stereotype.Repository;

import com.hk.ansboard.dtos.AnsDto;

@Repository
public class AnsDao {
	
	@Autowired //타입으로 찾아서 주입하는 기능 
//	@Qualifier("sqlSessionTemplate") //이름으로 구별해서 주입
//	@Resource() //별도 라이브러리 추가(이름으로 매칭, 이름이 없으면 타입으로 매칭)
	private SqlSessionTemplate sqlSession;
	
	private String namespace="com.hk.ansboard.dao.";
	
	//글목록 조회
	public List<AnsDto> getAllList(String pnum){
		Map<String, String> map = new HashMap<>();
		map.put("pnum", pnum);
		return sqlSession.selectList(namespace+"boardList",map);
	}
	//새글 추가하기
	public boolean boardInsert(AnsDto dto) {
		int count = sqlSession.insert(namespace+"boardInsert",dto);
		return count>0;
	}
	//글 상세조회
	public AnsDto boardDetail(int seq) {
		return sqlSession.selectOne(namespace+"boardDetail",seq);
	}
	//글 수정하기
	public boolean boardUpdate(AnsDto dto) {
		int count=sqlSession.update(namespace+"boardUpdate",dto);
		return count>0;
	}
	//글 삭제하기
	public boolean mulDel(String[] seqs) {
		Map<String, String[]> map = new HashMap<>();
		map.put("seqs", seqs);
		int count = sqlSession.update(namespace+"mulDel",map);
		return count>0;
	}
	//조회수 : 글목록에서 상세보기로 이동했을때 한번 올리기
	public boolean readCount(int seq) {
		int count = sqlSession.update(namespace+"readCount",seq);
		return count>0;
	}
}
