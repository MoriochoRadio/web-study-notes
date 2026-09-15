package com.hk.board.test;

import java.util.List;

import com.hk.board.dao.HkDao;
import com.hk.board.dto.HkDto;


public class MainTest {
	//jUnit : test 도구를 이용하면 편리하게 테스트 관리할 수 있다.
	public static void main(String[] args) {
		MainTest test = new MainTest();
		
		System.out.println("=== 1. 글 추가하기 테스트 ===");
		test.BoardInsertTest();
		
		System.out.println("\n=== 2. 글 목록 조회 테스트 ===");
		test.BoardListTest();
		
	}
	
	//글목록조회하기 TEST CASE
	public void BoardListTest() {
		HkDao dao = new HkDao();
		List<HkDto> list = dao.getAllList();
		
		for(HkDto hkdto : list) {
			System.out.println(hkdto.toString());
		}
	}
	//글추가하기 TEST CASE
	public void BoardInsertTest() {
		HkDao dao = new HkDao();
		
		HkDto dto = new HkDto("hkadmin", "테스트 글 등록", "자바로 직접 등록한 글 내용");
		
		boolean isS = dao.insertBoard(dto);
		
		if (isS) {
			System.out.println("-> 글 추가 성공!");
			System.out.println(isS);
		} else {
			System.out.println("-> 글 추가 실패");
		}
	}
	
}
