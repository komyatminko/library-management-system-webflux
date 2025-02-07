package com.myat.java.springBoot.library.controller.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myat.java.springBoot.library.dto.UserDto;
import com.myat.java.springBoot.library.exception.BookNotFoundException;
import com.myat.java.springBoot.library.response.ApiResponse;
import com.myat.java.springBoot.library.service.UserService;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("v1/users")
public class UserController {

	@Autowired
	private UserService userService;
	
	@GetMapping
	public Flux<UserDto> getAllUsers(){
		return this.userService.getAllUsers();
				
				
	}
	
}
