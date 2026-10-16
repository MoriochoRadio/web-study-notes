package com.hk.board.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Component;

import com.hk.board.dtos.CalDto;

// ===== 화면(Thymeleaf)에서 부르는 도우미 =====
// 빈 이름을 "util" 로 등록해 두면 템플릿에서 ${@util.메서드(...)} 로 부를 수 있다.
//   @ 는 "스프링 빈을 이름으로 찾아라"는 뜻. (calboardlist.html · calendar.html 에서 사용)
// thymeleaf에서 호출할때 "util"불러주면 됨 (알아서 Util util 정의해줌)
@Component("util") // <-- 내가 따로 이름을 정의한다면
public class Util {

    //mdate:날짜형식으로 변환하는 기능
    // 파라미터내용: mdate, 변경할 문자열 패턴(yyyy-mm-dd)
    // 예) toDates("202610151430", "yyyy.MM.dd HH:mm") → "2026.10.15 14:30"   (목록 화면의 '일정' 칸)
    public String toDates(String mdate,String p){
        // mdate-> "yyyy-MM-dd hh:mm:ss"
        //1. 입력받을 문자열의 형식을 정의
        // (패턴 글자: yyyy 년, MM 월, dd 일, HH 0~23시, mm 분 — 대문자 MM 과 소문자 mm 은 다르다)
        DateTimeFormatter inputFormatter=
                        DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        //2. 문자열(mdate)을 파싱해서 실제 날짜/시간 객체로 변환
        LocalDateTime ldt=LocalDateTime.parse(mdate,inputFormatter);

        //3. 출력용 패턴 정의
        DateTimeFormatter outputFormatter =
                            DateTimeFormatter.ofPattern(p);
        //4. 포맷 처리한 문자열을 반환
        return ldt.format(outputFormatter);
    }

    // 파리미터(list객체, 해당 일(date))
    //일일별 일정 목록을 출력해주는 기능
	// calendar.html에서 날짜 출력할때 사용된 변수 i
	// 흐름: 달력은 1일~말일까지 칸을 그리면서 칸마다 이 메서드를 한 번씩 부른다.
	//   clist = 이번 달 일정 전체(날짜마다 최대 3개, Mapper 의 calViewList 가 골라 둔 것)
	//   그중 mdate 의 일(7~8번째 글자)이 i 와 같은 일정만 골라 "<p>제목</p>" 으로 이어 붙여 돌려준다.
	//   calendar.html 은 [(${calList})] 로 출력해서 <p> 태그가 글자가 아니라 진짜 태그로 그려진다.
	public String getCalViewList(int i,List<CalDto> clist) {
		// 이번 달 일정이 하나도 없으면 빈 문자열 (칸에 아무것도 안 그림)
		if(clist == null || clist.isEmpty()){
			return "";
		}

		// i=5 → "05" : mdate 안의 일(두 자리)과 비교하려고 앞에 0을 붙인다
		String d=String.format("%02d", i);
        StringBuilder sb = new StringBuilder();//"<p>일정제목</p><p>일정제목</p>"

		for (int j = 0; j < clist.size(); j++) {
			// "202610151430".substring(6, 8) = "15" → 이 칸의 날짜와 같으면
			if(clist.get(j).getMdate().substring(6, 8).equals(d)) {
				String ctitle=clist.get(j).getTitle();
                // 제목이 7글자보다 길면 앞 7글자 + ".." 로 줄인다 (칸이 좁아서)
                sb.append("<p>")
                  .append(ctitle.length()>7?ctitle.substring(0, 7)+"..":ctitle)
                  .append("</p>");
			}
		}
		return sb.toString();
	}
}
