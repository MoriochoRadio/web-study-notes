package com.hk.board.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.hk.board.dto.userDto;

/**
 * [ DAO (Data Access Object) ]
 * - 역할: 데이터베이스(DB)에 직접 찾아가서 데이터를 꺼내오거나, 넣거나, 고치거나, 지우는(CRUD) '창고 관리 직원' 클래스입니다.
 * - 자바 프로그램이 DB와 대화하기 위한 표준 규격인 'JDBC 6단계'를 거쳐 동작합니다.
 */
public class UserDao {

	// =========================================================================
	// [ 1단계 : 드라이버 로딩 ]
	// =========================================================================
	// UserDao 객체가 new로 생성될 때 가장 먼저 딱 1번 실행되는 생성자입니다.
	public UserDao() {
		try {
			// 자바는 MariaDB의 고유 언어를 모르기 때문에 중간 통역사(드라이버 클래스)를 메모리에 띄웁니다.
			// 비유하자면 "MariaDB와 통화하기 위해 스마트폰을 개통하는 작업"입니다.
			Class.forName("org.mariadb.jdbc.Driver");
			System.out.println("1단계: 드라이버 로딩 성공 (MariaDB 통역사 준비 완료)");
		} catch (ClassNotFoundException e) {
			// 만약 pom.xml이나 라이브러리에 mariadb-java-client.jar 파일이 없으면 이 에러가 뜹니다.
			System.out.println("1단계: 드라이버 로딩 실패 (라이브러리 jar 파일이 누락되었는지 확인하세요)");
			e.printStackTrace();
		}
	}
	
	// =========================================================================
	// [ 기능 1 : 회원 전체 목록 조회 ] (R - Read)
	// =========================================================================
	// - SQL 명령어 : SELECT문
	// - 반환 타입   : List<userDto> (여러 명의 회원이 담긴 상자 묶음 리스트)
	public List<userDto> getAllUser() {
		// 조회된 회원들을 차곡차곡 담아서 최종적으로 돌려줄 빈 리스트 바구니를 미리 만듭니다.
		List<userDto> list = new ArrayList<>();
		
		// DB 접속을 위한 3가지 필수 정보 (위치/계정/비밀번호)
		String url = "jdbc:mariadb://localhost:3306/hk"; // 내 컴퓨터(localhost)의 3306 포트에 있는 'hk' 데이터베이스
		String user = "root";                            // DB 최고 관리자 아이디
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호                        // DB 비밀번호
		
		// DB에 던질 질문(SQL문)을 작성합니다. (최근 가입한 사람 순서대로 정렬)
		String sql = " SELECT "
				+ " USERID, NAME, BIRTHYEAR, ADDR, MOBILE1, MOBILE2, HEIGHT, "
				+ " MDATE FROM USERTBL "
				+ " ORDER BY MDATE DESC ";
		
		// JDBC 작업을 도와줄 핵심 도구 3인방을 미리 선언합니다.
		Connection conn = null;        // 1) DB와의 통신 고속도로(통로)
		PreparedStatement psmt = null; // 2) SQL 쿼리를 싣고 달릴 자동차(문장 객체)
		ResultSet rs = null;           // 3) DB가 조회 결과를 담아 돌려주는 결과 표(장부)
		
		try {
			// [ 2단계 : DB 연결 ] 통신 통로 열기
			conn = DriverManager.getConnection(url, user, password);
			System.out.println("2단계: DB연결 성공");

			// [ 3단계 : 쿼리 준비 ] 실행할 SQL 쿼리를 고속도로 위에 올림
			psmt = conn.prepareStatement(sql);
			System.out.println("3단계: 쿼리준비 성공");

			// [ 4단계 : 쿼리 실행 ] DB에게 "이 쿼리 실행해서 표 형태로 결과 돌려줘!" 하고 요청
			// * 주의: 조회(SELECT)할 때는 반드시 executeQuery()를 씁니다.
			rs = psmt.executeQuery();
			System.out.println("4단계: 쿼리실행 성공");
			
			// [ 5단계 : 결과 수신 및 DTO 포장 ]
			// rs는 처음엔 첫 번째 데이터의 바로 위(제목줄)를 가리키고 있습니다.
			// rs.next()를 호출할 때마다 아래로 한 줄씩 내려가며 "다음 데이터가 있으면 true, 끝났으면 false"를 반환합니다.
			while (rs.next()) {
				// 한 줄(Row)의 회원 정보를 담기 위해 깨끗한 DTO 상자 하나를 새로 만듭니다.
				userDto dto = new userDto();
				
				// 표의 n번째 열(컬럼)에 적힌 값을 꺼내서 상자(DTO)에 채워 넣습니다.
				dto.setUserId(rs.getString(1));   // 1번째 열: USERID (문자열)
				dto.setName(rs.getString(2));     // 2번째 열: NAME (문자열)
				dto.setBirthYear(rs.getInt(3));   // 3번째 열: BIRTHYEAR (정수 숫자)
				dto.setAddr(rs.getString(4));     // 4번째 열: ADDR (문자열)
				dto.setMobile1(rs.getString(5));  // 5번째 열: MOBILE1 (문자열)
				dto.setMobile2(rs.getString(6));  // 6번째 열: MOBILE2 (문자열)
				dto.setHeight(rs.getInt(7));      // 7번째 열: HEIGHT (정수 숫자)
				dto.setmDate(rs.getDate(8));      // 8번째 열: MDATE (날짜형)
				
				// 정보가 꽉 찬 DTO 상자를 전체 리스트 바구니에 쏙 넣습니다.
				list.add(dto);
			}
			System.out.println("5단계: 쿼리결과 받기 성공 (총 " + list.size() + "명 포장 완료)");
			
		} catch (SQLException e) {
			System.out.println("SQL 실행 중 문제가 발생했습니다.");
			e.printStackTrace();
		} finally {
			// [ 6단계 : 자원 닫기(Clean Up) ]
			// 사용한 DB 통로는 반드시 닫아주어야 서버 메모리가 꽉 차서 멈추는 일(누수)을 막을 수 있습니다.
			// 열었던 순서의 반대로 닫습니다: rs -> psmt -> conn
			try {
				if (rs != null) rs.close();
				if (psmt != null) psmt.close();
				if (conn != null) conn.close();
				System.out.println("6단계: DB 연결 안전하게 닫기 완료");
			} catch (SQLException e) {
				System.out.println("6단계: DB 닫기 실패");
				e.printStackTrace();
			}
		}
		
		// 완성된 회원 명부 리스트를 요청한 쪽에 반환합니다.
		return list;
	}
	
