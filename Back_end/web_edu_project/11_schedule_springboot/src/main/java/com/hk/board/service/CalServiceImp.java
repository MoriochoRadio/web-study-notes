package com.hk.board.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.hk.board.command.InsertCalCommand;
import com.hk.board.command.UpdateCalCommand;
import com.hk.board.dtos.CalDto;
import com.hk.board.mapper.CalMapper;

import lombok.RequiredArgsConstructor;

// ===== 일정관리의 실제 일(계산 + DB 호출)을 하는 Service =====
// Controller → (Command 나 파라미터) → Service → (CalDto / Map) → CalMapper → DB
// 이 프로젝트의 핵심 변환: 화면은 년·월·일·시·분 다섯 칸, DB 는 mdate "yyyyMMddHHmm" 12자리 한 칸.
//   저장할 때(추가·수정) 다섯 칸 → 12자리로 합치고, 조회할 때는 앞에서부터 잘라 비교한다.
@Service
@RequiredArgsConstructor
public class CalServiceImp {

    //생성자 주입 방식
    private final CalMapper calMapper;
    private final ModelMapper modelMapper;

    //request같은 요청 처리 객체를 제외한 기능들은 서비스에 구현
    // [달력 만들기] 달력을 그리는 데 필요한 값 다섯 가지를 Map 에 담아 돌려준다
    public Map<String, Object> makeCalendar(String paramYear,
                                            String paramMonth
    ){
        //달력에 필요한 값을 구하기 위해 calendar객체를 사용하자
        // Calendar.getInstance() = 지금 날짜·시각
        Calendar cal=Calendar.getInstance();

        //파리미터로 전달된 값이 null이면 현재 날짜로
        // 아니면 사용자가 요청한 날짜로 처리
        // 주의: Calendar 의 MONTH 는 0(1월)~11(12월)이라 사람이 쓰는 월로 바꾸려고 +1
        int year=(paramYear==null)?cal.get(Calendar.YEAR):
                                   Integer.parseInt(paramYear);
        int month=(paramMonth==null)?cal.get(Calendar.MONTH)+1:
                                   Integer.parseInt(paramMonth);

        //문제점: 월을 이동할때 년도가 바뀌면 11,12,13,14...
        // year와 month를 상황에 맞게 값을 변경해준다.
        // 12월에서 ▶ → month=13 → 다음 해 1월
        if(month>12){
            month=1;
            year++;
        }

        // 1월에서 ◀ → month=0 → 전년 12월
        if(month<1){
            month=12;
            year--;
        }

        //1. 해당 월의 1일에 대한 요일을 구하기
        //  - 1~7 숫자를 반환: 1은 일요일 ~ 7은 토요일
        // --> 달력의 첫 시작 공백수를 출력하기 위해서..
        // 예) 1일이 수요일(4) → 앞에 빈칸 3개(일·월·화)를 그린다 (calendar.html 의 dayOfWeek-1)
        // set 할 때는 다시 0부터 세는 월로 넣어야 해서 month-1
        cal.set(year, month-1, 1);
        int dayOfWeek=cal.get(Calendar.DAY_OF_WEEK);

        //2. 월의 마지막 날 구하기
        // 28·29·30·31 중 하나 — 윤년 2월도 알아서 계산된다
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

        // 달력 구현에 필요한 값을 map저장
        Map<String, Object>map = new HashMap<>();
        map.put("year", year);
        map.put("month",month);
        map.put("dayOfWeek",dayOfWeek);
        map.put("lastDay",lastDay);

        // 일정목록 3개씩 출력하는 List 객체 구해서 map에 같이 전달할 예정임
        //한달 단위 일일별 일정 구하기
		String id="hk";//session에서 가져오기
		// 2026, 9 → "202609" (월을 두 자리로)
		String yyyyMM=year+String.format("%02d", month);//년월 6자리

		// 이번 달 일정 (날짜마다 시간순 최대 3개) → 달력 칸마다 Util.getCalViewList 가 그날 것만 골라 그린다
		List<CalDto>clist=calViewList(id, yyyyMM);

		map.put("clist", clist);
        return map;
    }

