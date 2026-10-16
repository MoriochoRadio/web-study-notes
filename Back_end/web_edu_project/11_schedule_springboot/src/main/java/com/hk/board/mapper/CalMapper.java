package com.hk.board.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.hk.board.dtos.CalDto;

// ===== DB 작업 목록 (인터페이스) =====
// 구현 클래스는 우리가 만들지 않는다. @Mapper 를 보고 MyBatis 가 실행 중에 구현 객체를 만들어 빈으로 등록하고,
// 메서드를 부르면 resources/mybatis/CalMapper.xml 에서
//   namespace = 이 인터페이스 이름(com.hk.board.mapper.CalMapper), id = 메서드 이름 인 SQL 을 찾아 실행한다.
@Mapper
public interface CalMapper {
    // 메서드명과 calMapper.xml에 쿼리 id명을 일치 시킨다
    // 일정 추가 — INSERT 된 행 수(1)를 돌려준다
    public int insertCalBoard(CalDto dto);
    // 하루 일정 목록 — map 에 id, yyyyMMdd(8자리)
    public List<CalDto> calBoardList(Map<String,String>map);
    // 일정 하나 상세
    public CalDto calBoardDetail(int seq);
    // 일정 수정 — 바뀐 행 수
    public int calBoardUpdate(CalDto dto);
    // 여러 일정 삭제 — map 의 "seqs" 에 글번호 배열, 지운 행 수
    public int calMulDel(Map<String,String[]>map);
    // 달력 칸에 보여 줄 한 달 일정 (날짜마다 최대 3개) — map 에 id, yyyyMM(6자리)
    public List<CalDto> calViewList(Map<String, String> map);
}
