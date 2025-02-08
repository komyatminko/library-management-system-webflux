package com.myat.java.springBoot.library.controller.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myat.java.springBoot.library.dto.AuthorDto;
import com.myat.java.springBoot.library.service.AuthorService;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/v1/authors")
public class AuthorController {

	@Autowired
	private AuthorService authorService;
	
	@GetMapping
	private Flux<AuthorDto> getAllAuthors(){
		return this.authorService.getAllAuthors();
	}
	
}
