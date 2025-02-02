package com.myat.java.springBoot.library.test;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import com.myat.java.springBoot.library.dao.UserDao;
import com.myat.java.springBoot.library.model.Role;
import com.myat.java.springBoot.library.model.User;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Rollback(false)
public class SecurityUtil {
	@Autowired
	UserDao userRepository;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Test
	void testAddUser()
	{
		System.out.println("Start test");
		User user = new User();
		user.setUsername("admin");
		user.setPassword(this.passwordEncoder.encode("adminone"));
		user.setEmail("admin@gmail.com");
		
		Role role = new Role();
		role.setRole("ADMIN");
		
		List<Role> roles = new ArrayList<Role>();
		roles.add(role);
		user.setRoles(roles);
		
		this.userRepository.save(user)
			.subscribe(data->{
				System.out.println("User saved "+data);
			});
	
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
	}
}