	// =========================================================================
	// [ 기능 2 : 신규 회원 가입 ] (C - Create)
	// =========================================================================
	// - SQL 명령어 : INSERT문
	// - 파라미터   : userDto dto (새로 가입할 회원의 모든 정보가 담긴 상자)
	// - 반환 타입   : boolean (저장에 성공하면 true, 실패하면 false)
	public boolean insertUser(userDto dto) {
		int count = 0; // DB에서 영향을 받은 행(줄)의 개수를 셀 변수
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// ?(물음표)는 나중에 자바 변수를 안전하게 꽂아 넣을 "빈칸 홀더"입니다.
		// 맨 마지막 가입일(MDATE)은 DB 서버의 현재 시각을 찍어주는 SYSDATE() 함수를 사용합니다.
		String sql = " INSERT INTO USERTBL VALUES(?,?,?,?,?,?,?,SYSDATE()) ";
		
		// [ try-with-resources 문법 사용 ]
		// 소괄호 안에 conn과 psmt를 선언해 두면, 중괄호가 끝날 때 자동으로 close()를 실행해 줍니다. (finally 생략 가능!)
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			// SQL문의 ? 순서 번호(1부터 시작)에 맞춰 DTO 상자에서 값을 꺼내 꽂아줍니다.
			psmt.setString(1, dto.getUserId());    // 1번째 ?: 회원 아이디
			psmt.setString(2, dto.getName());      // 2번째 ?: 이름
			psmt.setInt(3, dto.getBirthYear());    // 3번째 ?: 출생년도
			psmt.setString(4, dto.getAddr());      // 4번째 ?: 주소
			psmt.setString(5, dto.getMobile1());   // 5번째 ?: 통신사/앞자리 (010 등)
			psmt.setString(6, dto.getMobile2());   // 6번째 ?: 뒷자리 전화번호
			psmt.setInt(7, dto.getHeight());       // 7번째 ?: 키
			
			System.out.println("쿼리 빈칸 채우기 완료");
			
			// * 주의: 조회(SELECT)가 아닌 등록/수정/삭제는 executeUpdate()를 실행합니다!
			// 성공적으로 추가된 행의 개수(보통 1개 성공 시 1)가 반환됩니다.
			count = psmt.executeUpdate();

		} catch (SQLException e) {
			System.out.println("회원 등록 실패 (아이디 중복 등)");
			e.printStackTrace();
		}
		
