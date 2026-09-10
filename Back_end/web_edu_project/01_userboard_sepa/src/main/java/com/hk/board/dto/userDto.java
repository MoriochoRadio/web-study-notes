package com.hk.board.dto;
import java.io.Serializable;
import java.util.Date;
// Dto클래스 : 데이터를 저장하고 운반할때 사용하는 객체
// -구성 요소: 맴버필드, 생성자, getter/setter 메서드, toString메서드
// OOP개념 -> 은닉화 적용
// --> Lombok 라이브러리: 멤버필드만 작성하면 나머지 내용은 어노테이션(@~~)으로 정의만 하면된다

public class userDto implements Serializable{
	
	private String userId;
	private String name;
	private int birthYear;
	private String addr;
	private String mobile1;
	private String mobile2;
	private int height;
	private Date mDate; //java.util.Date
	
	
	public userDto() {
		// TODO Auto-generated constructor stub
	}
	
	//생성자 오버로딩: 원하는 멤버필드 초기화
	public userDto(String userId, String name, int birthYear, String addr, String mobile1, String mobile2, int height,
			Date mDate) {
		super();
		this.userId = userId;
		this.name = name;
		this.birthYear = birthYear;
		this.addr = addr;
		this.mobile1 = mobile1;
		this.mobile2 = mobile2;
		this.height = height;
		this.mDate = mDate;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getBirthYear() {
		return birthYear;
	}

	public void setBirthYear(int birthYear) {
		this.birthYear = birthYear;
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	public String getMobile1() {
		return mobile1;
	}

	public void setMobile1(String mobile1) {
		this.mobile1 = mobile1;
	}

	public String getMobile2() {
		return mobile2;
	}

	public void setMobile2(String mobile2) {
		this.mobile2 = mobile2;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public Date getmDate() {
		return mDate;
	}

	public void setmDate(Date mDate) {
		this.mDate = mDate;
	}

	//Object 클래스에 toString() 을 자식이 재정의하면 자식에서 구현된 toString()이 실행됨
	@Override
	public String toString() {
		return "userDto [userId=" + userId + ", name=" + name + ", birthYear=" + birthYear + ", addr=" + addr
				+ ", mobile1=" + mobile1 + ", mobile2=" + mobile2 + ", height=" + height + "]";
	}

	
	
}
