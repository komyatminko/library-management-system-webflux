package com.myat.java.springBoot.library.serviceImpl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myat.java.springBoot.library.dao.AuthorDao;
import com.myat.java.springBoot.library.dto.AuthorDto;
import com.myat.java.springBoot.library.service.AuthorService;

import reactor.core.publisher.Flux;

@Service
public class AuthorServiceImpl implements AuthorService{

	
	@Autowired
	private AuthorDao authorDao;
	
	ModelMapper modelMapper = new ModelMapper();
	
	@Override
	public Flux<AuthorDto> getAllAuthors() {
		
		return this.authorDao.findAll()
				.map(author -> this.modelMapper.map(author, AuthorDto.class));
	}

}
