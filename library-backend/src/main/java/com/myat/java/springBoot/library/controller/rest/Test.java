package com.myat.java.springBoot.library.controller.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@RestController
public class Test {

	@GetMapping("/test")
	public Mono<String> Test(){
		System.out.println("Test Method");
		return Mono.just("Hello");
	}
	
}
