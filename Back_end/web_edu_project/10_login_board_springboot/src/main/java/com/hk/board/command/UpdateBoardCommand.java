package com.hk.board.command;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateBoardCommand {


	private int board_seq;
	@NotBlank(message = "제목을 입력하세요")
	private String title;
	@NotBlank(message = "내용을 입력하세요")
	private String content;

	// 수정할 때 새로 추가하는 첨부파일 (input 의 name="filename" 과 연결)
	private List<MultipartFile> filename;
	// 삭제하라고 체크한 첨부파일 번호들 (checkbox 의 name="delFileSeq" 와 연결, 체크 없으면 null)
	private int[] delFileSeq;

	public UpdateBoardCommand() {
		super();
		// TODO Auto-generated constructor stub
	}
	public UpdateBoardCommand(@NotNull int board_seq, @NotBlank(message = "제목을 입력하세요") String title,
			@NotBlank(message = "내용을 입력하세요") String content) {
		super();
		this.board_seq = board_seq;
		this.title = title;
		this.content = content;
	}
	public int getBoard_seq() {
		return board_seq;
	}
	public void setBoard_seq(int board_seq) {
		this.board_seq = board_seq;
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
	public List<MultipartFile> getFilename() {
		return filename;
	}
	public void setFilename(List<MultipartFile> filename) {
		this.filename = filename;
	}
	public int[] getDelFileSeq() {
		return delFileSeq;
	}
	public void setDelFileSeq(int[] delFileSeq) {
		this.delFileSeq = delFileSeq;
	}
	@Override
	public String toString() {
		return "UpdateBoardCommand [board_seq=" + board_seq + ", title=" + title + ", content=" + content + "]";
	}
	
}
