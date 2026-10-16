package com.hk.board.dtos;

import java.util.Date;

// 이 PC 맞춤: 선생님 파일은 groovy.transform.ToString 이라 toString 이 안 만들어져서 lombok 으로 바꿨다
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// ===== DB 테이블 calboard 한 행의 모양 =====
// Command 는 "화면 입력", Dto 는 "DB 한 행" — 그래서 DB 에 있는 mdate(12자리)가 여기 있다.
// MyBatis 가 SELECT 결과의 컬럼 이름과 같은 필드에 값을 넣는다 (resultType="CalDto").
//   CalDto 라는 짧은 이름은 application.properties 의 mybatis.type-aliases-package 덕분.
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
// @Builder: CalDto.builder().id("hk").title("..").build() 처럼 만들 수 있게 해 준다
@Builder
public class CalDto {
    // 글번호 (DB 자동 증가)
    private int seq;
    // 작성자 아이디 (지금은 로그인 기능이 없어 "hk" 고정)
    private String id;
    private String title;
    private String content;
    // 일정 날짜·시간 "yyyyMMddHHmm" 12자리 문자열 — 예) "202610151430" = 2026.10.15 14:30
    private String mdate;
    // 작성(수정)한 시각 — DB 의 SYSDATE()
    private Date regdate;
}
