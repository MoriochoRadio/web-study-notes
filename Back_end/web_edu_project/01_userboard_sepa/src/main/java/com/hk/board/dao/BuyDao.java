package com.hk.board.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.hk.board.dto.BuyDto;

/**
 * [ BuyDao (Data Access Object) ]
 * - 역할: BUYTBL 테이블과 직접 통신하여 구매 내역에 대한 CRUD(조회, 등록, 수정, 삭제)를 전담하는 클래스입니다.
 */
public class BuyDao {

	// =========================================================================
	// [ 1단계 : 드라이버 로딩 ]
	// =========================================================================
	public BuyDao() {
		try {
			Class.forName("org.mariadb.jdbc.Driver");
			System.out.println("1단계: 드라이버 로딩 성공 (MariaDB 통역사 준비 완료)");
		} catch (ClassNotFoundException e) {
			System.out.println("1단계: 드라이버 로딩 실패 (드라이버 jar 파일 누락 확인 필요)");
			e.printStackTrace();
		}
	}
	
	// =========================================================================
	// [ 기능 1 : 구매 내역 전체 목록 조회 ] (R - Read)
	// =========================================================================
	// - SQL 문: SELECT
	// - 반환 타입: List<BuyDto> (여러 건의 구매 정보 목록)
	public List<BuyDto> getAllBuy() {
		List<BuyDto> list = new ArrayList<>();
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// 마지막 컬럼 뒤에 콤마(,)가 없도록 주의합니다.
		String sql = " SELECT num, userID, prodName, groupName, price, amount "
				   + " FROM BUYTBL "
				   + " ORDER BY num DESC ";
		
		Connection conn = null;
		PreparedStatement psmt = null;
		ResultSet rs = null;
		
		try {
			// 2단계: DB 연결
			conn = DriverManager.getConnection(url, user, password);
			System.out.println("2단계: DB연결 성공");

			// 3단계: 쿼리 준비
			psmt = conn.prepareStatement(sql);
			System.out.println("3단계: 쿼리준비 성공");

			// 4단계: 쿼리 실행
			rs = psmt.executeQuery();
			System.out.println("4단계: 쿼리실행 성공");
			
			// 5단계: 결과 수신 및 DTO 포장
			while (rs.next()) {
				BuyDto dto = new BuyDto();
				dto.setNum(rs.getInt(1));           // 1번째 열: NUM (구매번호, 정수)
				dto.setUserId(rs.getString(2));     // 2번째 열: USERID (회원아이디, 문자열)
				dto.setProudName(rs.getString(3));  // 3번째 열: PRODNAME (상품명, 문자열)
				dto.setGroupName(rs.getString(4));  // 4번째 열: GROUPNAME (분류그룹, 문자열)
				dto.setPrice(rs.getInt(5));         // 5번째 열: PRICE (단가, 정수)
				dto.setAmount(rs.getInt(6));        // 6번째 열: AMOUNT (수량, 정수)
				
				list.add(dto);
			}
			System.out.println("5단계: 구매목록 조회 완료 (총 " + list.size() + "건)");
			
		} catch (SQLException e) {
			System.out.println("구매 목록 조회 중 SQL 예외 발생");
			e.printStackTrace();
		} finally {
			// 6단계: 자원 해제 (역순 닫기: rs -> psmt -> conn)
			try {
				if (rs != null) rs.close();
				if (psmt != null) psmt.close();
				if (conn != null) conn.close();
				System.out.println("6단계: DB 연결 자원 닫기 완료");
			} catch (SQLException e) {
				System.out.println("6단계: DB 닫기 실패");
				e.printStackTrace();
			}
		}
		
		return list;
	}
	
