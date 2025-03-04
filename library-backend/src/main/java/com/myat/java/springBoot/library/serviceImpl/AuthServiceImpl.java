package com.myat.java.springBoot.library.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import com.myat.java.springBoot.library.dao.UserDao;
import com.myat.java.springBoot.library.dto.JWTToken;
import com.myat.java.springBoot.library.jwt.JWTReactiveAuthenticationManager;
import com.myat.java.springBoot.library.jwt.JwtUtil;
import com.myat.java.springBoot.library.model.Role;
import com.myat.java.springBoot.library.model.User;
import com.myat.java.springBoot.library.service.AuthService;

import jakarta.validation.Validator;
import reactor.core.publisher.Mono;

@Service
public class AuthServiceImpl implements AuthService{
	
	private final JwtUtil tokenProvider;
    private final JWTReactiveAuthenticationManager authenticationManager;
    
    @Autowired
	private UserDao userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

    public AuthServiceImpl(JwtUtil tokenProvider,
            JWTReactiveAuthenticationManager authenticationManager,
            Validator validation) {
		this.tokenProvider = tokenProvider;
		this.authenticationManager = authenticationManager;
	}

	@Override
	public Mono<JWTToken> register(User user) {
		return this.userRepository.findByUsername(user.getUsername())
			    .map(userEntity->{
					throw new RuntimeException("User already exist");
				})
			    .switchIfEmpty(Mono.defer(()->this.registerUser(user)))
			    .cast(User.class)
			    .flatMap(saveUser->{
			    	System.out.println("New user have been saved "+saveUser);
			    	return this.login(user);
			    });
	}

	@Override
	public Mono<JWTToken> login(User user) {
		Authentication authenticationToken =
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());

        Mono<Authentication> authentication = this.authenticationManager.authenticate(authenticationToken);
        authentication.doOnError(throwable -> {
            throw new BadCredentialsException("Bad crendentials");
        });
        ReactiveSecurityContextHolder.withAuthentication(authenticationToken);

        return authentication.map(auth -> {
            String jwt = tokenProvider.createToken(auth);
            
            return new JWTToken(jwt);
        });
	}
	

	 Mono<User> registerUser(User user)
	    {
		   	User newUser = new User();
	    	newUser.setUsername(user.getUsername());
	    	newUser.setPassword(this.passwordEncoder.encode(user.getPassword()));
	    	newUser.setEmail(user.getEmail());
	    	newUser.setRoles(user.getRoles());
	    	return this.userRepository.save(newUser);
	    }
}
