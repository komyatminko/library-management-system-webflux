package com.myat.java.springBoot.library.service;

import com.myat.java.springBoot.library.dto.AuthorDto;

import reactor.core.publisher.Flux;

public interface AuthorService {

	public Flux<AuthorDto> getAllAuthors();
	
}
