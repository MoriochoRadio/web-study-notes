package com.hk.board.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.hk.board.dto.userDto;

//DAO객체: 데이터베이스에 접근해서 CRUD작업하는 객체 
// --> JDBC를 구현함: 6단계로 구성
public class UserDao {

	//1단계: 드라이버 로딩
	public UserDao() {
		try {
			Class.forName("org.mariadb.jdbc.Driver");
			System.out.println("1단계: 드라이버 로딩 성공");
		} catch (ClassNotFoundException e) {
			System.out.println("1단계: 드라이버 로딩 실패");
			e.printStackTrace();
		}
	}
	
	//메서드 구현: 2~6단계 구현

	//회원 목록 조회 기능: select문 (반환타입: List[Dto, Dto...])
	public List<userDto> getAllUser(){
		List<userDto> list = new ArrayList<>();
		
		//DB연결을 위한 정보 정의
		String url="jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 이렇게 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		//실행할 쿼리 정의
		String sql = " SELECT "
				+ " USERID, NAME, BIRTHYEAR, ADDR, MOBILE1, MOBILE2, HEIGHT, "
				+ " MDATE FROM USERTBL "
				+ " ORDER BY MDATE DESC ";
		
		Connection conn = null; // DB연결을 위한 객체
		PreparedStatement psmt = null; //쿼리 준비를 위한 객체
		ResultSet rs = null; //쿼리 결과 받기 위한 객체
		
		try {
			conn = DriverManager.getConnection(url, user, password);
			System.out.println("2단계: DB연결 성공");
			psmt = conn.prepareStatement(sql);
			System.out.println("3단계: 쿼리준비 성공");
			rs = psmt.executeQuery();
			System.out.println("4단계: 쿼리실행 성공");
			
			//ResultSet은 
			while(rs.next()) { //next()는 값이 있는지 확인
				userDto dto = new userDto(); // 행단위로 저장할 객체
				//행단위로 가져온뒤 열단위로 꺼낸다.
				dto.setUserId(rs.getString(1));
				dto.setName(rs.getString(2));
				dto.setBirthYear(rs.getInt(3));
				dto.setAddr(rs.getString(4));
				dto.setMobile1(rs.getString(5));
				dto.setMobile2(rs.getString(6));
				dto.setHeight(rs.getInt(7));
				dto.setmDate(rs.getDate(8));
				list.add(dto); //마지막에 완성된 DTO를 담아야 한다.
				
				
			
			}
			System.out.println("5단계: 쿼리결과 받기 성공");
		} catch (SQLException e) {
			System.out.println("JDBC실패");
			e.printStackTrace();
		}finally {
			try {
				if(rs!=null) {
					rs.close();
				}
				if(psmt!=null) {
					psmt.close();
				}
				if(conn!=null) {
					conn.close();
				}
				System.out.println("6단계: DB닫기 성공");
			} catch (SQLException e) {
				System.out.println("6단계: DB닫기 실패");
				e.printStackTrace();
			}
		}
		
		return list;
	}
	
	//회원 등록 기능 : insert문(반환타입:boolean)
	//전달받는 파라미터 선언: id,name,addr,mobile... 복잡함
	// --> userDto로 받자
	public boolean insertUser(userDto dto) {
		int count = 0;
		
		//DB연결을 위한 정보
		String url="jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 이렇게 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		//실행할 쿼리 정의
		String sql = " INSERT INTO USERTBL VALUES(?,?,?,?,?,?,?,SYSDATE()) ";
		
		//try() 문법을 사용하면 close()처리를 자동으로 해줌
		try(Connection conn = DriverManager.getConnection(url, user ,password);
			PreparedStatement psmt = conn.prepareStatement(sql);){
			//쿼리에 ?를 채우는 작업
			psmt.setString(1, dto.getUserId());
			psmt.setString(2, dto.getName());
			psmt.setInt(3,  dto.getBirthYear());
			psmt.setString(4, dto.getAddr());
			psmt.setString(5, dto.getMobile1());
			psmt.setString(6, dto.getMobile2());
			psmt.setInt(7, dto.getHeight());
			System.out.println("쿼리 준비 완료");
			count = psmt.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return count>0?true:false;
	}
	
}
