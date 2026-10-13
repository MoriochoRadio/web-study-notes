package com.hk.board.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.hk.board.dtos.FileBoardDto;

@Mapper
public interface FileMapper {
	
	//파일 정보 추가
	public boolean insertFileBoard(FileBoardDto dto);
	//파일 정보 조회
	public FileBoardDto getFileInfo(int file_seq);
	//파일 정보 삭제 (글 수정 시 첨부파일 개별 삭제) — XML 의 id="deleteFile" 과 이름이 같아야 함
	public boolean deleteFile(int file_seq);
}





