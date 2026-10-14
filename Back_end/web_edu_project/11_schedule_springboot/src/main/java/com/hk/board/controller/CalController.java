package com.hk.board.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hk.board.service.CalServiceImp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class CalController {
    private final CalServiceImp calService;

    @GetMapping("/calendar")
    public String calendar(Model model, String year, String month) {
        log.info("calendar페이지 요청");
        Map<String, Object> map = calService.makeCalendar(year, month);

        model.addAttribute("calMap", map);

        return "calboard/calendar"; // 응답할 페이지 이름
    }

}