		// 삼항 연산자: 추가된 행이 1개 이상이면 true, 0개면 false를 반환합니다.
		return count > 0 ? true : false;
	}
	
	// =========================================================================
	// [ 기능 3 : 특정 회원 1명 상세 조회 ] (R - Read)
	// =========================================================================
	// - SQL 명령어 : SELECT문 + WHERE 조건
	// - 파라미터   : String userId (찾고 싶은 특정 유저의 아이디)
	// - 반환 타입   : userDto (그 유저 1명의 모든 상세 정보를 담은 상자)
	public userDto getUser(String userId) {
		// 결과가 없을 수도 있으므로 처음에는 빈손(null)으로 시작하는 것이 안전합니다.
		userDto dto = null;
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// 아이디가 일치하는 1명만 꼭 집어서 가져오는 쿼리입니다.
		String sql = " SELECT userid, NAME, birthyear, addr, mobile1, mobile2, height, mdate "
				   + " FROM usertbl "
				   + " WHERE userid = ? ";
		
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			// 1번째 물음표(?) 자리에 찾으려는 userId 값을 꽂아 넣습니다.
			psmt.setString(1, userId);
			
			// 쿼리를 실행하여 결과 표(rs)를 받습니다. (이것도 자동으로 닫히도록 중첩 try-with-resources 사용)
			try (ResultSet rs = psmt.executeQuery()) {
				// 단 1명의 유저만 찾는 것이므로 반복문 while 대신 if를 써도 충분합니다.
				if (rs.next()) {
					dto = new userDto(); // 유저가 실제로 DB에 존재할 때만 새 상자를 만듭니다.
					
					dto.setUserId(rs.getString(1));
					dto.setName(rs.getString(2));
					dto.setBirthYear(rs.getInt(3));
					dto.setAddr(rs.getString(4));
					dto.setMobile1(rs.getString(5));
					dto.setMobile2(rs.getString(6));
					dto.setHeight(rs.getInt(7));
					dto.setmDate(rs.getDate(8));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		// 유저를 찾았으면 데이터가 담긴 DTO가 반환되고, 못 찾았으면 null이 반환됩니다.
		return dto;
	}
	
	// =========================================================================
	// [ 기능 4 : 회원 정보 수정 ] (U - Update)
	// =========================================================================
	// - SQL 명령어 : UPDATE문
	// - 파라미터   : userDto dto (수정할 새 주소, 전화번호, 키, 그리고 누구인지 식별할 아이디가 든 상자)
	// - 반환 타입   : boolean (수정 성공 시 true, 실패 시 false)
	public boolean updateUser(userDto dto) {
		int count = 0; // 수정된 행의 개수를 저장할 변수
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// 특정 유저(WHERE userid = ?)를 찾아 주소, 전화번호, 키를 바꿉니다.
		String sql = " UPDATE usertbl "
				   + " SET addr = ? , mobile1 = ? , mobile2 = ? , height = ? "
				   + " WHERE userid = ? ";
		
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			// 물음표 순서(1~5)와 DTO에서 꺼내는 데이터 순서가 반드시 일치해야 합니다.
			psmt.setString(1, dto.getAddr());     // 1번째 ?: 바꿀 주소
			psmt.setString(2, dto.getMobile1());  // 2번째 ?: 바꿀 앞자리 번호
			psmt.setString(3, dto.getMobile2());  // 3번째 ?: 바꿀 뒷자리 번호
			psmt.setInt(4, dto.getHeight());      // 4번째 ?: 바꿀 키
			psmt.setString(5, dto.getUserId());   // 5번째 ?: 조건이 되는 기준 회원 ID (WHERE 절)
			
			// UPDATE도 데이터 변경 작업이므로 executeUpdate()를 실행합니다.
			count = psmt.executeUpdate(); // 수정 성공 시 1이 반환됨
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return count > 0 ? true : false;
	}
	
	// =========================================================================
	// [ 기능 5 : 회원 정보 삭제 ] (D - Delete)
	// =========================================================================
	// - SQL 명령어 : DELETE문
	// - 파라미터   : String userId (탈퇴시킬 회원의 아이디)
	// - 반환 타입   : boolean (삭제 성공 시 true, 실패 시 false)
	public boolean deleteUser(String userId) {
		int count = 0;
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// 아이디가 일치하는 행을 테이블에서 완전히 지웁니다.
		String sql = " DELETE FROM usertbl WHERE userid = ? ";
		
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			// 1번째 물음표에 삭제할 대상 아이디를 넣습니다.
			psmt.setString(1, userId);
			
			// DELETE도 데이터 변경 작업이므로 executeUpdate()를 호출합니다.
			count = psmt.executeUpdate(); // 삭제 성공 시 지워진 행의 개수(1)가 반환됨
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		// 1개 이상의 행이 삭제되었으면 true, 없으면 false
		return count > 0 ? true : false;
	}
	
}