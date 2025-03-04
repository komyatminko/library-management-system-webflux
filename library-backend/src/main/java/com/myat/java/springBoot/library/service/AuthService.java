package com.myat.java.springBoot.library.service;

import com.myat.java.springBoot.library.dto.JWTToken;

import com.myat.java.springBoot.library.model.User;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;


public interface AuthService {
	Mono<JWTToken> register(User user);
	Mono<JWTToken> login(User user);
	
}
