package com.hk.board.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hk.board.command.InsertCalCommand;
import com.hk.board.dtos.CalDto;
import com.hk.board.service.CalServiceImp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Slf4j 
@Controller 
@RequiredArgsConstructor 
@RequestMapping("/schedule")
public class CalController {

    private final CalServiceImp calService;

    @GetMapping("/calendar")
    public String calendar(Model model,String year, String month) {
        log.info("calendar페이지 요청");
        Map<String,Object>map=calService.makeCalendar(year, month);
        model.addAttribute("calMap", map);
        return "calboard/calendar";//응답할 페이지 이름
    }

    //일정추가폼 이동
    @GetMapping("/addcalboardform")
    public String addCalBoardForm(InsertCalCommand insertCalCommand,
                                  Model model) {
        log.info("일정추가폼이동");

        //입력폼 이동시 command객체를 보내야 된다.
        model.addAttribute("insertCalCommand", insertCalCommand);
        //현재시간 구하기
        model.addAttribute("now", LocalTime.now());
        return "calboard/addcalboardform";
    }
    
    //일정추가하기 
    @PostMapping("/addcalboard")
    public String addCalBoard(@Validated InsertCalCommand insertCalCommand, 
                              BindingResult result,
                              Model model,
                              RedirectAttributes redirectAttributes
                            ) {
        //유효값 처리 결과를 받아서 에러를 확인
        if(result.hasErrors()){
            log.info("일정을 모두 입력해야 됨");
            //시간의 대한 정보는 다시 보내줘야 함
            model.addAttribute("now", LocalTime.now());
            return "calboard/addcalboardform";
        }

        calService.insertCalBoard(insertCalCommand);
        
        //리다이렉트시 쿼리 스트링 자동 생성해주는 기능: ?year=2026&month=10
        redirectAttributes.addAttribute("year",insertCalCommand.getYear());
        redirectAttributes.addAttribute("month",insertCalCommand.getMonth());
        return "redirect:/schedule/calendar";
    }
    
    //과제
    //일정 목록 조회
    // 받을 파라미터: year, month, date
    // 응답페이지: calboardlist.html
    // 요청 예: /schedule/calboardlist?year=2026&month=10&date=14  (달력의 날짜 숫자를 누르면 이 주소로 온다)
    @GetMapping("/calboardlist")
    public String calBoardList(String year, String month, String date,
                               @RequestParam(defaultValue = "hk") String id,
                               Model model) {
        log.info("일정목록 요청: {}년 {}월 {}일", year, month, date);

        // 주소창에 값 없이 들어오면(null) 오늘 날짜로 — 화면 제목과 조회가 같은 날짜를 쓰도록 여기서 채운다
        LocalDate today = LocalDate.now();
        if (year == null)  year  = today.getYear() + "";
        if (month == null) month = today.getMonthValue() + "";
        if (date == null)  date  = today.getDayOfMonth() + "";

        // 아직 로그인 기능이 없어서 "누구의 일정"인지 정할 방법이 없다.
        // --> id 파라미터가 없으면 수업에서 쓰는 아이디 "hk"로 조회한다 (로그인이 붙으면 세션의 아이디로 바꾸면 된다)
        List<CalDto> list = calService.calBoardList(id, year, month, date);

        model.addAttribute("list", list);
        // 화면 제목과 "달력으로 돌아가기"·"일정 추가" 링크에 쓰려고 날짜도 같이 보낸다
        model.addAttribute("year", year);
        model.addAttribute("month", month);
        model.addAttribute("date", date);
        model.addAttribute("id", id);
        return "calboard/calboardlist";
    }
}
