package com.hk.board.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hk.board.dtos.HkDto;
import com.hk.board.service.HkService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@Controller
@RequestMapping(value = "/thboard") // 컨트롤러 단위로 url맵핑설정가능
public class HkController {

    private final HkService hkServiceImp;

    // client에서 /thboard/boardlist 요청해야함
    @GetMapping("/boardlist")
    public String boardList(Model model) {
        List<HkDto> list = hkServiceImp.getAllList();
        model.addAttribute("list", list);
        return "boardlist";
    }

    @GetMapping("/insertboardform")
    public String insertboardform(Model model) {

        return "/insertboardform";
    }

    @PostMapping("/insertboard")
    public String insertboard(Model model, HkDto dto) {
        System.out.println(dto);
        boolean isS = hkServiceImp.insertBoard(dto);
        if (isS) {
            return "redirect:/thboard/boardlist";
        } else {
            return "error";
        }
    }

    @GetMapping("/boarddetail")
    public String boarddetail(Model model, int seq) {
        HkDto dto = hkServiceImp.getBoard(seq);
        model.addAttribute("dto", dto);
        return "/boarddetail";
    }

    @GetMapping("/boardupdateform")
    public String boardupdateform(@RequestParam(value = "seq") int param, Model model) {

        HkDto dto = hkServiceImp.getBoard(param);
        model.addAttribute("dto", dto);

        return "/boardupdateform";
    }

    @PostMapping("/boardupdate")
    public String boardupdate(HkDto dto) {

        boolean isS = hkServiceImp.updateBoard(dto);
        if (isS) {
            return "redirect:/thboard/boarddetail?seq=" + dto.getSeq();
        } else {
            return "error";
        }
    }

    // @PostMapping("/muldel")
    @RequestMapping(value = "/muldel") // get,post 전송방식 모두처리
    public String muldel(String[] chk) {

        boolean isS = hkServiceImp.mulDel(chk);
        if (isS) {
            return "redirect:/thboard/boardlist";
        } else {
            return "error";
        }

    }

}