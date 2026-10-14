package com.hk.board.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
    private int seq;
    @NotBlank(message = "아이디를 입력하세요") 
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
}
