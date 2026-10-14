package com.hk.board.dtos;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor // 기본생성자
@AllArgsConstructor // 모든필드를 파라미터로 가지는 생성자
@ToString // toString() 메서드 자동생성
@Builder // 빌더는 setter가 필요없다. 객체생성시 인자 순서에 영향받지 않고, 객체를 불변으로 생성할 수 있다.
public class CalDto {
    private int seq;
    private String id;
    private String title;
    private String content;
    private String mdate;
    private Date regdate;
}
