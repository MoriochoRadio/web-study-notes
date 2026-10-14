package com.hk.board.dtos;

import java.util.Date;

import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter 
@Getter 
@NoArgsConstructor 
@AllArgsConstructor 
@ToString 
@Builder 
public class CalDto {
    private int seq;
    private String id;
    private String title;
    private String content;
    private String mdate;
    private Date regdate;
}
