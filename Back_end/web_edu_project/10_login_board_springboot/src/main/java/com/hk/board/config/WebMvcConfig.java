package com.hk.board.config;

import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
public class WebMvcConfig implements WebMvcConfigurer{

	// 첨부파일 저장 폴더 — application.properties 의 file.upload-dir 값
	// (@Value 필드에는 final 을 붙이지 않는다: Lombok 이 만든 생성자로 @Value 가 따라가지 않음)
	@Value("${file.upload-dir}")
	private String uploadDir;
	
	//구현된 interceptor 객체를 등록한다.
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new LoginInterceptor())
				.order(1) //우선순위 설정
				.addPathPatterns("/**")   //전체 요청에 대해 적용
				.excludePathPatterns("/error"
//						            ,"/board/boardList"
//									,"/board/boardDetail"
//									,"/board/mulDel"
//									,"/board/boardUpdate"
//									,"/board/download"
						            ,"/","/user/**","/css/**","/js/**"
						            ,"/img/**","/upload/**");
	
//		registry.addInterceptor(new LoginInterceptor())
//		.order(2)
//		.addPathPatterns("/**")   //전체 요청에 대해 적용
//		.excludePathPatterns("/board","/","/user/**","/css/**","/js/**");
	}
	
	//파일을 불러올때 경로 설정(클라이언트에서 파일을 불러오려면 resources/static 하위에 있어야 함
	//                                  -> 다른경로에 있으면 못불러오기때문에 경로 설정해줌) 
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		log.info("업로드 폴더: {}", uploadDir);
		registry.addResourceHandler("/upload/**")
				.addResourceLocations("file:" + uploadDir + "/");
	}
}





