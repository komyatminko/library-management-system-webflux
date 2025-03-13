package com.myat.java.springBoot.library.controller.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myat.java.springBoot.library.dto.UserDto;
import com.myat.java.springBoot.library.exception.BookNotFoundException;
import com.myat.java.springBoot.library.exception.UserNotFoundException;
import com.myat.java.springBoot.library.response.ApiResponse;
import com.myat.java.springBoot.library.service.UserService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("v1/users")
public class UserController {

	@Autowired
	private UserService userService;
	
	@GetMapping
	public Mono<ResponseEntity<ApiResponse>> getAllUsers() {
	    return this.userService.getAllUsers()
	        .collectList()  
	        .map(users -> ResponseEntity.ok(ApiResponse.success(
	            "Users have been retrieved successfully.", 200, users 
	        )));
	}

	
	@PostMapping("/save")
	public Mono<UserDto> saveUser(@RequestBody UserDto userDto){
		return this.userService.saveUser(userDto);
		
	}
	
	@PutMapping("/{id}")
	public Mono<ResponseEntity<ApiResponse>> updateUser(@RequestBody UserDto userDto){
		return this.userService.updateUser(userDto)
				.map(user -> {
					return ResponseEntity.ok().body(ApiResponse.success("User updated successfully.", 200, user));
				})
				.onErrorResume(UserNotFoundException.class,err -> {
					return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "User not found to update.", err.getMessage())));
				});
	}
}
