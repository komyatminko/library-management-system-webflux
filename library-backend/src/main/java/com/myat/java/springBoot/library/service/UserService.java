package com.myat.java.springBoot.library.service;

import com.myat.java.springBoot.library.dto.UserDto;

import reactor.core.publisher.Flux;


public interface UserService {

	public Flux<UserDto> getAllUsers();
	
}
