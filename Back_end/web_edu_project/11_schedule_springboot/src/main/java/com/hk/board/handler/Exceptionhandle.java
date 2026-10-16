package com.hk.board.handler;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.slf4j.Slf4j;

// ===== 전역 예외 처리 =====
// Controller 메서드(또는 그 안에서 부른 Service·Mapper)에서 예외가 터지면
// 흰 오류 화면 대신 여기로 와서 templates/error.html 을 보여 준다.
// 위에서부터 "가장 구체적인 예외"가 맞는 메서드가 먼저 선택된다.
@Slf4j
@ControllerAdvice // @Controller가 적용된 클래스에서 발생되는 예외를 catch함
public class Exceptionhandle {

     // 비즈니스/입력값 관련 예외 처리 (선택 사항)
    // 예) Integer.parseInt("abc") 의 NumberFormatException 도 IllegalArgumentException 의 자식이라 여기로 온다
    //    (주소에 year=abc 처럼 숫자가 아닌 값을 넣은 경우)
    @ExceptionHandler(IllegalArgumentException.class)
    public String handleIllegalArgumentException(IllegalArgumentException e, Model model) {
        log.warn("잘못된 요청 파라미터 발생: {}", e.getMessage());
        // error.html 의 ${msg} 자리에 나온다
        model.addAttribute("msg", e.getMessage());
        return "error";
    }
    // 그 외 모든 예외 처리
    // Exception 은 모든 예외의 부모 → 위에서 안 잡힌 나머지가 전부 여기로 온다
    @ExceptionHandler(Exception.class)
    public String handleException(Exception e, Model model) {
        // e를 마지막 인자로 넘겨 전체 StackTrace를 로그에 기록
        log.error("Exception 발생: ", e);

        // 사용자에게는 일반 문구만 보여 주고, 진짜 원인은 위 로그로 확인한다
        model.addAttribute("msg", "오류가 발생하여 확인 중입니다. 잠시 후 다시 시도해 주세요.");
        // 참고: 지금 error.html 은 ${msg} 만 출력하고 ${detail} 은 쓰지 않는다
        model.addAttribute("detail", e.getMessage()); // 개발 단계 확인용
        return "error";
    }
}
