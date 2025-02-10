package com.myat.java.springBoot.library.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.ResourceHandlerRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
@EnableWebFlux
public class StaticResourceConfig implements WebFluxConfigurer{
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve all files under /images/
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:images/");
    }
}
