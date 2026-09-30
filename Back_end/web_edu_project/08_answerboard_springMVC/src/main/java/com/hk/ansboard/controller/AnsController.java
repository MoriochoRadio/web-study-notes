package com.hk.ansboard.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.hk.ansboard.dtos.AnsDto;
import com.hk.ansboard.service.AnsService;

@Controller
public class AnsController {
	
	@Autowired
	private AnsService ansService;
	
	//log출력을 위한 선언: slf4j(로그출력할 준비작업), log4j(실제 출력작업)
	private static final Logger logger = LoggerFactory.getLogger(AnsController.class);
	
	
	@RequestMapping(value = "/home.do", method = RequestMethod.GET)
	public String home() {
		logger.info("HOME페이지로 이동");
		logger.debug("Working Directory:{}", System.getProperty("user.dir"));
		return "home";
	}
	
	@RequestMapping(value = "/boardList.do", method = RequestMethod.GET)
	public String boardList(Model model, @RequestParam(value="pnum",defaultValue = "1")
						//,required = false) //값을 반드시 요구하지 않음
	String pnum) {
//		if(pnum==null||pnum=="") {
//			pnum="1";
//		}
	
		List<AnsDto>list=ansService.getAllList(pnum);
		model.addAttribute("list",list);
		return "boardList";
	}
	
	@RequestMapping(value = "/boardInsertForm.do", method = RequestMethod.GET)
	public String boardInsertForm() {
		logger.info("글추가폼으로 이동");
		return "boardInsertForm";
	}
	
	@RequestMapping(value = "/boardInsert.do", method = RequestMethod.POST)
	public String boardInsert(AnsDto dto) {
		logger.info("글추가하기");
		boolean isS=ansService.boardInsert(dto);
		if(isS) {
			return "redirect:boardList.do";
		} else {
			return "error.jsp";
		}
		
	}
	
	//글 상세보기
	@RequestMapping(value = "/boardDetail.do", method = RequestMethod.GET)
	public String boardDetail(@RequestParam("seq")int seq,
			@RequestParam(value="review",required = false)String review ,Model model) {
		
		// y값이 있는 경우가 글목록에서 요청된 경우
		if(review!=null&&review.equals("y")) {
			ansService.readCount(seq);//조회수 올리기
			//한번요청에 2번 통신을 하게 되어 성능은 저하될 수 있음
			return "redirect:boardDetail.do?seq="+seq;
		} else {
			AnsDto dto = ansService.boardDetail(seq);
			model.addAttribute("dto",dto);
			
			//객체 담아서 페이지로 이동하는 경우 --> 페이지 이름만 써주면 됨
			return "boardDetail";
		}
		
		
		
	}
	//글 수정하기
	@RequestMapping(value = "/boardUpdate.do", method = RequestMethod.POST)
	public String boardUpdate(AnsDto dto) {
		logger.info("글수정하기");
		boolean isS=ansService.boardUpdate(dto);
		if(isS) {
			return "redirect:boardDetail.do?seq="+dto.getSeq();
		} else {
			return "error.jsp";
		}
		
	}
	
	
	//글 삭제하기
	@RequestMapping(value = "/mulDel.do", method = RequestMethod.POST)
	public String mulDel(@RequestParam("seq") String[] seq) {
		logger.info("글삭제하기");
		boolean isS=ansService.mulDel(seq);
		if(isS) {
			return "redirect:boardList.do";
		} else {
			return "error.jsp";
		}
		
	}
}
