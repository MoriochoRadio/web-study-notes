package com.hk.board.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hk.board.command.InsertCalCommand;
import com.hk.board.command.UpdateCalCommand;
import com.hk.board.dtos.CalDto;
import com.hk.board.mapper.CalMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalServiceImp {

    // 생성자 주입 방식
    private final CalMapper calMapper;

    // request같은 요청 처리 객체를 제외한 기능들은 서비스에 구현
    public Map<String, Object> makeCalendar(String paramYear,
            String paramMonth) {
        // 달력에 필요한 값을 구하기 위해 calendar객체를 사용하자
        Calendar cal = Calendar.getInstance();

        // 파리미터로 전달된 값이 null이면 현재 날짜로
        // 아니면 사용자가 요청한 날짜로 처리
        int year = (paramYear == null) ? cal.get(Calendar.YEAR) : Integer.parseInt(paramYear);
        int month = (paramMonth == null) ? cal.get(Calendar.MONTH) + 1 : Integer.parseInt(paramMonth);

        // 문제점: 월을 이동할때 년도가 바뀌면 11,12,13,14...
        // year와 month를 상황에 맞게 값을 변경해준다.
        if (month > 12) {
            month = 1;
            year++;
        }

        if (month < 1) {
            month = 12;
            year--;
        }

        // 1. 해당 월의 1일에 대한 요일을 구하기
        // - 1~7 숫자를 반환: 1은 일요일 ~ 7은 토요일
        // --> 달력의 첫 시작 공백수를 출력하기 위해서..
        cal.set(year, month - 1, 1);
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);

        // 2. 월의 마지막 날 구하기
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

        // 달력 구현에 필요한 값을 map저장
        Map<String, Object> map = new HashMap<>();
        map.put("year", year);
        map.put("month", month);
        map.put("dayOfWeek", dayOfWeek);
        map.put("lastDay", lastDay);

        // 일정목록 3개씩 출력하는 List 객체 구해서 map에 같이 전달할 예정임
        String yyyyMM = "%04d%02d".formatted(year, month);
        Map<String, String> pMap = new HashMap<>();
        pMap.put("id", "hk");
        pMap.put("yyyyMM", yyyyMM);
        List<CalDto> clist = calMapper.calViewList(pMap);
        map.put("clist", clist);

        return map;
    }

    // 일정 추가하기
    public boolean insertCalBoard(InsertCalCommand insertCalCommand) {
        // command = id, title, content, y,m,d,h,m 저장
        // DB = id, title, content, mdate(yyyyMMddhhmm)12자리
        // mdate 12자리로 변환처리하기: "202610140248"
        String mdate = insertCalCommand.getYear()
                + (isTwo(insertCalCommand.getMonth() + ""))
                + (isTwo(insertCalCommand.getDate() + ""))
                + (isTwo(insertCalCommand.getHour() + ""))
                + (isTwo(insertCalCommand.getMin() + ""));

        // command객체 데이터 ---> Dto객체로 받기
        CalDto dto = new CalDto();
        dto.setId(insertCalCommand.getId());
        dto.setTitle(insertCalCommand.getTitle());
        dto.setContent(insertCalCommand.getContent());
        dto.setMdate(mdate);

        int count = calMapper.insertCalBoard(dto);
        return count > 0;
    }

    // 일정목록 조회: 파라미터 id, paramMap map(year,month,date)
    public List<CalDto> calBoardList(String id,
            Map<String, String> paramMap) {
        // 날짜 y, m , d -> 8자리로 변환
        String yyyyMMdd = paramMap.get("year")
                + isTwo(paramMap.get("month"))
                + isTwo(paramMap.get("date"));

        // java 15이상 : String.formatted()
        String yyyyMMdd2 = "%04d%02d%02d".formatted(
                Integer.parseInt(paramMap.get("year")),
                Integer.parseInt(paramMap.get("month")),
                Integer.parseInt(paramMap.get("date")));
        Map<String, String> map = new HashMap<>();
        map.put("id", id);
        map.put("yyyyMMdd", yyyyMMdd2);

        return calMapper.calBoardList(map);
    }

    // 일정삭제
    public boolean calMulDel(String[] seqs) {
        Map<String, String[]> map = new HashMap<>();
        map.put("seqs", seqs);

        int count = calMapper.calMulDel(map);
        return count > 0;
    }

    // 상세보기
    public CalDto calBoardDetail(int seq) {
        return calMapper.calBoardDetail(seq);
    }

    // 문자열 2자리로 변환하는 메서드
    public String isTwo(String s) {
        return s.length() < 2 ? "0" + s : s;
    }

    // 수정하기
    public boolean calBoardUpdate(UpdateCalCommand updateCalCommand) {
        // updateCalCommand:seq, id,title,content, year, month, date, hour, min
        // DB: seq,id,title,content, mdate
        String mdate = updateCalCommand.getYear() +
                isTwo(updateCalCommand.getMonth() + "") +
                isTwo(updateCalCommand.getDate() + "") +
                isTwo(updateCalCommand.getHour() + "") +
                isTwo(updateCalCommand.getMin() + "");

        CalDto dto = new CalDto();
        dto.setSeq(updateCalCommand.getSeq());
        dto.setId(updateCalCommand.getId());
        dto.setTitle(updateCalCommand.getTitle());
        dto.setContent(updateCalCommand.getContent());
        dto.setMdate(mdate);

        int count = calMapper.calBoardUpdate(dto);
        return count > 0;
    }

}
