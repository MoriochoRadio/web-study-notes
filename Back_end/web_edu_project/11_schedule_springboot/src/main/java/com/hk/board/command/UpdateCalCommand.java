package com.hk.board.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCalCommand {
    private int seq;
    private String id;
    @NotBlank(message = "제목을 입력하세요")
    private String title;
    @NotBlank(message = "일정내용을 입력하세요")
    private String content;

    // mdate 컬럼에 저장할 값-> 12자리로 변환해서 처리
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

    // mdate값을 년월일시분으로 분리해서 해당필드에 담아주기
    public void mdateToYMDHM(String mdate) {
        this.year = Integer.parseInt(mdate.substring(0, 4));
        this.month = Integer.parseInt(mdate.substring(4, 6));
        this.date = Integer.parseInt(mdate.substring(6, 8));
        this.hour = Integer.parseInt(mdate.substring(8, 10));
        this.min = Integer.parseInt(mdate.substring(10));
    }

}
