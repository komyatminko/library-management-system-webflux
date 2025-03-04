package com.myat.java.springBoot.library.controller.rest;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;
import com.myat.java.springBoot.library.dao.UserDao;
import com.myat.java.springBoot.library.dto.JWTToken;
import com.myat.java.springBoot.library.jwt.JwtUtil;
import com.myat.java.springBoot.library.model.User;
import com.myat.java.springBoot.library.service.AuthService;

import jakarta.validation.Valid;
import jakarta.validation.Validator;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(value = { "http://localhost:4200" })
public class AuthController {
	
	@Autowired
	private Validator validation;
	
	@Autowired
	AuthService authService;
	
    @PostMapping("/register")
    public Mono<JWTToken> register(@Valid @RequestBody User user) {
    	System.out.println("register");
        if (!this.validation.validate(user).isEmpty()) {
            return Mono.error(new RuntimeException("Bad request"));
        }
        return this.authService.register(user);
    }
    
   
    @PostMapping("/login")
    public Mono<ResponseEntity<JWTToken>> login(@RequestBody User user) {
        return authService.login(user)
            .flatMap(token -> {
                ResponseCookie jwtCookie = ResponseCookie.from("jwt", token.getToken()) // Store JWT in cookie
                        .httpOnly(true)
                        .secure(true) // Set to false for local testing if needed
                        .path("/")
                        .maxAge(86400) // 1 day expiration
                        .build();
                
                

                return Mono.just(ResponseEntity.ok()
                        .header("Set-Cookie", jwtCookie.toString())
                        .body(token));
            });
    }
    
    @PostMapping("/logout")
	public Mono<ResponseEntity<String>> logout() {
	    ResponseCookie jwtCookie = ResponseCookie.from("jwt", "") // Clear the JWT cookie
	            .httpOnly(true)
	            .secure(false)
	            .path("/")
	            .maxAge(0) // 👈 Expire immediately
	            .build();

	    return Mono.just(ResponseEntity.ok()
	            .header("Set-Cookie", jwtCookie.toString()) // 👈 Must include this!
	            .body("Logged out successfully"));
	}
	
}
