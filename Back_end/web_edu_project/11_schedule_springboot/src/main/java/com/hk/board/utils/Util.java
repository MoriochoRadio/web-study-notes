package com.hk.board.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;

import org.springframework.stereotype.Component;

import com.hk.board.dtos.CalDto;

// thymeleaf에서 호출할때 "util"불러주면 됨 (알아서 Util util 정의해줌)
@Component("util") // <-- 내가 따로 이름을 정의한다면
public class Util {

    // mdate:날짜형식으로 변환하는 기능
    // 파라미터내용: mdate, 변경할 문자열 패턴(yyyy-mm-dd)
    public String toDates(String mdate, String p) {
        // mdate-> "yyyy-MM-dd hh:mm:ss"
        // 1. 입력받을 문자열의 형식을 정의
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        // 2. 문자열(mdate)을 파싱해서 실제 날짜/시간 객체로 변환
        LocalDateTime ldt = LocalDateTime.parse(mdate, inputFormatter);

        // 3. 출력용 패턴 정의
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern(p);
        // 4. 포맷 처리한 문자열을 반환
        return ldt.format(outputFormatter);
    }

    // 달력의 각 날짜(date)에 해당하는 일정을 최대 3개까지 HTML(<p>)로 조립하여 반환
    // 파라미터(list 객체, 해당 일(date))
    public String getCalView(List<CalDto> clist, int date) {
        if (clist == null) {
            return "";
        }

        // 해당 일(date)을 2자리 문자열("01", "15" 등)로 변환
        String d = "%02d".formatted(date);
        StringBuilder sb = new StringBuilder();
        int count = 0; // 3개까지만 출력하기 위한 카운터

        for (CalDto dto : clist) {
            // mdate의 7~8번째 글자가 일(date)에 해당 (예: "202610151430" -> "15")
            if (dto.getMdate().substring(6, 8).equals(d)) {
                String title = dto.getTitle();
                // 제목이 길면 6자리까지만 자르고 ... 붙이기
                if (title != null && title.length() > 6) {
                    title = title.substring(0, 6) + "...";
                }
                sb.append("<p class='clist-item'>").append(title).append("</p>");
                count++;
                if (count == 3) {
                    break; // 최대 3개까지만 표시!
                }
            }
        }
        return sb.toString();
    }
}
