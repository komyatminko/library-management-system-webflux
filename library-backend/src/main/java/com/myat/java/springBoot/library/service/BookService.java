package com.myat.java.springBoot.library.service;


import java.io.IOException;
import java.util.Map;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.multipart.MultipartFile;

import com.myat.java.springBoot.library.dto.BookDto;
import com.myat.java.springBoot.library.dto.BorrowedUserDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface BookService {

	public Flux<BookDto> getAllBook();
	public Mono<BookDto> getBookByName(String name);
	public Mono<BookDto> getBookById(String id);
	public Mono<BookDto> getBookByIdWithBorrowedUsers(String id);
	public Mono<BookDto> saveBook(BookDto bookDto);
	public Mono<BookDto> updateBook(BookDto bookDto);
	public Mono<BookDto> deleteBookById(String id);
	
	public Mono<String> uploadImage(FilePart filePart, String uploadFolderName);
	public Mono<Boolean> deleteImage(String filePath);
}
