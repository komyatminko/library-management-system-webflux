package com.myat.java.springBoot.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.security.core.GrantedAuthority;

public class Role implements GrantedAuthority{
	@Id
	private String id;

	private String role;
	
	 public String getId() {
	      return id;
	  }

	  public void setId(String id) {
	      this.id = id;
	  }

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
