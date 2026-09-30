package com.hk.ansboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hk.ansboard.dao.AnsDao;
import com.hk.ansboard.dtos.AnsDto;

@Service
public class AnsService {

	@Autowired
	private AnsDao ansDao;
	
	public List<AnsDto> getAllList(String pnum){
		return ansDao.getAllList(pnum);
	}
	
	public boolean boardInsert(AnsDto dto) {
		return ansDao.boardInsert(dto);
	}
	
	public AnsDto boardDetail(int seq) {
		return ansDao.boardDetail(seq);
	}
	
	public boolean boardUpdate(AnsDto dto) {
		return ansDao.boardUpdate(dto);
	}
	
	public boolean mulDel(String[] seqs) {
		return ansDao.mulDel(seqs);
	}
	
	public boolean readCount(int seq) {
		return ansDao.readCount(seq);
	}
}
