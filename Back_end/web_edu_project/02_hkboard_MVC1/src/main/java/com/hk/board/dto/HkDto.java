package com.hk.board.dto;

import java.util.Date;

// DTO(Data Transfer Object): DB 테이블(hkboard)의 행(Row) 데이터를 자바 객체 형태로 안전하게 담아 나르는 상자입니다.
public class HkDto {
	
	// [은닉화 (Encapsulation)]
	// DB 컬럼과 1:1로 매핑되는 변수들입니다.
	// 외부에서 마음대로 값을 조작하지 못하도록 private으로 접근을 제한합니다.
	private int seq;        // 글 번호 (DB: AUTO_INCREMENT 기본키)
	private String id;      // 작성자 아이디
	private String title;   // 글 제목
	private String content; // 글 내용
	private Date regDate;   // 등록일 (DB: regdate)
	
	// 기본 생성자: 아무런 값 없이 빈 상자를 만들 때 사용합니다.
	public HkDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	// [멤버필드 전체 초기화 생성자]
	// DB에서 한 행(모든 컬럼)의 데이터를 전부 조회해와서 상자에 한 번에 담을 때 사용합니다.
	public HkDto(int seq, String id, String title, String content, Date regDate) {
		super();
		this.seq = seq;
		this.id = id;
		this.title = title;
		this.content = content;
		this.regDate = regDate;
	}
	
	// [글추가용 생성자]
	// 글을 새로 쓸 때는 글 번호(seq)는 DB가 자동 생성하고, 작성일(regdate)은 DB의 SYSDATE()로 들어가므로
	// 사용자에게 입력받는 id, title, content 세 가지만 상자에 넣을 때 사용합니다.
	public HkDto(String id, String title, String content) {
		super();
		this.id = id;
		this.title = title;
		this.content = content;
	}

	// [글수정용 생성자]
	// 글을 수정할 때는 "몇 번 글(seq)"의 "제목(title)"과 "내용(content)"을 고칠 것인지 지정할 때 사용합니다.
	public HkDto(int seq, String title, String content) {
		super();
		this.seq = seq;
		this.title = title;
		this.content = content;
	}

	// [Getter / Setter]
	// private으로 잠긴 변수들을 외부에서 안전하게 읽어오고(get), 세팅(set)하기 위한 문지기 메서드들입니다.
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

	// [toString 재정의]
	// System.out.println(dto)로 찍었을 때 주소값이 아니라 상자 안에 든 실제 내용물이 보이도록 재정의(Override)합니다.
	@Override
	public String toString() {
		return "HkDto [seq=" + seq + ", id=" + id + ", title=" + title + ", content=" + content + ", regDate=" + regDate
				+ "]";
	}
	
}