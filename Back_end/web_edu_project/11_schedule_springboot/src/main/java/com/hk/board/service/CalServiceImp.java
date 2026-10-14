package com.hk.board.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hk.board.mapper.CalMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalServiceImp {

    // 생성자 주입 방식
    private final CalMapper calMapper;

    // request 같은 요청 처리 객체를 제외한 기능들은 서비스에 구현한다.
    public Map<String, Object> makeCalendar(String paramYear, String paramMonth) {

        // 달력에 필요한 값을 구하기 위해 calendar객체를 사용하자
        Calendar cal = Calendar.getInstance();

        // 파라미터로 전달된 값이 null이면 현재 날짜로
        // 아니면 사용자가 요청한 날짜로 처리
        int year = (paramYear == null) ? cal.get(Calendar.YEAR) : Integer.parseInt(paramYear);
        int month = (paramMonth == null) ? cal.get(Calendar.MONTH) + 1 : Integer.parseInt(paramMonth);

        // 1. 해당 월의 1일에 대한 요일을 구하기
        // 1~7 숫자를 반환: 1은 일요일 7은 토요일
        cal.set(year, month - 1, 1); // 1로 세팅했으니까 int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK); // 요일을 반환한다

        // 0월(-1)이나 13월이 들어왔을 때 Calendar가 자동 보정한 연/월을 다시 가져옴
        year = cal.get(Calendar.YEAR);
        month = cal.get(Calendar.MONTH) + 1;

        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK); // 요일을 반환한다

        // 2. 월의 마지막 날 구하기
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

        // 달력 구현에 필요한 값을 map저장
        Map<String, Object> map = new HashMap<>();
        map.put("year", year);
        map.put("month", month);
        map.put("dayOfWeek", dayOfWeek);
        map.put("lastDay", lastDay);

        // 일정목록 3개씩 출력하는 List 객체 구해서 map에 같이 전달할 예정
        return map;
    }
}
