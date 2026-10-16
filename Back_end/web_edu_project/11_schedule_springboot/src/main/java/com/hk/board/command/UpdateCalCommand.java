package com.hk.board.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// ===== 일정 상세보기 + 수정 폼(calboarddetail.html)에 쓰는 Command =====
// 두 방향으로 쓰인다.
//   ① 상세보기(GET): DB 에서 꺼낸 CalDto → 이 객체로 옮겨 담아 폼에 값 채우기 (Controller 의 calBoardDetail)
//   ② 수정(POST):   폼 입력값 → 이 객체 → @Validated 검사 → CalDto 로 옮겨 UPDATE (calBoardUpdate)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCalCommand {
    // seq: 어느 일정을 고칠지 — 폼의 hidden 칸으로 다시 돌아온다
    private int seq;
    // id: 화면에서는 readonly 로 보여 주기만 한다
    private String id;
    @NotBlank(message = "제목을 입력하세요")
    private String title;
    @NotBlank(message = "일정내용을 입력하세요")
    private String content;

    //mdate 컬럼에 저장할 값-> 12자리로 변환해서 처리
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

    //mdate값을 년월일시분으로 분리해서 해당필드에 담아주기
    // 예) mdate = "202610151430"
    //      substring(0,4)="2026" → year,  (4,6)="10" → month, (6,8)="15" → date,
    //      (8,10)="14" → hour,   (10)="30" → min         ※ substring(시작, 끝) 은 끝 글자 직전까지
    // CalDto 에는 mdate 한 칸, 이 객체에는 다섯 칸이라 ModelMapper 가 자동으로 못 옮겨서 직접 나눈다.
    public void mdateToYMDHM(String mdate){
        this.year=Integer.parseInt(mdate.substring(0, 4));
        this.month=Integer.parseInt(mdate.substring(4, 6));
        this.date=Integer.parseInt(mdate.substring(6, 8));
        this.hour=Integer.parseInt(mdate.substring(8, 10));
        this.min=Integer.parseInt(mdate.substring(10));
    }
}
