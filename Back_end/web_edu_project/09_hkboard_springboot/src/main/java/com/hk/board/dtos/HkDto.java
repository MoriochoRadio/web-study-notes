package com.hk.board.dtos;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

//@Data => @Setter + @Getter + @ToString 
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder // 원하는 멤버필드만 초기화 제공
// @RequiredArgsConstructor --> dto객체에서는 잘 안씀 -> 객체 주입할때 주로 사용함
public class HkDto {
    private int seq;
    private String id;
    private String title;
    private String content;
    private Date regDate;
}
