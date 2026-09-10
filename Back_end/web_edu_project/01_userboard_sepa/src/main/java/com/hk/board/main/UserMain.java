package com.hk.board.main;

import java.util.ArrayList;
import java.util.List;

import com.hk.board.dao.UserDao;
import com.hk.board.dto.userDto;

public class UserMain {
	   
	public static void main(String[] args) {
		getAllListTest();
	}
	
	//회원목록 조회 Test Case
	static public void getAllListTest() {
		
		UserDao dao = new UserDao();
		
		List<userDto> list = dao.getAllUser();
		for(userDto userDto : list) {
			System.out.println(userDto.toString());
		}
		
	}
}
