package com.hk.board.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hk.board.dtos.HkDto;
import com.hk.board.mapper.BoardMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class HkService {

    // 생성자를 이용한 의존 주입방식을 권장함
    // @Autowired //권장하지 않음
    // private @NonNull BoardMapper boardMapper;
    private final BoardMapper boardMapper;

    // 생성자 초기화방식으로 주입가능함
    // --> lombok을 사용하면 생략가능
    // public HkService(BoardMapper boardMapper){
    // this.boardMapper=boardMapper;
    // }
    public List<HkDto> getAllList() {
        return boardMapper.getAllList();
    }

    public boolean insertBoard(HkDto dto) {
        return boardMapper.insertBoard(dto);
    }

    public HkDto getBoard(int seq) {
        return boardMapper.getBoard(seq);
    }

    public boolean updateBoard(HkDto dto) {
        return boardMapper.updateBoard(dto);
    }

    public boolean mulDel(String[] seq) {
        Map<String, String[]> map = new HashMap<>();
        map.put("seqs", seq);
        return boardMapper.mulDel(map);
    }
}