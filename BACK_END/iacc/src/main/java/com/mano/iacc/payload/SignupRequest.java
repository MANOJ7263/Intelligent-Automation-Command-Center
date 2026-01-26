package com.mano.iacc.payload;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String role;
    private String password;
    private String department;
}
