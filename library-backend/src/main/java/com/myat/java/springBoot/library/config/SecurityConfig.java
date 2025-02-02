package com.myat.java.springBoot.library.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;

import com.myat.java.springBoot.library.jwt.JWTHeadersExchangeMatcher;
import com.myat.java.springBoot.library.jwt.JWTReactiveAuthenticationManager;
import com.myat.java.springBoot.library.jwt.JwtUtil;
import com.myat.java.springBoot.library.jwt.TokenAuthenticationConverter;
import com.myat.java.springBoot.library.serviceImpl.ReactiveUserDetailsServiceImpl;

import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity

public class SecurityConfig {
	
	@Autowired
	ReactiveUserDetailsServiceImpl reactiveUserDetailsService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	private static final String[] AUTH_WHITELIST = {
            "/public/**",
            "/v1/books/**",
            "/admin/books/**",
    };
	
	@Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
		
        return http
        		.cors().disable()
                .csrf().disable()
                .authorizeExchange()
                .pathMatchers("/api/auth/register", "/api/auth/login").permitAll()
                .pathMatchers(AUTH_WHITELIST).permitAll()
                .anyExchange().authenticated()
                .and()
                .addFilterAt(webFilter(), SecurityWebFiltersOrder.AUTHORIZATION)
                .httpBasic().disable()
                .formLogin().disable()
                .build();
    }

	@Bean
    public JWTReactiveAuthenticationManager repositoryReactiveAuthenticationManager() {
        JWTReactiveAuthenticationManager repositoryReactiveAuthenticationManager = new JWTReactiveAuthenticationManager(reactiveUserDetailsService, passwordEncoder());
        return repositoryReactiveAuthenticationManager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationWebFilter webFilter() {
        AuthenticationWebFilter authenticationWebFilter = new AuthenticationWebFilter(repositoryReactiveAuthenticationManager());
        authenticationWebFilter.setAuthenticationConverter(new TokenAuthenticationConverter(jwtUtil));
        authenticationWebFilter.setRequiresAuthenticationMatcher(new JWTHeadersExchangeMatcher());
        authenticationWebFilter.setSecurityContextRepository(new WebSessionServerSecurityContextRepository());
        return authenticationWebFilter;
    }
    
}
