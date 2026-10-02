package com.hk.ansboard.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.hk.ansboard.dao.AnsDao;
import com.hk.ansboard.dtos.AnsDto;
import com.hk.ansboard.util.Paging;

@Service
public class AnsService {

	// slf4j : 어느위치에 로그를 출력할 준비를 하는 객체
	// log4j : slf4j로 부터 위치등의 정보를 받아서 실제 로그를 출력하는 객체
	private static final Logger logger=
			LoggerFactory.getLogger(AnsService.class);
	
	@Autowired
	private AnsDao ansDao;
	
	public List<AnsDto> getAllList(String pnum){
		return ansDao.getAllList(pnum);
	}
	
	public Map<String, Object> getBoardListWithPaging(String pnum){
		Map<String, Object> resultMap=new HashMap<>();
		
		// 글목록
		List<AnsDto> list=ansDao.getAllList(pnum);
		// 페이지 개수
		int pCount = ansDao.getPcount();
		// 페이징 처리
		Map<String, Integer>pMap = Paging.pagingValue(pCount, pnum, 5);
		
		resultMap.put("list", list);
		resultMap.put("pCount", pCount);
		resultMap.put("pMap", pMap);
		
		return resultMap;
	}
	
	public int getPcount() {
		return ansDao.getPcount();
	}
	
	public boolean boardInsert(AnsDto dto) {
		return ansDao.boardInsert(dto);
	}
	
	public AnsDto boardDetail(int seq) {
		return ansDao.boardDetail(seq);
	}
	
	public boolean boardUpdate(AnsDto dto) {
		return ansDao.boardUpdate(dto);
	}
	
	public boolean mulDel(String[] seqs) {
		return ansDao.mulDel(seqs);
	}
	
	public boolean readCount(int seq) {
		return ansDao.readCount(seq);
	}
	
	@Transactional(propagation = Propagation.REQUIRED)
	public boolean boardReply(AnsDto dto) {
		
		boolean txActive = TransactionSynchronizationManager
						   .isActualTransactionActive();
		
		logger.info("트랜젝션 활성 상태:{}",txActive);
					
		// ---> 답글 요청 ---> update작업, insert작업
		// --> 한번 요청에 여러작업이 하나의 작업처럼 진행되게 처리
		ansDao.replyUpdate(dto);//step 증가시키는 쿼리
		
		//일부러 오류를 발생 : 트랜젝션 테스트를 위해
		// -> transactoin처리가 비활성화 되어 있는경우는 답글들의 step이 1씩증가
		//    -> 잘못된 데이터로 변경이 되서 문제가 됨
		//       -> 결론은 step만 올라가고 답글은 추가되지 않는 상황이 됨
//		if(true) {
//			throw new RuntimeException("트랜젝션 롤백 테스트");			
//		}
		
		int count=ansDao.replyInsert(dto);//답글 추가하는 쿼리
		return count>0;
	}
}






