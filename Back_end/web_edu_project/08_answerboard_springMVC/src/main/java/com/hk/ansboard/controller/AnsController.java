package com.hk.ansboard.controller;

import java.util.List;
import java.util.Map;

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
import com.hk.ansboard.util.Paging;

@Controller
public class AnsController {

//	@Autowired
	private AnsService ansService;
	
	public AnsController(AnsService ansService) {
		this.ansService=ansService;
	}
	
	//log 출력을 위한 선언: slf4j(로그출력할 준비작업), log4j(실제 출력 작업)
	private static final Logger logger=
		LoggerFactory.getLogger(AnsController.class);
	
	@RequestMapping(value = "/home.do",
			       method = RequestMethod.GET)
	public String home() {
		logger.info("HOME페이지로 이동");
		logger.debug("Working Directory:{}", System.getProperty("user.dir"));
		return "home";
	}
	
	@RequestMapping(value = "/boardList.do",
			       method = RequestMethod.GET)
	public String boardList(Model model, 
			               @RequestParam(value="pnum",
			               				 defaultValue = "1" //기본값 설정
//			                            ,required = false  //값을 반드시 요구하지 않음
			                            ) String pnum) {
	
//		int pCount=ansService.getPcount();
//		List<AnsDto>list=ansService.getAllList(pnum);
//
//		model.addAttribute("list", list);
//		model.addAttribute("pCount", pCount);
		//위 코드 작업을 AnsService에서 처리하자
		Map<String, Object>result=ansService.getBoardListWithPaging(pnum);
		
		model.addAllAttributes(result);
		model.addAttribute("pnum", pnum);//현재 페이지상태를 유지하기 위해 전달
		return "boardList";
	}
	
	@RequestMapping(value = "/boardInsertForm.do",
		           method = RequestMethod.GET)
	public String boardInsertForm(Model model,
								  @RequestParam("pnum") String pnum) {
		logger.info("글추가폼으로 이동");
		model.addAttribute("pnum", pnum);
		return "boardInsertForm";
	}
	
	@RequestMapping(value = "/boardInsert.do",
	           method = RequestMethod.POST)
	public String boardInsert(AnsDto dto) {
		logger.info("글추가하기");
		boolean isS=ansService.boardInsert(dto);
		if(isS) {
			return "redirect:boardList.do";			
		}else {
			return "error.jsp";
		}
	}
	
	//글 상세보기
	@RequestMapping(value = "/boardDetail.do",
			       method = RequestMethod.GET)
	public String boardDetail(@RequestParam("seq")int seq,
			                  @RequestParam(value="review",required = false)String review,
			                  @RequestParam("pnum") String pnum,
			                  Model model) {
		
		// y값이 있는 경우가 글목록에서 요청된 경우
		if(review!=null&&review.equals("y")) {
			ansService.readCount(seq);//조회수 올리기
			//한번요청에 2번 통신을 하게 되서 성능은 저하될 수 있음
			return "redirect:boardDetail.do?seq="+seq+"&pnum="+pnum;
		}else {
			AnsDto dto=ansService.boardDetail(seq);
			model.addAttribute("dto", dto);
			model.addAttribute("pnum", pnum);
			//객체 담아서 페이지로 이동하는 경우--> 페이지 이름만 써주면 됨
			return "boardDetail";
		}
		
	}
	//글 수정하기
	@RequestMapping(value = "/boardUpdate.do",
	           method = RequestMethod.POST)
	public String boardUpdate(AnsDto dto,
							  @RequestParam("pnum") String pnum) {
		logger.info("글수정하기");
		boolean isS=ansService.boardUpdate(dto);
		if(isS) {
			return "redirect:boardDetail.do?seq="+dto.getSeq()+"&pnum="+pnum;			
		}else {
			return "error.jsp";
		}
	}
	//글 삭제하기
	@RequestMapping(value = "/mulDel.do",
	           method = RequestMethod.POST)
	public String mulDel(@RequestParam("seq") String[] seq,
						 @RequestParam("pnum") String pnum) {
		logger.info("글삭제하기");
		boolean isS=ansService.mulDel(seq);
		if(isS) {
			return "redirect:boardList.do?pnum="+pnum;			
		}else {
			return "error.jsp";
		}
	}
	
	@RequestMapping(value = "/boardReply.do",
	               method = RequestMethod.POST)
	public String boardReply(AnsDto dto,
			                @RequestParam("pnum") String pnum) {
		logger.info("답글추가하기");
		boolean isS=ansService.boardReply(dto);
		if(isS) {
			return "redirect:boardList.do?pnum="+pnum;			
		}else {
			return "error.jsp";
		}
	}
	//환경설정 확인: root-context.xml, servlet-context.xml
}











