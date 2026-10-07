package com.hk.board.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.hk.board.dtos.HkDto;

@Mapper // Spring Boot가 자동으로 구현체를 만들어준다.
public interface BoardMapper {

    // BoardMapper.xml에 쿼리 id명과 메서드명이 같아야 함
    public List<HkDto> getAllList();

    public HkDto getBoard(int seq);

    public boolean insertBoard(HkDto dto);

    public boolean updateBoard(HkDto dto);

    public boolean deleteBoard(HkDto dto);

    public boolean mulDel(Map<String, String[]> seqs);
}
