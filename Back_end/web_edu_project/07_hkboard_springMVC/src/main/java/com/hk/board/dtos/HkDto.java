package com.hk.board.dtos;

import java.util.Date;

public class HkDto {
	//은닉화: 중요한 데이터는 맴버필드에서 바로 접근 못하게 처리
	private int seq;
	private String id;
	private String title;
	private String content;
	private Date regDate;
	
	public HkDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	//맴버필드 전체 초기화용
	public HkDto(int seq, String id, String title, String content, Date regDate) {
		super();
		this.seq = seq;
		this.id = id;
		this.title = title;
		this.content = content;
		this.regDate = regDate;
	}

	//글추가용 초기화
	public HkDto(String id, String title, String content) {
		super();
		this.id = id;
		this.title = title;
		this.content = content;
	}

	//글수정용 초기화
	public HkDto(int seq, String title, String content) {
		super();
		this.seq = seq;
		this.title = title;
		this.content = content;
	}

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getRegDate() {
		return regDate;
	}

	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}

	//부모 클래스(Object)의 메서드를 자식이 재정의함
	// -> 다형성 개념: 부모의 메서드를 호출하면 자식이 불린다.
	@Override
	public String toString() {
		return "HkDto [seq=" + seq + ", id=" + id + ", title=" + title + ", content=" + content + ", regDate=" + regDate
				+ "]";
	}
}
