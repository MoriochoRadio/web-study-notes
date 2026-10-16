package com.hk.board.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hk.board.dtos.HkDto;
import com.hk.board.service.HkService;

@RestController
@RequestMapping("/api/boards") // 복수형 명사 사용
public class BoardController2 {

	@Autowired
	private HkService boardService;
	
	// 1. 글목록 조회 (GET /api/boards)
	@GetMapping
	public ResponseEntity<Map<String, List<HkDto>>> boardList() {
		System.out.println("[BoardController2] 글목록 요청");
		Map<String, List<HkDto>> map = new HashMap<>();
		map.put("list", boardService.getAllList());
		
		return ResponseEntity.ok(map); // 200 OK 상태코드와 함께 반환
	}
	
	// 2. 글 추가 (POST /api/boards)
	@PostMapping
	public ResponseEntity<Map<String, Integer>> insert(@RequestBody HkDto dto){
		System.out.println("[BoardController2] 글 추가하기");
		System.out.println(dto);
		Map<String, Integer> map = new HashMap<>();
		map.put("count", boardService.insertBoard(dto));
		
		return ResponseEntity.status(HttpStatus.CREATED).body(map); // 201 Created 상태코드 반환
	}
	
	// 3. 단일 글 상세 조회 (GET /api/boards/{seq}) - 수정폼 이동 시에도 동일한 API 사용
	@GetMapping("/{seq}")
	public ResponseEntity<Map<String, HkDto>> detail(@PathVariable int seq){
		System.out.println("[BoardController2] 글 상세조회: " + seq);
		Map<String, HkDto> map = new HashMap<>();
		map.put("dto", boardService.getBoard(seq));
		System.out.println(map.get("dto"));
		
		return ResponseEntity.ok(map);
	}
	
	// 4. 글 수정 (PUT /api/boards/{seq})
	@PutMapping("/{seq}")
	public ResponseEntity<Map<String, Integer>> update(@PathVariable int seq, @RequestBody HkDto dto){	
		System.out.println("[BoardController2] 글 수정하기: " + dto);
		dto.setSeq(seq); // 주소창의 seq를 객체에 안전하게 세팅
		
		Map<String, Integer> map = new HashMap<>();
		map.put("count", boardService.updateBoard(dto));
		
		return ResponseEntity.ok(map);
	}
	
	// 5. 다중 삭제 (DELETE /api/boards)
	@DeleteMapping
	public ResponseEntity<Map<String, Integer>> muldel(@RequestBody String[] chk){
		System.out.println("[BoardController2] 글 여러개 삭제하기");
		Map<String, Integer> map = new HashMap<>();
		map.put("count", boardService.mulDel(chk));
		
		return ResponseEntity.ok(map);
	}
}
