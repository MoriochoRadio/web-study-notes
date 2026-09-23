package com.hk.board.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.hk.board.dtos.HkDto;
import com.hk.board.service.IHKService;

@Controller
public class BoardController {
	
	@Autowired
	private IHKService hkService;
	
	@RequestMapping(value="/boardlist.do", method = RequestMethod.GET )
	public String boardList(Model model) {
		List<HkDto> list=hkService.getAllList();
		model.addAttribute("list", list);
		return "boardlist"; //forward 방식
		//return "redirect:boardlist.do"; //리다이렉트 방식
	}
}
