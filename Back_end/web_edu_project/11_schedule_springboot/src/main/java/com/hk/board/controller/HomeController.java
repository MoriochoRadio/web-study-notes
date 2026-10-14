package com.hk.board.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
@Controller 
public class HomeController {

    @GetMapping("/")
    public String home() {
        log.info("index페이지");
        return "index";
    }
    
}
