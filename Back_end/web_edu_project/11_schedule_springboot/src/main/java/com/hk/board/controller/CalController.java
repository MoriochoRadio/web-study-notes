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


// ===== 일정관리의 모든 요청을 받는 Controller =====
// 주소는 전부 /schedule 로 시작한다 (@RequestMapping("/schedule")).
//
//   화면 흐름 한눈에 보기
//   [달력] GET /schedule/calendar?year&month ─┬─ 날짜 숫자 클릭 → [하루 목록] GET /calboardlist?year&month&date
//                                             │      ├─ 체크 후 [일정삭제] → POST /calmuldel → 다시 목록
//                                             │      └─ 제목 클릭 → [상세] GET /calboarddetail?seq
//                                             │              └─ [일정수정] → POST /calboardupdate → 다시 상세
//                                             └─ 연필 아이콘 → [추가 폼] GET /addcalboardform → POST /addcalboard → 다시 달력
//
// Controller 는 "요청 받기 · 입력 검사 · 화면 고르기"만 하고, 계산과 DB 일은 CalServiceImp 에 맡긴다.
@Slf4j
@Controller
// final 필드 두 개를 받는 생성자를 Lombok 이 만들어 준다 → 스프링이 그 생성자로 빈을 넣는다(생성자 주입)
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class CalController {

    private final CalServiceImp calService;
    // WebConfig 에서 @Bean 으로 등록한 값 복사 도구
    private final ModelMapper modelMapper;

    // [달력] year·month 가 없으면(첫 진입) Service 가 오늘 날짜로 정한다
    //   ◀ ▶ 버튼은 month-1, month+1 을 보내므로 0이나 13이 올 수 있다 → Service 가 연도를 넘겨 맞춘다
    @GetMapping("/calendar")
    public String calendar(Model model,String year, String month) {
        log.info("calendar페이지 요청");
        // map 안에: year, month, dayOfWeek(1일의 요일), lastDay(말일), clist(이번 달 일정)
        Map<String,Object>map=calService.makeCalendar(year, month);
        // 화면에서는 ${calMap.year} 처럼 꺼내 쓴다
        model.addAttribute("calMap", map);
        return "calboard/calendar";//응답할 페이지 이름
    }

    //일정추가폼 이동
    // 주소의 year·month·date 가 같은 이름의 필드에 자동으로 담겨 들어온다 (Command 를 매개변수로 받으면 바인딩됨)
    @GetMapping("/addcalboardform")
    public String addCalBoardForm(InsertCalCommand insertCalCommand,
                                  Model model) {
        log.info("일정추가폼이동");

        //입력폼 이동시 command객체를 보내야 된다.
        // (화면이 th:object="${insertCalCommand}" 를 쓰므로 없으면 오류)
        model.addAttribute("insertCalCommand", insertCalCommand);
        //현재시간 구하기
        // 폼의 '시' '분' select 기본값을 지금 시각으로 고르는 데 쓴다 (#temporals.hour(now))
        model.addAttribute("now", LocalTime.now());
        return "calboard/addcalboardform";
    }

    //일정추가하기
    // @Validated: InsertCalCommand 의 @NotBlank · @NotNull 규칙 검사
    // BindingResult: 검사 결과 — 반드시 검사 대상 바로 뒤에 둔다 (그래야 오류가 예외 대신 여기 담긴다)
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
            // 입력했던 값과 오류 메시지는 insertCalCommand · result 에 남아 있어 폼에 그대로 다시 나온다
            model.addAttribute("now", LocalTime.now());
            return "calboard/addcalboardform";
        }

        // 검사 통과 → Service 가 mdate 12자리로 바꿔 INSERT
        calService.insertCalBoard(insertCalCommand);

        //리다이렉트시 쿼리 스트링 자동 생성해주는 기능: ?year=2026&month=10
        // redirect: 저장 후 새로고침해도 다시 저장되지 않게, 브라우저가 달력 주소로 새로 요청하게 한다
        redirectAttributes.addAttribute("year",insertCalCommand.getYear());
        redirectAttributes.addAttribute("month",insertCalCommand.getMonth());
        return "redirect:/schedule/calendar";
    }

    //과제
    //일정 목록 조회
    // 받을 파라미터: year, month, date
    // 응답페이지: calboardlist.html
    // @RequestParam Map: 주소의 파라미터 전부를 Map 으로 받는다 → {year=2026, month=10, date=15}
    @GetMapping("/calboardlist")
    public String calBoardList(@RequestParam Map<String,String>map,
                               Model model
                              ) {
        //일정목록 페이지에서 유효값처리 결과를 출력하는 기능을 실행중이라
        // deleteCalCommand객체를 무조건 보내줘야 한다.
        // (목록 화면의 form 이 th:object="${deleteCalCommand}" 라서, 처음 열 때는 빈 객체라도 있어야 한다)
        model.addAttribute("deleteCalCommand", new DeleteCalCommand());

        String id="hk";//로그인 기능이 있을 경우 세션으로부터 가져온다
        // 그날(yyyyMMdd)의 일정 목록, 시간순
        List<CalDto>list=calService.calBoardList(id, map);
        model.addAttribute("list", list);
        return "calboard/calboardlist";
    }

    //삭제하기
    // 체크박스 name="seq" 들 → deleteCalCommand.seq 배열
    // 숨은 칸 year·month·date → map (삭제 뒤 같은 날 목록으로 돌아가는 데 쓴다)
    @PostMapping("/calmuldel")
    public String calMulDel(@Validated DeleteCalCommand deleteCalCommand,
                            BindingResult result,
                            Model model,
                            // String year, String month, String date
                            @RequestParam Map<String, String>map,
                            RedirectAttributes redirectAttributes
    ) {
        // 유효값 처리 추가
        // 애너테이션으로 못 하는 규칙은 직접 검사해서 result 에 오류를 추가할 수 있다
        //   rejectValue(필드 이름, 오류 코드, 기본 메시지) → 화면의 th:errors="*{seq}" 에 이 메시지가 나온다
        if(deleteCalCommand.getSeq()!=null &&
           deleteCalCommand.getSeq().length >10){
            result.rejectValue("seq", "MaxLimit","한번에 최대 10개까지만 삭제 가능함");
           }

        // 체크 0개(@NotEmpty) 또는 11개 이상이면 목록 화면을 다시 보여 준다
        if(result.hasErrors()){
            log.info("여러글 삭제시 오류가 발생");
            String id="hk";
            // redirect 가 아니라 화면을 바로 그리므로, 목록을 다시 조회해서 넣어 줘야 한다
            List<CalDto> list= calService.calBoardList(id, map);
            model.addAttribute("list", list);
            return "calboard/calboardlist";
        }

        // 검사 통과 → DELETE ... WHERE seq IN (...)
        calService.calMulDel(deleteCalCommand.getSeq());

        //리다이렉트시 쿼리 스트링 자동생성
        redirectAttributes.addAttribute("year", map.get("year"));
        redirectAttributes.addAttribute("month", map.get("month"));
        redirectAttributes.addAttribute("date", map.get("date"));
        return "redirect:/schedule/calboardlist";
    }

    //일정상세조회
    // 주소 ?seq=12 → updateCalCommand.seq 에 담겨 들어온다
    @GetMapping("/calboarddetail")
    public String calBoardDetail(UpdateCalCommand updateCalCommand,
                                Model model
    ) {
        // DB 에서 일정 하나 꺼내기
        CalDto dto=
        calService.calBoardDetail(updateCalCommand.getSeq());
        // updateCalCommand로 출력하는 기능이 구현되어 있으므로
        // dto ---> command 데이터를 옮겨 담기
        //dto --> command 값 이동
		//상세보기 페이지에 command객체가 바인딩되어 있어 데이터를 옮겨줌
		// (아래 주석은 손으로 하나씩 옮기던 방법 — ModelMapper 한 줄로 바꿨다)
//		updateCalCommand.setSeq(dto.getSeq());
//		updateCalCommand.setId(dto.getId());// <--id 추가
//		updateCalCommand.setTitle(dto.getTitle());
//		updateCalCommand.setContent(dto.getContent());
//		updateCalCommand.setYear(Integer.parseInt(dto.getMdate().substring(0, 4)));
//		updateCalCommand.setMonth(Integer.parseInt(dto.getMdate().substring(4, 6)));
//		updateCalCommand.setDate(Integer.parseInt(dto.getMdate().substring(6, 8)));
//		updateCalCommand.setHour(Integer.parseInt(dto.getMdate().substring(8, 10)));
//		updateCalCommand.setMin(Integer.parseInt(dto.getMdate().substring(10)));
        //modelMapper를 이용한 값 복사 자동화
        // 이름이 같은 seq · id · title · content 가 복사된 새 UpdateCalCommand 가 만들어진다
        updateCalCommand=modelMapper.map(dto, UpdateCalCommand.class);
        // 필드명이 다른 것들은 직접 맵핑처리를 해야함
        // mdate "202610151430" → year 2026, month 10, date 15, hour 14, min 30
        updateCalCommand.mdateToYMDHM(dto.getMdate());

        // 화면의 th:object="${updateCalCommand}" 가 이 값으로 폼을 채운다
        model.addAttribute("updateCalCommand", updateCalCommand);
        return "calboard/calboarddetail";
    }

    //수정하기
	// 상세 화면의 폼 값 → updateCalCommand → 검사
	@PostMapping("/calboardupdate")
	public String calBoardUpdate(@Validated UpdateCalCommand updateCalCommand,
			   				    BindingResult result,
                                RedirectAttributes redirectAttributes
                            ) {
		// 제목·내용이 비었으면 상세 화면을 다시 (입력값과 오류 메시지가 함께 나온다)
		if(result.hasErrors()) {
			log.info("수정오류");

			return "calboard/calboarddetail";
		}

		// 검사 통과 → Service 가 mdate 12자리로 합쳐서 UPDATE
		calService.calBoardUpdate(updateCalCommand);
		// 수정 뒤에는 그 일정의 상세 화면으로 (?seq=12)
		redirectAttributes.addAttribute("seq", updateCalCommand.getSeq());
		return "redirect:/schedule/calboarddetail";
	}

}
