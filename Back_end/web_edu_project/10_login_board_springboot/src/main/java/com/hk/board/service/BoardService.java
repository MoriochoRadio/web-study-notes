package com.hk.board.service;

import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hk.board.command.InsertBoardCommand;
import com.hk.board.command.UpdateBoardCommand;
import com.hk.board.dtos.BoardDto;
import com.hk.board.dtos.FileBoardDto;
import com.hk.board.mapper.BoardMapper;
import com.hk.board.mapper.FileMapper;

import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardService {

	private final BoardMapper boardMapper;
	private final FileMapper fileMapper;
	private final FileService fileService;

	// 첨부파일 저장 폴더 — application.properties 의 file.upload-dir 값
	// (@Value 필드에는 final 을 붙이지 않는다: Lombok 이 만든 생성자로 @Value 가 따라가지 않음)
	@Value("${file.upload-dir}")
	private String uploadDir;

	// 글목록 조회
	public List<BoardDto> getAllList() {
		return boardMapper.getAllList();
	}

	// 글 추가, 파일업로드및 파일정보 추가
	@Transactional(rollbackFor = Exception.class)
	public void insertBoard(InsertBoardCommand insertBoardCommand)
			throws IllegalStateException, IOException {
		// command:UI -> dto:DB 데이터 옮겨담기
		BoardDto boardDto = new BoardDto();
		boardDto.setId(insertBoardCommand.getId());
		boardDto.setTitle(insertBoardCommand.getTitle());
		boardDto.setContent(insertBoardCommand.getContent());

		// 새글을 추가할때 파라미터로 전달된 boardDto객체에 자동으로,
		// 증가된 board_seq값이 저장
		boardMapper.insertBoard(boardDto);// 새글 추가

		// 첨부파일 저장 + 파일정보 추가 (수정하기에서도 같은 코드를 쓰므로 saveFiles 로 분리함)
		saveFiles(boardDto.getBoard_seq(), insertBoardCommand.getFilename());
	}

	// 상세내용조회
	public BoardDto getBoard(int board_seq) {
		return boardMapper.getBoard(board_seq);
	}

	// 글 작성자 본인인지 확인 (권한 검증)
	// --> 화면에서 버튼을 숨겨도, 주소나 숨은 값을 직접 보내면 우회되므로 서버에서 반드시 확인한다
	public boolean isWriter(int board_seq, String loginId) {
		BoardDto dto = boardMapper.getBoard(board_seq);
		// 글이 없거나(null) 작성자가 다르면 false. 문자열 비교는 == 가 아니라 equals()
		return dto != null && dto.getId() != null && dto.getId().equals(loginId);
	}

	// 수정하기: 제목·내용 수정 + 체크한 첨부파일 삭제 + 새 첨부파일 추가
	// --> 셋 중 하나라도 실패하면 전부 되돌린다(@Transactional)
	@Transactional(rollbackFor = Exception.class)
	public boolean updateBoard(UpdateBoardCommand updateBoardCommand)
			throws IllegalStateException, IOException {
		int board_seq = updateBoardCommand.getBoard_seq();

		// 1) 제목·내용 수정 — command:UI ---> DTO:DB (기존 코드)
		BoardDto dto = new BoardDto();
		dto.setBoard_seq(board_seq);
		dto.setTitle(updateBoardCommand.getTitle());
		dto.setContent(updateBoardCommand.getContent());
		boolean isS = boardMapper.updateBoard(dto);

		// 2) 삭제하라고 체크한 첨부파일: DB 기록만 먼저 지운다
		//    (실제 파일은 맨 마지막에 지운다 → 중간에 실패해서 되돌아가도 파일이 남아 있도록)
		List<String> filesToDelete = new ArrayList<>();
		if (updateBoardCommand.getDelFileSeq() != null) {
			for (int file_seq : updateBoardCommand.getDelFileSeq()) {
				FileBoardDto fdto = fileMapper.getFileInfo(file_seq);
				// 이 글의 첨부파일이 맞는지 확인 — 남의 글 파일 번호를 끼워 넣는 것 방지 (4단계와 같은 원리)
				// 예외를 던지면 @Transactional 이 위 1)의 제목·내용 수정까지 전부 되돌린다
				if (fdto == null || fdto.getBoard_seq() != board_seq) {
					log.warn("이 글의 첨부파일이 아닌데 삭제 시도 - 글번호:{}, 파일번호:{}", board_seq, file_seq);
					throw new IllegalArgumentException("이 글의 첨부파일이 아닙니다.");
				}
				fileMapper.deleteFile(file_seq);
				filesToDelete.add(fdto.getStored_filename());
			}
		}

		// 3) 새로 고른 첨부파일 추가 (글쓰기와 같은 코드)
		saveFiles(board_seq, updateBoardCommand.getFilename());

		// 4) DB 작업이 모두 끝난 뒤에 실제 파일 삭제
		for (String stored : filesToDelete) {
			File file = new File(uploadDir + "/" + stored);
			if (file.exists() && !file.delete()) {
				log.warn("첨부파일 삭제 실패: {}", file);
			}
		}
		log.info("글 수정 - 글번호:{}, 삭제한 파일:{}개", board_seq, filesToDelete.size());
		return isS;
	}

	public boolean mulDel(String[] seqs) {
		return boardMapper.mulDel(seqs);
	}

	// 첨부파일을 디스크에 저장하고 DB(FILEINFO)에 기록한다 — 글쓰기·수정 공통
	private void saveFiles(int board_seq, List<MultipartFile> files)
			throws IllegalStateException, IOException {
		// form에 <input type="file"/> 전송
		// --> form에 의해 전송될 경우에는 파일이 실제 없어도 file 0개, 크기가 0byte내용으로
		// 한개 전송됨. 그래서 null 과 "빈 파일 1개" 를 둘 다 확인한다
		boolean hasFiles = files != null && !files.isEmpty() && !files.get(0).isEmpty();
		log.debug("파일첨부여부: {}", hasFiles);
		if (!hasFiles) {
			return;
		}

		// 파일 저장경로 (application.properties 의 file.upload-dir)
		String filepath = uploadDir + "/";
		// 없으면 디렉토리 생성
		File dir = new File(filepath);
		if (!dir.exists())
			dir.mkdirs();
		log.debug("파일저장경로: {}", filepath);

		// 파일업로드 작업은 FileService쪽에서 업로드하고 업로드된 파일정보 반환
		List<FileBoardDto> uploadFileList = fileService.uploadFiles(filepath, files);

		// 파일정보를 DB에 추가 (board_seq 로 어느 글의 파일인지 연결)
		try {
			for (FileBoardDto fDto : uploadFileList) {
				fileMapper.insertFileBoard(
						new FileBoardDto(0, board_seq,
								fDto.getOrigin_filename(),
								fDto.getStored_filename()));
			}
		} catch (Exception e) {
			// DB 저장에 실패하면 디스크에 저장한 파일 삭제
			// --> 트랜젝션은 DB에 대해서만 처리됨 그래서 따로 삭제 처리
			for (FileBoardDto fDto : uploadFileList) {
				new File(filepath + fDto.getStored_filename()).delete();
			}
			throw e; // 다시 던져야 트랜잭션이 롤백됨
		}
	}
}
