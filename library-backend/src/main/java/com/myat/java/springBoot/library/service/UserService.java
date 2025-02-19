package com.myat.java.springBoot.library.service;

import com.myat.java.springBoot.library.dto.UserDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface UserService {

	public Flux<UserDto> getAllUsers();
	public Mono<UserDto> saveUser(UserDto userDto);
	
}
