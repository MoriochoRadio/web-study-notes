package com.hk.board.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.hk.board.datasource.DataBase;
import com.hk.board.dto.HkDto;

public class HkDao extends DataBase{

	//글목록 조회 기능: 반환(List) select문
	public List<HkDto> getAllList(){
		List<HkDto> list = new ArrayList<>();

		String sql= " SELECT SEQ, ID, TITLE, CONTENT, REGDATE "
				  + " FROM HKBOARD ORDER BY REGDATE DESC ";

		try(Connection conn=getConnection();//2단계
		    PreparedStatement psmt=conn.prepareStatement(sql);//3단계
			){
			try(ResultSet rs=psmt.executeQuery()){//4단계: 쿼리 실행
				//java <=== DB  : DB에 값들을 java에서 사용할 수 있게 처리
				//JS <=== Server : [json text]를 JS객체로 변환 처리
				//5단계:결과 받기
				while(rs.next()) {
					HkDto dto=new HkDto();
					dto.setSeq(rs.getInt(1));
					dto.setId(rs.getString(2));
					dto.setTitle(rs.getString(3));
					dto.setContent(rs.getString(4));
					dto.setRegDate(rs.getDate(5));
					list.add(dto);
//					System.out.println(dto);
				}
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return list;
	}

	//글 추가하기: 반환값(boolean) insert문
	// -> 파라미터 받기: DTO로 받는다.
	public boolean insertBoard(HkDto dto) {
		int count=0;

		String sql = " INSERT INTO HKBOARD "
				   + " VALUES(NULL,?,?,?,SYSDATE()) ";

		try(Connection conn=getConnection();
			PreparedStatement psmt = conn.prepareStatement(sql)
			){
			//쿼리에 파라미터 채우기: ?,?,? <--- HkDto(id,title,content)
			psmt.setString(1, dto.getId());
			psmt.setString(2, dto.getTitle());
			psmt.setString(3, dto.getContent());

			count = psmt.executeUpdate();//실행: 반환값은 수정된 행의 개수
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return count>0?true:false;
	}

	//글 상세보기: 반환값 HkDto , 파라미터 SEQ
	public HkDto getBoard(int seq){
		HkDto dto = new HkDto();

		String sql= " SELECT SEQ, ID, TITLE, CONTENT, REGDATE "
				  + " FROM HKBOARD "
				  + " WHERE SEQ = ? ";

		try(Connection conn=getConnection();//2단계
		    PreparedStatement psmt=conn.prepareStatement(sql);//3단계
			){

			psmt.setInt(1, seq);// ? <---seq

			try(ResultSet rs=psmt.executeQuery()){//4단계: 쿼리 실행
				//java <=== DB  : DB에 값들을 java에서 사용할 수 있게 처리
				//JS <=== Server : [json text]를 JS객체로 변환 처리
				//5단계:결과 받기
				while(rs.next()) {
					dto.setSeq(rs.getInt(1));
					dto.setId(rs.getString(2));
					dto.setTitle(rs.getString(3));
					dto.setContent(rs.getString(4));
					dto.setRegDate(rs.getDate(5));
					System.out.println(dto);
				}
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return dto;
	}

	//글 수정하기: 반환값(boolean) update문
	// -> 파라미터 받기: DTO로 받는다.
	public boolean updateBoard(HkDto dto) {
		int count=0;

		String sql = " UPDATE HKBOARD SET TITLE=?,CONTENT=? "
				   + " WHERE SEQ = ? ";

		try(Connection conn=getConnection();
			PreparedStatement psmt = conn.prepareStatement(sql)
			){
			//쿼리에 파라미터 채우기: ?,?,? <--- HkDto(seq,title,content)
			psmt.setString(1, dto.getTitle());
			psmt.setString(2, dto.getContent());
			psmt.setInt(3, dto.getSeq());

			count = psmt.executeUpdate();//실행: 반환값은 수정된 행의 개수
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return count>0?true:false;
	}

	//글 삭제하기: 반환값(boolean) delete문
	// -> 파라미터 받기: DTO로 받는다.
	public boolean deleteBoard(HkDto dto) {
		int count=0;

		String sql = "DELETE FROM HKBOARD WHERE SEQ = ?";

		try(Connection conn=getConnection();
			PreparedStatement psmt = conn.prepareStatement(sql)
			){
			//쿼리에 파라미터 채우기: ?,?,? <--- HkDto(seq,title,content)
			psmt.setInt(1, dto.getSeq());

			count = psmt.executeUpdate();//실행: 반환값은 수정된 행의 개수
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

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
