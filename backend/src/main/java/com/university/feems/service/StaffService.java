package com.university.feems.service;

import com.university.feems.dto.StaffCreateRequest;
import com.university.feems.dto.UserDto;

import java.util.List;

public interface StaffService {
    UserDto createStaff(StaffCreateRequest request);
    UserDto updateStaff(Long id, StaffCreateRequest request);
    UserDto getStaffById(Long id);
    List<UserDto> getAllFinanceStaff();
    void toggleStaffStatus(Long id);
    void deleteStaff(Long id);
}
