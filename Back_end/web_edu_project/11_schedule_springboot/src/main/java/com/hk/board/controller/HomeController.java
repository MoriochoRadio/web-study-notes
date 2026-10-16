package com.hk.board.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

// ===== 첫 화면 =====
// http://localhost:9090/ → templates/index.html ("일정보기" 링크 → /schedule/calendar)
// @Slf4j: Lombok 이 log 필드를 만들어 준다 → log.info(...) 로 콘솔에 기록
@Slf4j
@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        log.info("index페이지");
        // 뷰 이름 "index" → templates/index.html
        return "index";
    }

}
