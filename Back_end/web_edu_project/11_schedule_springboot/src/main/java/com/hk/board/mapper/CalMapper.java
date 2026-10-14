package com.hk.board.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.hk.board.dtos.CalDto;

@Mapper 
public interface CalMapper {
    // 메서드명과 calMapper.xml에 쿼리 id명을 일치 시킨다
    public int insertCalBoard(CalDto dto);
    public List<CalDto> calBoardList(Map<String,String>map);
    public CalDto calBoardDetail(int seq);
    public int calBoardUpdate(CalDto dto);
    public int calMulDel(Map<String,String[]>map);
}
