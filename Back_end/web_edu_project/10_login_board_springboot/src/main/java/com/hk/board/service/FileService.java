package com.hk.board.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import com.hk.board.dtos.FileBoardDto;
import com.hk.board.mapper.FileMapper;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class FileService {

	@Autowired
	private FileMapper fileMapper;
	
	//파일업로드하기
	@Transactional
	public List<FileBoardDto> uploadFiles(String uploadPath
						    // ,MultipartRequest multipartRequest
							,List<MultipartFile> files
						) 
						   throws IllegalStateException, IOException{
		//여러개의 파일들을 List에 담는 코드
		// List<MultipartFile> multipartFiles
		//                   =multipartRequest.getFiles("filename");
		
		//업로드된 파일들의 정보(원본명,저장명)를 담아줄 LIST 
		List<FileBoardDto> uploadFileList=new ArrayList<>();
		
		for(MultipartFile multipartFile:files) {
			//원본파일명 구하기
			String origin_filename=multipartFile.getOriginalFilename();
			//저장파일명 구하기: 32자리생성(1234567812345678~.txt)
			String stored_filename=UUID.randomUUID()
			+origin_filename.substring(origin_filename.indexOf("."));
			//파일저장 경로 구하기(파일명을 바꾸기위한 작업)
			String fileuploadUrl=uploadPath+"/"+stored_filename;
			multipartFile.transferTo(new File(fileuploadUrl));//upload실행
			//각각의 파일정보를 list에 저장하는 코드
			uploadFileList.add(new FileBoardDto(0,0,origin_filename,stored_filename));
		}
		//데이터베이스에 저장할 파일정보List 반환
		return uploadFileList;
	}
	
	//파일정보 가져오기
	public FileBoardDto getFileInfo(int file_seq) {
		return fileMapper.getFileInfo(file_seq);
	}

	public void fileDownload(String origin_filename, String stored_filename,
					HttpServletRequest request,HttpServletResponse response) 
					throws UnsupportedEncodingException {
		
		//저장경로(수정해야 함)
//		String filePath=request.getSession().getServletContext()
//				        .getRealPath("upload");
		//저장경로(수정함)
		String filePath=System.getProperty("user.dir") + "/upload/";
		                
		//다운로드를 위한 준비 작업
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition",
				            "attachment; fileName="
		                     +URLEncoder.encode(origin_filename,"UTF-8") );
		
		response.setHeader("Content-transfer", "binary");
		
		//파일 객체 생성
		File file=new File(filePath+"/"+stored_filename);
		
		FileInputStream fs =null;// 자바로 파일 읽어들이기위한 객체
		ServletOutputStream out= null;// 출력 객체
		
		try {
			fs = new FileInputStream(file);//파일 읽기위한 입력 객체 생성
			out = response.getOutputStream();//파일 출력 응답 객체 생성
			
			FileCopyUtils.copy(fs, out);// 읽고 쓰는 작업 실행
			response.flushBuffer();//남은 데이터 밀어내기
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException ee) {
			ee.printStackTrace();
		}catch (Exception e) {
			e.printStackTrace();
		}finally {
			try {
				out.flush();
				out.close();
				fs.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
}












