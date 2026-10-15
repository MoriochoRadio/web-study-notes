package com.hk.board.controller;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hk.board.command.DeleteCalCommand;
import com.hk.board.command.InsertCalCommand;
import com.hk.board.command.UpdateCalCommand;
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
    private final ModelMapper modelMapper;

    @GetMapping("/calendar")
    public String calendar(Model model, String year, String month) {
        log.info("calendar페이지 요청");
        Map<String, Object> map = calService.makeCalendar(year, month);
        model.addAttribute("calMap", map);
        return "calboard/calendar";// 응답할 페이지 이름
    }

    // 일정추가폼 이동
    @GetMapping("/addcalboardform")
    public String addCalBoardForm(InsertCalCommand insertCalCommand,
            Model model) {
        log.info("일정추가폼이동");

        // 입력폼 이동시 command객체를 보내야 된다.
        model.addAttribute("insertCalCommand", insertCalCommand);
        // 현재시간 구하기
        model.addAttribute("now", LocalTime.now());
        return "calboard/addcalboardform";
    }

    // 일정추가하기
    @PostMapping("/addcalboard")
    public String addCalBoard(@Validated InsertCalCommand insertCalCommand,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes) {
        // 유효값 처리 결과를 받아서 에러를 확인
        if (result.hasErrors()) {
            log.info("일정을 모두 입력해야 됨");
            // 시간의 대한 정보는 다시 보내줘야 함
            model.addAttribute("now", LocalTime.now());
            return "calboard/addcalboardform";
        }

        calService.insertCalBoard(insertCalCommand);

        // 리다이렉트시 쿼리 스트링 자동 생성해주는 기능: ?year=2026&month=10
        redirectAttributes.addAttribute("year", insertCalCommand.getYear());
        redirectAttributes.addAttribute("month", insertCalCommand.getMonth());
        return "redirect:/schedule/calendar";
    }

    // 과제
    // 일정 목록 조회
    // 받을 파라미터: year, month, date
    // 응답페이지: calboardlist.html
    @GetMapping("/calboardlist")
    public String calBoardList(@RequestParam Map<String, String> map,
            Model model) {
        // 일정목록 페이지에서 유효값처리 결과를 출력하는 기능을 실행중이라
        // deleteCalCommand 객체를 무조건 보내줘야 한다.
        model.addAttribute("deleteCalCommand", new DeleteCalCommand());
        String id = "hk";// 로그인 기능이 있을 경우 세션으로부터 가져온다
        List<CalDto> list = calService.calBoardList(id, map);
        model.addAttribute("list", list);
        return "calboard/calboardlist";
    }

    @PostMapping("/calmuldel")
    public String calMulDel(@Validated DeleteCalCommand deleteCalCommand,
            BindingResult result,
            Model model,
            @RequestParam Map<String, String> map,
            RedirectAttributes redirectAttributes) {

        // 유효값 처리 추가
        if (deleteCalCommand.getSeq() != null && deleteCalCommand.getSeq().length > 10) {
            result.rejectValue("seq", "MaxLimit", "한번에 최대 10개까지만 삭제할수 있습니다.");
        }

        if (result.hasErrors()) {
            log.info("여러글 삭제시 오류가 발생");
            String id = "hk";
            List<CalDto> list = calService.calBoardList(id, map);
            model.addAttribute("list", list);
            return "calboard/calboardlist";
        }

        calService.calMulDel(deleteCalCommand.getSeq());

        // 리다이렉트시 쿼리 스트링 자동생성
        redirectAttributes.addAttribute("year", map.get("year"));
        redirectAttributes.addAttribute("month", map.get("month"));
        redirectAttributes.addAttribute("date", map.get("date"));
        return "redirect:/schedule/calboardlist";
    }

    // 일정상세조회
    @GetMapping("/calboarddetail")
    public String calBoardDetail(UpdateCalCommand updateCalCommand,
            Model model) {
        CalDto dto = calService.calBoardDetail(updateCalCommand.getSeq());

        // updateCalCommand 로 출력하는 기능이 구현되어 있으므로
        // dto ---> command 데이터를 옮겨 담기
        updateCalCommand = modelMapper.map(dto, UpdateCalCommand.class);
        // 필드명이 다른 것들은 직접 맵핑처리를 해야함
        updateCalCommand.mdateToYMDHM(dto.getMdate());

        model.addAttribute("updateCalCommand", updateCalCommand);
        return "calboard/calboarddetail";
    }

    // 일정수정하기
    @PostMapping("/calboardupdate")
    public String calBoardUpdate(@Validated UpdateCalCommand updateCalCommand,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes) {
        log.info("일정수정요청: {}", updateCalCommand);

        // 유효값 처리: 제목이나 내용 등이 비어있을 경우 다시 상세화면으로 이동
        if (result.hasErrors()) {
            log.info("일정수정 유효값 오류 발생");
            return "calboard/calboarddetail";
        }

        // DB에 수정 반영
        calService.calBoardUpdate(updateCalCommand);

        // 수정 완료 후 수정한 날짜의 일정 목록으로 리다이렉트
        redirectAttributes.addAttribute("year", updateCalCommand.getYear());
        redirectAttributes.addAttribute("month", updateCalCommand.getMonth());
        redirectAttributes.addAttribute("date", updateCalCommand.getDate());
        return "redirect:/schedule/calboardlist";
    }

}
