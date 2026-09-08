package com.university.feems.service.impl;

import com.university.feems.dto.StaffCreateRequest;
import com.university.feems.dto.UserDto;
import com.university.feems.entity.Role;
import com.university.feems.entity.User;
import com.university.feems.exception.BadRequestException;
import com.university.feems.exception.ResourceNotFoundException;
import com.university.feems.repository.UserRepository;
import com.university.feems.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto createStaff(StaffCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        String rawPassword = request.getPassword() != null && !request.getPassword().trim().isEmpty()
                ? request.getPassword()
                : "Staff@123";

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(rawPassword),
                request.getEmail(),
                request.getFullName(),
                Role.ROLE_FINANCE_STAFF,
                request.getPhone()
        );

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public UserDto updateStaff(Long id, StaffCreateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Finance Staff user not found with ID: " + id));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getStaffById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Finance Staff user not found with ID: " + id));
        return mapToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllFinanceStaff() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.ROLE_FINANCE_STAFF).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void toggleStaffStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Finance Staff user not found with ID: " + id));
        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteStaff(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Finance Staff user not found with ID: " + id));
        userRepository.delete(user);
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getPhone(),
                user.getActive(),
                user.getCreatedAt()
        );
    }
}
