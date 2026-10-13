package com.hk.board.controller;

import lombok.extern.slf4j.Slf4j;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartRequest;

import com.hk.board.command.DelBoardCommand;
import com.hk.board.command.InsertBoardCommand;
import com.hk.board.command.UpdateBoardCommand;
import com.hk.board.dtos.BoardDto;
import com.hk.board.dtos.FileBoardDto;
import com.hk.board.dtos.MemberDto;
import com.hk.board.service.BoardService;
import com.hk.board.service.FileService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Slf4j
@Controller
@RequestMapping(value = "/board")
@RequiredArgsConstructor
public class BoardController {

	private final BoardService boardService;
	private final FileService fileService;

	@GetMapping(value = "/boardList")
	public String boardList(Model model) {
		log.debug("글목록 보기");

		List<BoardDto> list = boardService.getAllList();
		model.addAttribute("list", list);
		model.addAttribute("delBoardCommand", new DelBoardCommand());
		return "board/boardList";// forward 기능, "redirect:board/boardList"
	}

	@GetMapping(value = "/boardInsert")
	public String boardInsertForm(Model model) {
		model.addAttribute("insertBoardCommand", new InsertBoardCommand());
		return "board/boardInsertForm";
	}

	@PostMapping(value = "/boardInsert")
	public String boardInsert(@Validated InsertBoardCommand insertBoardCommand, BindingResult result,
			HttpServletRequest request, Model model, HttpSession session) throws IllegalStateException, IOException {
		if (result.hasErrors()) {
			log.warn("글을 모두 입력하세요");
			return "board/boardInsertForm";
		}

		// 작성자는 화면의 숨은 값(id)을 믿지 않고, 로그인한 사람(세션)으로 덮어쓴다
		insertBoardCommand.setId(loginId(session));
		boardService.insertBoard(insertBoardCommand);
		return "redirect:/board/boardList";
	}

	// 상세보기
	@GetMapping(value = "/boardDetail")
	public String boardDetail(int board_seq, Model model) {
		BoardDto dto = boardService.getBoard(board_seq);

		// 유효값처리용
		model.addAttribute("updateBoardCommand", new UpdateBoardCommand());
		// 출력용
		model.addAttribute("dto", dto);
		log.debug("상세보기: {}", dto);
		return "board/boardDetail";
	}

	// 수정하기
	@PostMapping(value = "/boardUpdate")
	public String boardUpdate(
			@Validated UpdateBoardCommand updateBoardCommand, BindingResult result, Model model,
			HttpSession session) throws IllegalStateException, IOException {   // 첨부파일 저장 중 생길 수 있는 예외

		// 본인 글이 아니면 아무것도 하지 않고 목록으로
		if (!boardService.isWriter(updateBoardCommand.getBoard_seq(), loginId(session))) {
			log.warn("본인 글이 아닌데 수정 시도 - 로그인:{}, 글번호:{}", loginId(session), updateBoardCommand.getBoard_seq());
			return "redirect:/board/boardList";
		}

		if (result.hasErrors()) {
			log.warn("수정내용을 모두 입력하세요");
			// 코드 추가--------------------------------------------
			BoardDto dto = boardService.getBoard(updateBoardCommand.getBoard_seq());
			model.addAttribute("dto", dto);
			// --------------------------------------------------
			return "board/boardDetail";
		}

		boardService.updateBoard(updateBoardCommand);

		return "redirect:/board/boardDetail?board_seq="
				+ updateBoardCommand.getBoard_seq();
	}

	@GetMapping(value = "/download")
	public void download(int file_seq, HttpServletRequest request, HttpServletResponse response)
			throws UnsupportedEncodingException {

		FileBoardDto fdto = fileService.getFileInfo(file_seq);// 파일정보가져오기

		fileService.fileDownload(fdto.getOrigin_filename(), fdto.getStored_filename(), request, response);
	}

	@RequestMapping(value = "mulDel", method = { RequestMethod.POST, RequestMethod.GET })
	public String mulDel(@Validated DelBoardCommand delBoardCommand, BindingResult result, Model model,
			HttpSession session) {
		if (result.hasErrors()) {
			log.warn("최소하나 체크하기");
			List<BoardDto> list = boardService.getAllList();
			model.addAttribute("list", list);
			return "board/boardList";
		}
		String loginId = loginId(session);
		for (String seq : delBoardCommand.getSeq()) {
			if (!boardService.isWriter(Integer.parseInt(seq), loginId)) {
				log.warn("본인 글이 아닌데 삭제 시도 - 로그인:{}, 글번호:{}", loginId, seq);
				return "redirect:/board/boardList";
			}
		}
		boardService.mulDel(delBoardCommand.getSeq());
		log.info("글삭제함");
		return "redirect:/board/boardList";
	}

	// 세션에서 로그인한 사람의 id 꺼내기
	// (LoginInterceptor 가 /board/** 앞에서 로그인을 확인하므로 여기서는 항상 mdto 가 있다)
	private String loginId(HttpSession session) {
		MemberDto mdto = (MemberDto) session.getAttribute("mdto");
		return mdto.getId();
	}
}
