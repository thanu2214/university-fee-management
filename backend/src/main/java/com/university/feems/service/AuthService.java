package com.university.feems.service;

import com.university.feems.dto.AuthRequest;
import com.university.feems.dto.AuthResponse;
import com.university.feems.dto.UserDto;

public interface AuthService {
    AuthResponse login(AuthRequest authRequest);
    UserDto getCurrentUser();
}
