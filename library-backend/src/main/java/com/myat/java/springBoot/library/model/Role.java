package com.myat.java.springBoot.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.security.core.GrantedAuthority;

public class Role implements GrantedAuthority{

	private String role;
	
	  public String getRole() {
	      return role;
	  }

	  public void setRole(String role) {
	      this.role = role;
	  }

	@Override
	public String getAuthority() {
		
		return this.role;
	}
}