    // 일정 추가하기
    public boolean insertCalBoard(InsertCalCommand insertCalCommand){
        //command = id, title, content, y,m,d,h,m 저장
        // DB = id, title, content, mdate(yyyyMMddhhmm)12자리
        // mdate 12자리로 변환처리하기: "202610140248"
        // 숫자+"" 로 문자열을 만든 뒤 isTwo 로 한 자리면 앞에 0 → 2026 + "10" + "14" + "02" + "48"
        String mdate = insertCalCommand.getYear()
                      +(isTwo(insertCalCommand.getMonth()+""))
                      +(isTwo(insertCalCommand.getDate()+""))
                      +(isTwo(insertCalCommand.getHour()+""))
                      +(isTwo(insertCalCommand.getMin()+""));

        // command객체 데이터 ---> Dto객체로 받기
        CalDto dto=new CalDto();
        dto.setId(insertCalCommand.getId());
        dto.setTitle(insertCalCommand.getTitle());
        dto.setContent(insertCalCommand.getContent());
        dto.setMdate(mdate);

        // INSERT 된 행 수가 1이면 성공
        int count = calMapper.insertCalBoard(dto);
        return count>0;
    }

    //일정목록 조회: 파라미터 id, paramMap map(year,month,date)
    public List<CalDto> calBoardList(String id,
                                    Map<String, String>paramMap
    ){
        //날짜 y, m , d -> 8자리로 변환
        // 방법 1: 문자열 이어 붙이기 + isTwo  (예: "2026"+"10"+"05" → "20261005")
        String yyyyMMdd=paramMap.get("year")
                       +isTwo(paramMap.get("month"))
                       +isTwo(paramMap.get("date"));

        //java 15이상  : String.formatted()
        // 방법 2: 형식 문자열 — %04d 네 자리, %02d 두 자리(빈자리는 0)
        //   실제로 Mapper 에 넘기는 것은 이 yyyyMMdd2 다 (위의 yyyyMMdd 는 비교용으로 남겨 둔 것)
        String yyyyMMdd2="%04d%02d%02d".formatted(
                                        Integer.parseInt(paramMap.get("year")) ,
                                        Integer.parseInt(paramMap.get("month")),
                                        Integer.parseInt(paramMap.get("date"))
                                        );
        // Mapper XML 의 #{id} · #{yyyyMMdd} 가 이 Map 의 키 이름이다
        Map<String, String>map=new HashMap<>();
        map.put("id",id);
        map.put("yyyyMMdd", yyyyMMdd2);

        return calMapper.calBoardList(map);
    }

    //일정삭제
    public boolean calMulDel(String[] seqs){
        //삭제할 일정 seq--> String[1,2,3,4]
        // Mapper XML 의 <foreach collection="seqs"> 가 이 키 이름으로 배열을 찾는다
        Map<String, String[]> map=new HashMap<>();
        map.put("seqs",seqs);

        int count=calMapper.calMulDel(map);
        return count>0;
    }

    //상세보기
    public CalDto calBoardDetail(int seq){
        return calMapper.calBoardDetail(seq);
    }

    //일정 수정하기
	public int calBoardUpdate(UpdateCalCommand updateCalCommand) {
		//Client                Server
		//      ------> command --> dto --> mapper전달
		//  commad--> dto로 값 복사
		// 이름이 같은 seq · id · title · content 가 CalDto 로 복사된다
		CalDto dto=modelMapper.map(updateCalCommand, CalDto.class);
		//"202510230939"--> mdate 12자리로 저장
		// 다섯 칸(year·month·date·hour·min)은 CalDto 에 같은 이름이 없어 직접 합친다
		String mdate=updateCalCommand.getYear()
				    +isTwo(updateCalCommand.getMonth()+"")
				    +isTwo(updateCalCommand.getDate()+"")
				    +isTwo(updateCalCommand.getHour()+"")
				    +isTwo(updateCalCommand.getMin()+"");
		dto.setMdate(mdate);//필드매칭이 안되는 값은 따로 처리해준다.

		return calMapper.calBoardUpdate(dto);
	}

    //월별 일정 가져오기
	// 달력용: 한 달(yyyyMM) 일정을 날짜마다 최대 3개씩 — 실제로 3개를 고르는 일은 SQL(ROW_NUMBER)이 한다
	public List<CalDto> calViewList(String id, String yyyyMM){
		Map<String,String> map=new HashMap<String, String>();
		map.put("id", id);
		map.put("yyyyMM", yyyyMM);
		return calMapper.calViewList(map);
	}

    //문자열 2자리로 변환하는 메서드
    // "5" → "05", "12" → "12"  (mdate 를 항상 12자리로 맞추려고)
    public String isTwo(String s){
        return s.length()<2?"0"+s:s;
    }
}
