package com.hk.board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.hk.board.dtos.HkDto;
import com.hk.board.service.IHKService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class BoardController {
	
	@Autowired
	private IHKService hkService;
	
	@RequestMapping(value = "/home.do", method = RequestMethod.GET )
	public String home(Model model,
				   String param,//"param"이라는 이름의 값이 넘어오면
				   HkDto dto,// dto에 맴버필드명과 일치하는 값이 넘어오면
		           HttpServletRequest request) {
//		request.setAttribute("param", "파람");
		model.addAttribute("param", "파람");
//		String param=request.getParameter("param");
		return "home";//forward
}
	
	//메서드별로 url맵핑을 함
	@RequestMapping(value="/boardlist.do", method = RequestMethod.GET )
	public String boardList(Model model) {
		List<HkDto> list=hkService.getAllList();
		model.addAttribute("list", list);
		return "boardlist"; //forward 방식
		//return "redirect:boardlist.do"; //리다이렉트 방식
	}
	
	//boardlist.jsp와 BoardController.java
	@RequestMapping(value = "boardInsertForm.do", method = RequestMethod.GET)
	public String boardInsertForm() {
		return "boardInsertForm";
	}
	
	@RequestMapping(value = "/boardInsert.do", method = RequestMethod.POST)
	public String boardInsert(HkDto dto) {
		//파라미터: HkDto가 받아준다(id, title, content)
		boolean isS=hkService.insertBoard(dto);
		if(isS) {
			return "redirect:boardlist.do";
		}
		else {
			return "redirect:error.jsp";
		}
	}
	
	@RequestMapping(value = "/boardDetail.do", method = RequestMethod.GET)
	public String boardDetail(Model model, 
			//@RequestParam("seq") int seq) {
			HkDto pdto) {
		HkDto dto = hkService.getBoard(pdto.getSeq());
		model.addAttribute("dto", dto);
		return "boardDetail";
	}
	
	@RequestMapping(value = "/boardUpdate.do",
					method = RequestMethod.POST)
	public String boardUpdate(HkDto dto) {
		// 파라미터 seq, title, content -> HkDto가 받음
		boolean isS=hkService.updateBoard(dto);
		if(isS) {
			return "redirect:boardDetail.do?seq="+dto.getSeq();
		}else {
			return "redirect:error.jsp";
		}
		
	}
	
	//삭제기능: 글상세보기에서는 get요청
	// 글목록에서는 post요청
	//url패턴은 같으면서 로직을 다르게 처리할 경우
	@GetMapping("/mulDel2.do") 
	public String mulDelGet(){
		return "";
	}
	
	@PostMapping("/mulDel2.do")
	public String mulDelPost() {
		return "";
	}
	
	//삭제하는 기능은 post방식을 권장함
	// mulDel.do?seq=10 주소창에 노출되면 위험하다.
	//Spring6 에서는 파라미터 받을때 @RequestParam 명시하기
	@RequestMapping(value = "/mulDel.do", method = {RequestMethod.GET,RequestMethod.POST})
	public String mulDel(@RequestParam("seq")String[] seq) {
		boolean isS=hkService.mulDel(seq);
		if(isS) {
			return "redirect:boardlist.do";
		}else {
			return "redirect:error.jsp";
		}
		
	}
}
