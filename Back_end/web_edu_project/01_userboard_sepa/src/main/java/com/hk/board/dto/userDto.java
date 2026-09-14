package com.hk.board.dto;

import java.io.Serializable;
import java.util.Date;

/**
 * [ DTO (Data Transfer Object) ]
 * - 역할: 데이터베이스(DB)의 한 행(Row) 데이터를 통째로 담아 화면이나 서버 로직으로 나르는 '택배 상자'입니다.
 * - 특징: 계산이나 비즈니스 로직은 전혀 없고, 오직 '순수 데이터'와 데이터를 넣고 빼는 메서드만 가집니다.
 *
 * [ Serializable (직렬화 인터페이스) ]
 * - 객체를 네트워크를 통해 다른 서버로 전송하거나, 파일/세션에 저장하기 위해 '바이트 형태(0과 1의 줄)'로 변환할 수 있도록 허용하는 표시(마커)입니다.
 */
public class userDto implements Serializable {
	
	// =========================================================================
	// [ 1. 멤버 필드 (Member Fields / 속성) ]
	// =========================================================================
	// DB의 USERTBL 테이블에 있는 컬럼(열)들과 1:1로 매칭되는 변수들입니다.
	// [은닉화(Encapsulation)]: 변수 앞에 'private'을 붙여 외부에서 함부로 직접 수정하지 못하게 안전하게 잠급니다.
	
	private String userId;   // 회원 아이디 (DB: USERID, 문자열)
	private String name;     // 회원 이름 (DB: NAME, 문자열)
	private int birthYear;   // 출생년도 (DB: BIRTHYEAR, 정수 숫자)
	private String addr;     // 주소 (DB: ADDR, 문자열)
	private String mobile1;  // 전화번호 앞자리 (DB: MOBILE1, 예: "010")
	private String mobile2;  // 전화번호 뒷자리 (DB: MOBILE2, 예: "12345678")
	private int height;      // 키 (DB: HEIGHT, 정수 숫자)
	private Date mDate;      // 가입일 (DB: MDATE, 날짜형 java.util.Date)
	
	
	// =========================================================================
	// [ 2. 기본 생성자 (Default Constructor) ]
	// =========================================================================
	// new userDto() 처럼 빈 상자를 먼저 만들고 나중에 setter로 값을 하나씩 채워 넣을 때 필요합니다.
	// 프레임워크(Spring, MyBatis 등)가 객체를 자동으로 만들어줄 때도 기본 생성자가 필수로 쓰입니다.
	public userDto() {
		// 내용이 비어있는 기본 생성자
	}
	
	
	// =========================================================================
	// [ 3. 생성자 오버로딩 (Constructor Overloading) ]
	// =========================================================================
	// 상자를 만듦과 동시에 8가지 회원 정보를 한 번에 채워 넣고 싶을 때 사용하는 생성자입니다.
	// 'this.변수명'은 위에서 선언한 클래스의 private 멤버 필드를 가리킵니다.
	public userDto(String userId, String name, int birthYear, String addr, String mobile1, String mobile2, int height,
			Date mDate) {
		super(); // 부모 클래스인 Object의 기본 생성자 호출
		this.userId = userId;
		this.name = name;
		this.birthYear = birthYear;
		this.addr = addr;
		this.mobile1 = mobile1;
		this.mobile2 = mobile2;
		this.height = height;
		this.mDate = mDate;
	}

	public userDto(String userId, String addr, String mobile1, String mobile2, int height) {
		super();
		this.userId = userId;
		this.addr = addr;
		this.mobile1 = mobile1;
		this.mobile2 = mobile2;
		this.height = height;
	}
	
	
	// =========================================================================
	// [ 4. Getter & Setter 메서드 ]
	// =========================================================================
	// 멤버 변수가 private으로 잠겨있기 때문에, 안전한 전용 출입구를 제공합니다.
	// - Getter: 상자에서 데이터를 '꺼내올 때' 쓰는 메서드 (읽기 전용 창구)
	// - Setter: 상자에 데이터를 '집어넣을 때' 쓰는 메서드 (쓰기 전용 창구)

	// 아이디 꺼내기 / 넣기
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	// 이름 꺼내기 / 넣기
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// 출생년도 꺼내기 / 넣기
	public int getBirthYear() {
		return birthYear;
	}

	public void setBirthYear(int birthYear) {
		this.birthYear = birthYear;
	}

	// 주소 꺼내기 / 넣기
	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	// 전화번호 앞자리 꺼내기 / 넣기
	public String getMobile1() {
		return mobile1;
	}

	public void setMobile1(String mobile1) {
		this.mobile1 = mobile1;
	}

	// 전화번호 뒷자리 꺼내기 / 넣기
	public String getMobile2() {
		return mobile2;
	}

	public void setMobile2(String mobile2) {
		this.mobile2 = mobile2;
	}

	// 키 꺼내기 / 넣기
	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	// 가입일 꺼내기 / 넣기
	public Date getmDate() {
		return mDate;
	}

	public void setmDate(Date mDate) {
		this.mDate = mDate;
	}

	
	// =========================================================================
	// [ 5. toString() 메서드 재정의 (Overriding) ]
	// =========================================================================
	// - 기본 동작: System.out.println(dto)를 찍으면 원래 메모리 주소값(com.hk.board.dto.userDto@3b192d32)이 나옵니다.
	// - 재정의 이유: 콘솔에서 상자 안에 든 실제 값들을 한눈에 확인(디버깅)하기 위해 글자 형태로 예쁘게 출력되도록 덮어씌운 것입니다.
	// * 참고: 현재 mDate는 문자열 조합에서 누락되어 있으니 필요하다면 ", mDate=" + mDate 를 뒤에 붙여주면 함께 출력됩니다.
	@Override
	public String toString() {
		return "userDto [userId=" + userId + ", name=" + name + ", birthYear=" + birthYear + ", addr=" + addr
				+ ", mobile1=" + mobile1 + ", mobile2=" + mobile2 + ", height=" + height + "]";
	}

}