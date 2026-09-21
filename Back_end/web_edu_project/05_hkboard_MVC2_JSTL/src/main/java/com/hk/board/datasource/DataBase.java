package com.hk.board.datasource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

//JDBC 1단계,2단계 분리
public class DataBase {

	public DataBase() {
		try {
			Class.forName("org.mariadb.jdbc.Driver");
			System.out.println("1단계:드라이버 로딩 성공");
		} catch (ClassNotFoundException e) {
			System.out.println("1단계:드라이버 로딩 실패");
			e.printStackTrace();
		}
	}

	//2단계: DB연결을 위한 Connection 객체 얻어오기
	public Connection getConnection() throws SQLException {
		Connection conn=null;
		//DB 연결을 위한 정보 정의
		String url = System.getenv().getOrDefault("STUDY_DB_URL", "jdbc:mariadb://127.0.0.1:3306/hk");
		String user = System.getenv().getOrDefault("STUDY_DB_USER", "study");
		//getenv("이름")은 "값"이 아니라 "환경변수 이름"으로 찾는다
		// -> 여기에 비밀번호 '값'을 적으면 그 이름의 환경변수를 찾는 것이라 항상 null이 된다
		//비밀번호는 저장소에 올리지 않고 환경변수로 받는다
		// -> 내 PC에서만 쓸 거라면 getOrDefault("STUDY_DB_PASSWORD","비밀번호")로 기본값을 줄 수 있다
		//    (공개 저장소에 올릴 코드에는 절대 적지 말 것)
		String password = System.getenv("STUDY_DB_PASSWORD");

		conn=DriverManager.getConnection(url, user, password);

		return conn;
	}

	//SQLException을 알아보기 쉽게 콘솔에 출력
	// -> e.printStackTrace()만 하면 스택만 잔뜩 나오고
	//    "접속 실패인지 / SQL 문법 오류인지 / 제약조건 위반인지"가 한눈에 안 들어온다
	// -> SQLState와 벤더 오류코드까지 같이 찍어주면 원인 파악이 빨라진다
	//    예) SQLState=28000 -> 계정/비밀번호 문제, 42S02 -> 테이블 없음
	protected void printSqlError(String step, SQLException e) {
		System.err.println("[DB오류] " + step
				         + " | SQLState=" + e.getSQLState()
				         + " | 오류코드=" + e.getErrorCode()
				         + " | " + e.getMessage());
		e.printStackTrace();
	}

}