	// =========================================================================
	// [ 기능 2 : 신규 구매 상품 등록 ] (C - Create)
	// =========================================================================
	// - SQL 문: INSERT
	// - 파라미터: BuyDto dto (등록할 상품 정보)
	// - 반환 타입: boolean (성공 여부)
	public boolean insertBuy(BuyDto dto) {
		int count = 0;
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// num, userID, prodName, groupName, price, amount 순서에 맞춤
		String sql = " INSERT INTO BUYTBL (num, userID, prodName, groupName, price, amount) "
				   + " VALUES (?, ?, ?, ?, ?, ?) ";
		
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			psmt.setInt(1, dto.getNum());
			psmt.setString(2, dto.getUserId());
			psmt.setString(3, dto.getProudName());
			psmt.setString(4, dto.getGroupName());
			psmt.setInt(5, dto.getPrice());
			psmt.setInt(6, dto.getAmount());
			
			count = psmt.executeUpdate();
			System.out.println("구매 등록 실행 완료 (영향받은 행: " + count + ")");

		} catch (SQLException e) {
			System.out.println("구매 등록 실패 (중복된 num 등)");
			e.printStackTrace();
		}
		
		return count > 0;
	}
	
	// =========================================================================
	// [ 기능 3 : 구매 상세 내역 1건 조회 ] (R - Read)
	// =========================================================================
	// - SQL 문: SELECT + WHERE num = ?
	// - 파라미터: int num (조회할 구매 고유 번호 PK)
	// - 반환 타입: BuyDto (해당 구매 1건에 대한 상세 데이터)
	public BuyDto getBuy(int num) {
		BuyDto dto = null;
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		String sql = " SELECT num, userID, prodName, groupName, price, amount "
				   + " FROM BUYTBL "
				   + " WHERE num = ? ";
		
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			psmt.setInt(1, num);
			
			try (ResultSet rs = psmt.executeQuery()) {
				if (rs.next()) {
					dto = new BuyDto();
					dto.setNum(rs.getInt(1));
					dto.setUserId(rs.getString(2));
					dto.setProudName(rs.getString(3));
					dto.setGroupName(rs.getString(4));
					dto.setPrice(rs.getInt(5));
					dto.setAmount(rs.getInt(6));
				}
			}
		} catch (Exception e) {
			System.out.println("구매 상세 조회 실패");
			e.printStackTrace();
		}
		
		return dto;
	}
	
	// =========================================================================
	// [ 기능 4 : 구매 정보 수정 ] (U - Update)
	// =========================================================================
	// - SQL 문: UPDATE (단가 price, 수량 amount 수정)
	// - 파라미터: BuyDto dto (수정할 price, amount와 조건식에 쓸 num 포함)
	// - 반환 타입: boolean (성공 여부)
	public boolean updateBuy(BuyDto dto) {
		int count = 0;
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// 주석에 적혀있던 기획 기준: price와 amount를 수정하고 num을 식별자로 사용
		String sql = " UPDATE BUYTBL "
				   + " SET price = ?, amount = ? "
				   + " WHERE num = ? ";
		
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			psmt.setInt(1, dto.getPrice());   // 1번째 ?: 변경할 가격
			psmt.setInt(2, dto.getAmount());  // 2번째 ?: 변경할 수량
			psmt.setInt(3, dto.getNum());     // 3번째 ?: 수정 기준이 되는 구매 고유번호
			
			count = psmt.executeUpdate();
			System.out.println("구매 정보 수정 완료 (영향받은 행: " + count + ")");
			
		} catch (Exception e) {
			System.out.println("구매 정보 수정 실패");
			e.printStackTrace();
		}
		
		return count > 0;
	}
	
	// =========================================================================
	// [ 기능 5 : 구매 내역 삭제 ] (D - Delete)
	// =========================================================================
	// - SQL 문: DELETE + WHERE num = ?
	// - 파라미터: int num (삭제할 구매 고유 번호)
	// - 반환 타입: boolean (성공 여부)
	public boolean deleteBuy(int num) {
		int count = 0;
		
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = "root";
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// 원래는 소스에 직접 적지 않고 WEB-INF 안의 설정 파일로 빼는 것이 맞다.
		String password = "";   // ← 여기에 DB 비밀번호
		
		// 특정 구매 건(1건)만 삭제하기 위해 고유키(PK)인 num을 조건으로 사용
		String sql = " DELETE FROM BUYTBL WHERE num = ? ";
		
		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement psmt = conn.prepareStatement(sql)) {
			
			psmt.setInt(1, num);
			
			count = psmt.executeUpdate();
			System.out.println("구매 내역 삭제 완료 (삭제된 행: " + count + ")");
			
		} catch (Exception e) {
			System.out.println("구매 내역 삭제 실패");
			e.printStackTrace();
		}
		
		return count > 0;
	}
}