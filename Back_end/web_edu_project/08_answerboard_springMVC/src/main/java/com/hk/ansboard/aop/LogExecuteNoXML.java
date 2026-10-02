package com.hk.ansboard.aop;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

//@Aspect
//@Component //객체 등록하는 어노테이션 --> @Controller, @Service...
public class LogExecuteNoXML {

	  // 공통 Pointcut: service 패키지 하위 모든 메서드
	  // (dao/mapper 쪽에 걸고 싶으면 패키지 경로만 바꿔서 Pointcut 추가)
	  @Pointcut("execution(* com.hk.ansboard.service..*(..))")
	  public void servicePointcut() {}
	  
	  // target 메서드가 실행되기 전에 수행될 기능을 정의
	  
	   @Before("servicePointcut()")
	  public void before(JoinPoint join) {
	      Logger log = LoggerFactory.getLogger(join.getTarget().getClass());
	      log.info("before실행(info):시작:{}", join.getSignature().getName());
	  log.debug("before실행(debug):시작:{}", join.toLongString());
	   }
	  
	  // target 메서드가 실행된 후 반환값을 성공적으로 리턴했다면 수행될 기능을 정의
	  
	   @AfterReturning(pointcut = "servicePointcut()", returning = "result")
	   public void afterReturning(JoinPoint join, Object result) {
	      Logger log = LoggerFactory.getLogger(join.getTarget().getClass());
	      log.info("afterReturning실행(info):시작:{}", join.getSignature().getName());
	  log.debug("afterReturning실행(debug):시작:{}", join.toLongString());
	  Object[] args = join.getArgs();
	 log.debug("전달 파라미터:{}", Arrays.toString(args));
	  log.debug("반환값:{}", result);
	   }
	  
	  // target 메서드에서 오류가 발생했을 때 수행될 기능 정의
	  
	   @AfterThrowing(pointcut = "servicePointcut()", throwing = "ex")
	   public void daoError(JoinPoint join, Throwable ex) {
	      Logger log = LoggerFactory.getLogger(join.getTarget().getClass());
	      log.info("daoError실행(info):시작:{}", join.getSignature().getName());
	 log.debug("daoError실행(debug):시작:{}", join.toLongString());
	  log.debug("daoError실행(debug):오류발생:{}", ex.getMessage());
	   }
}
	 
