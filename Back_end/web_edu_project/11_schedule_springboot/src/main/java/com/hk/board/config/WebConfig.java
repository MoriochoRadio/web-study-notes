package com.hk.board.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// ===== 직접 만든 객체를 스프링 빈으로 등록하는 설정 클래스 =====
// ModelMapper 는 우리가 만든 클래스가 아니라서 @Component 를 붙일 수 없다.
// 그래서 @Configuration 클래스 안의 @Bean 메서드가 "이 객체를 빈으로 써라"고 등록해 준다.
@Configuration
public class WebConfig {

    // ModelMapper: 필드 이름이 같은 값끼리 자동으로 복사해 주는 도구
    //   예) CalDto(seq, id, title, content, mdate) → UpdateCalCommand(seq, id, title, content, ...)
    //   이름이 다른 칸(mdate ↔ year·month·date·hour·min)은 직접 옮겨야 한다.
    // 여기서 등록해 두면 CalController · CalServiceImp 가 생성자 주입(final 필드)으로 받아 쓴다.
    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
