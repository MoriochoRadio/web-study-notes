package com.hk.board.datasource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// JDBC 1단계와 2단계(DB 연결 통로 만들기)를 전담하는 부모 클래스입니다.
// 이렇게 분리해 두면 여러 DAO에서 공통으로 상속받아 재사용할 수 있습니다.
public class DataBase {

	// [1단계: DB 드라이버 로딩]
	// 객체가 생성(new)될 때 기본 생성자가 가장 먼저 실행됩니다.
	public DataBase() {
		try {
			// 자바에게 "우리는 MariaDB를 사용할 것이니 전용 통역사(드라이버)를 메모리에 올려라"라고 지시합니다.
			Class.forName("org.mariadb.jdbc.Driver");
			System.out.println("1단계: 드라이버 로딩 성공 (MariaDB 통역사 준비 완료)");
		} catch (ClassNotFoundException e) {
			// 빌드 경로(Build Path)나 pom.xml에 드라이버 라이브러리(.jar)가 없으면 예외가 발생합니다.
			System.out.println("1단계: 드라이버 로딩 실패 (라이브러리 jar 파일이 누락되었는지 확인하세요)");
			e.printStackTrace();
		}
	}
	
	// [2단계: DB와의 연결 통로(Connection) 개설]
	// DB 주소, 계정, 비밀번호를 인증받아 실제 데이터가 오고 갈 파이프라인(Connection)을 반환합니다.
	public Connection getConnection() throws SQLException {
		Connection conn = null;
		
		// 접속할 DB 경로 (내 컴퓨터 localhost:3306 포트의 hk 데이터베이스)
		String url = "jdbc:mariadb://localhost:3306/hk";
		String user = System.getenv().getOrDefault("STUDY_DB_USER", "study");                            // 관리자 아이디
		// 공개 저장소에 올리면서 실제 값을 뺐다. 내 환경의 비밀번호를 넣고 쓸 것.
		// (어제와 달리 이 값을 고칠 곳이 딱 한 군데다 — DataBase 부모 클래스로
		//  묶어 둔 덕분이다.)
		String password = System.getenv("STUDY_DB_PASSWORD");                            // ← 여기에 DB 비밀번호
		
		// 실제 DB 서버와 네트워크로 악수(Handshake)하여 연결 고리를 만듭니다.
		conn = DriverManager.getConnection(url, user, password);
		
		return conn; // 연결된 통로 객체를 호출한 곳(DAO)으로 전달
	}
	
}