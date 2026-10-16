package com.hk.board.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// ===== 일정 추가 폼(addcalboardform.html)의 입력값을 받는 Command =====
// 흐름: 달력의 연필 아이콘 클릭 → GET /schedule/addcalboardform?year=..&month=..&date=..
//       → 이 객체에 year·month·date 가 미리 채워져 폼의 select 기본값이 된다
//       → [일정추가] → POST /schedule/addcalboard → @Validated 로 아래 규칙 검사
// DB(calboard)에는 년·월·일·시·분이 따로 없고 mdate(12자리 문자열) 하나로 저장한다 → 변환은 Service 가 한다.
//일정 입력폼: id, title, content, year, month, date, hour, min
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InsertCalCommand {
    // notBlank: 문자열만 대상으로 null, ""빈문자열, " "공백 모두 체크
    // notnull: 모든 타입을 대상으로 null만 체크
    // notEmpty: 문자열, collection/Map/Array대상으로 null, ""빈문자열 체크
    // seq: 글번호. 추가할 때는 DB 가 자동 증가로 만들어 주므로 폼에서 받지 않는다
    private int seq;
    @NotBlank(message = "아이디를 입력하세요")
    private String id;
    @NotBlank(message = "제목을 입력하세요")
    private String title;
    @NotBlank(message = "일정내용을 입력하세요")
    private String content;

    //mdate 컬럼에 저장할 값-> 12자리로 변환해서 처리
    // int 가 아니라 Integer 인 이유: 값이 안 넘어오면 null 이 되어야 @NotNull 로 잡을 수 있다 (int 는 null 불가)
    @NotNull(message = "년도를 입력하세요")
    private Integer year;
    @NotNull(message = "월을 입력하세요")
    private Integer month;
    @NotNull(message = "일을 입력하세요")
    private Integer date;
    @NotNull(message = "시간을 입력하세요")
    private Integer hour;
    @NotNull(message = "분 입력하세요")
    private Integer min;
}
