package com.hk.board.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.hk.board.datasource.DataBase;
import com.hk.board.dto.HkDto;

// DAO(Data Access Object): 실제 데이터베이스(hkboard)와 대화하여 CRUD 작업을 실행하는 클래스입니다.
// extends DataBase를 통해 부모(DataBase)가 가진 DB 연결 기능(getConnection())을 그대로 물려받아 사용합니다.
public class HkDao extends DataBase{


	// 글목록 조회 기능: SELECT문을 실행하고 조회된 결과를 DTO들이 담긴 List 형태로 반환합니다.
	public List<HkDto> getAllList(){
		// 여러 개의 글 상자(HkDto)를 순서대로 담아둘 리스트 생성
		List<HkDto> list = new ArrayList<>();

		// 최신 글이 가장 위로 오도록 REGDATE 기준 내림차순(DESC) 정렬 쿼리
		String sql = "SELECT SEQ, ID, TITLE, CONTENT, REGDATE FROM HKBOARD ORDER BY REGDATE DESC ";

		// try-with-resources 문법: 괄호 안에 선언된 자원(Connection, PreparedStatement)은
		// 실행이 끝나면 자동으로 close()되어 메모리 누수를 방지합니다.
		try(Connection conn = getConnection(); // 2단계: 부모 클래스에서 연결 통로(conn)를 얻어옴
			PreparedStatement psmt = conn.prepareStatement(sql); // 3단계: DB에 보낼 쿼리문 준비
			){
			// 4단계: 쿼리 실행
			// SELECT 쿼리는 조회 결과를 엑셀 표 형태의 객체인 ResultSet(rs)으로 돌려받습니다.
			try(ResultSet rs = psmt.executeQuery()){
				// java <=== DB: DB에 값들을 java에서 사용할 수 있게 처리
				// JS <=== Server : [json text]를 JS객체로 변환 처리

				// 5단계: 결과 데이터 매핑
				// rs.next(): 표에서 다음 줄(Row)이 있으면 true를 반환하며 커서를 아래로 한 칸 내립니다.
				while(rs.next()) {
					// DB에서 꺼낸 한 행의 데이터들을 묶어줄 자바 상자(DTO)를 새로 생성
					HkDto dto = new HkDto();

					// 컬럼 순번(1, 2, 3, 4, 5)에 맞춰 DB 값을 꺼내 DTO의 setter로 보관
					dto.setSeq(rs.getInt(1));          // SEQ 컬럼의 정수값
					dto.setId(rs.getString(2));        // ID 컬럼의 문자열
					dto.setTitle(rs.getString(3));     // TITLE 컬럼의 문자열
					dto.setContent(rs.getString(4));   // CONTENT 컬럼의 문자열
					dto.setRegDate(rs.getDate(5));     // REGDATE 컬럼의 날짜값

					// 완성된 DTO 상자를 리스트 바구니에 추가
					list.add(dto);
					System.out.println(dto); // 제대로 담겼는지 콘솔에 확인 출력

				}
			}
		} catch (SQLException e) {
			// SQL 구문 오류나 통신 에러 발생 시 예외 출력
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// 화면이나 테스트 코드로 DTO들이 가득 담긴 목록을 최종 반환
		return list;
	}

	// 글 추가하기: 화면에서 입력받은 데이터(DTO)를 받아 INSERT문을 실행하고 성공 여부(boolean)를 반환합니다.
	// -> 파라미터 받기: 개별 변수 대신 DTO 상자로 묶어서 한 번에 받는다.
	public boolean insertBoard(HkDto dto) {
		int count=0; // DB에서 실제 추가/변경된 행(Row)의 개수를 저장할 변수

		// 글 번호(seq)는 자동 증가(NULL), 작성일은 현재 시스템 시간(SYSDATE())을 대입
		// 사용자가 입력한 아이디, 제목, 내용은 아직 모르므로 물음표(?)로 빈자리를 둠
		String sql = " INSERT INTO HKBOARD "
				+ " VALUES(NULL,?,?,?,SYSDATE()) ";

		try(Connection conn = getConnection(); // 부모로부터 연결 통로 확보
			PreparedStatement psmt = conn.prepareStatement(sql); // 쿼리문 준비
				){
			// 쿼리에 파라미터 채우기: ?,?,? <--- HkDto(id,title,content)
			// 물음표 순서(1번, 2번, 3번)에 맞게 넘어온 DTO 상자에서 값을 꺼내(getter) 채워 넣음
			psmt.setString(1, dto.getId());
			psmt.setString(2, dto.getTitle());
			psmt.setString(3, dto.getContent());

			// executeUpdate(): INSERT, UPDATE, DELETE 쿼리를 실행할 때 사용하며,
			// 실행 결과로 "영향을 받은 행의 개수"를 정수(int)로 반환합니다. (성공 시 1)
			count = psmt.executeUpdate(); //실행: 반환값은 수정된 행의 개수
		}catch (SQLException e) {
			e.printStackTrace();
		}

		// 1건 이상 반영되었다면(count > 0) 성공(true), 아니면 실패(false)를 반환
		return count>0?true:false;
	}

	//글 상세보기: 반환값 HkDto , 파라미터 SEQ
	public HkDto getBoard(int seq){
		HkDto dto = new HkDto();

		String sql = "SELECT SEQ, ID, TITLE, CONTENT, REGDATE FROM HKBOARD WHERE SEQ = ? ";

		try(Connection conn = getConnection(); // 2단계: 부모 클래스에서 연결 통로(conn)를 얻어옴
			PreparedStatement psmt = conn.prepareStatement(sql); // 3단계: DB에 보낼 쿼리문 준비
			){
			psmt.setInt(1, seq); // ? <-- seq
			try(ResultSet rs = psmt.executeQuery()){

				while(rs.next()) {
					dto.setSeq(rs.getInt(1));          // SEQ 컬럼의 정수값
					dto.setId(rs.getString(2));        // ID 컬럼의 문자열
					dto.setTitle(rs.getString(3));     // TITLE 컬럼의 문자열
					dto.setContent(rs.getString(4));   // CONTENT 컬럼의 문자열
					dto.setRegDate(rs.getDate(5));     // REGDATE 컬럼의 날짜값
					System.out.println(dto);
				}
			}
		} catch (SQLException e) {

			e.printStackTrace();
		}

		return dto;
	}

	public boolean updateBoard(HkDto dto) {
		int count=0; // DB에서 실제 추가/변경된 행(Row)의 개수를 저장할 변수

		// 글 번호(seq)는 자동 증가(NULL), 작성일은 현재 시스템 시간(SYSDATE())을 대입
		// 사용자가 입력한 아이디, 제목, 내용은 아직 모르므로 물음표(?)로 빈자리를 둠
		String sql = " UPDATE HKBOARD SET TITLE=?,CONTENT=?"
				+ " WHERE SEQ=? ";

		try(Connection conn = getConnection(); // 부모로부터 연결 통로 확보
			PreparedStatement psmt = conn.prepareStatement(sql); // 쿼리문 준비
				){

			psmt.setString(1, dto.getTitle());
			psmt.setString(2, dto.getContent());
			psmt.setInt(3, dto.getSeq());


			count = psmt.executeUpdate(); //실행: 반환값은 수정된 행의 개수
		}catch (SQLException e) {
			e.printStackTrace();
		}

		// 1건 이상 반영되었다면(count > 0) 성공(true), 아니면 실패(false)를 반환
		return count>0?true:false;
	}


	public boolean deleteBoard(HkDto dto) {
		int count=0;

		String sql = " DELETE FROM HKBOARD WHERE SEQ = ?";


		try(Connection conn = getConnection(); // 부모로부터 연결 통로 확보
			PreparedStatement psmt = conn.prepareStatement(sql); // 쿼리문 준비
				){


			psmt.setInt(1, dto.getSeq());


			count = psmt.executeUpdate(); //실행: 반환값은 수정된 행의 개수
		}catch (SQLException e) {
			e.printStackTrace();
		}

		// 1건 이상 반영되었다면(count > 0) 성공(true), 아니면 실패(false)를 반환
		return count>0?true:false;
	}

	//여러글 삭제하기: 파라미터는 seq[] , delete문(여러개)
	// --> Transaction 처리가 필요
	// --> delete,delete,delete --> 모두 성공해야 성공으로 처리
	// --> update, insert...
	public boolean mulDel(String[] seqs) {
		boolean isS = true;
		int[] count= null;// 쿼리 실행 개수 저장

		String sql = "DELETE FROM HKBOARD WHERE SEQ = ?";

		try(Connection conn=getConnection();){
			// 자동 commit 해제 --> rollback할 수 있음
			conn.setAutoCommit(false);

			try(PreparedStatement psmt=conn.prepareStatement(sql)){
				//batch작업: 동일한 쿼리에 ?만 달라지면서 실행개수가 변하는 작업
				for (int i = 0; i < seqs.length; i++) {
					psmt.setString(1, seqs[i]);//쿼리 하나 완성
					psmt.addBatch();//완성된 쿼리를 준비시켜줌
				}
				// delete from hkboard where seq in(1,2,3,5,7)

				count = psmt.executeBatch();//batch 실행 후 결과는 배열반환
				conn.commit();//DB에 반영
			}catch (SQLException e) {
				conn.rollback();// 오류가 나면 성공한 작업 되돌리기
				e.printStackTrace();
			}finally {
				//원래 설정으로 되돌리기
				conn.setAutoCommit(true);
			}
			// count[1,1,1,1,1] 각각의 쿼리가 성공하면 1
			if(count!=null) {
				for (int i = 0; i < count.length; i++) {
					if(count[i]!=1) {
						isS=false;
						break;
					}
				}
			}else {
				isS=false;
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			isS=false;
		}
		return isS;
	}
}
