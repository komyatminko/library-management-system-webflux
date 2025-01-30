package com.myat.java.springBoot.library.service;


import com.myat.java.springBoot.library.dto.BookDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface BookService {

//	public Flux<BookDto> getAllBook();
//	public Mono<BookDto> getBookByName(String name);
//	public Mono<BookDto> getBookById(String id);
	public Mono<BookDto> saveBook(BookDto bookDto);
	public Mono<BookDto> deleteBookById(String id);
}
