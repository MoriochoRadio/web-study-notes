package com.hk.board.daos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.hk.board.dtos.HkDto;

// 05_hkboard에 dao 클래스에 메서드들을 복사해서 가져오기
public interface IHkDao {
	//글목록 조회 기능: 반환(List) select문
	public List<HkDto> getAllList();
	
	//글 추가하기: 반환값(boolean) insert문
	// -> 파라미터 받기: DTO로 받는다.
	public boolean insertBoard(HkDto dto);
	
	//글 상세보기: 반환값 HkDto , 파라미터 SEQ
	public HkDto getBoard(int seq);
	
	//글 수정하기: 반환값(boolean) update문
	// -> 파라미터 받기: DTO로 받는다.
	public boolean updateBoard(HkDto dto);
	
	//글 삭제하기: 반환값(boolean) delete문
	// -> 파라미터 받기: DTO로 받는다.
	public boolean deleteBoard(HkDto dto) ;
	
	//여러글 삭제하기: 파라미터는 seq[] , delete문(여러개)
	public boolean mulDel(String[] seqs) ;
}
