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
		String password = System.getenv("STUDY_DB_PASSWORD");

		conn=DriverManager.getConnection(url, user, password);

		return conn;
	}


}
