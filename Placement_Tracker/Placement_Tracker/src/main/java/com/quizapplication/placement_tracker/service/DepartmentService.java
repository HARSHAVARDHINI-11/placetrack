package com.quizapplication.placement_tracker.service;

import com.quizapplication.placement_tracker.dto.DepartmentDTO;
import com.quizapplication.placement_tracker.entity.Department;
import com.quizapplication.placement_tracker.entity.DepartmentGroup;
import com.quizapplication.placement_tracker.exception.ResourceAlreadyExistsException;
import com.quizapplication.placement_tracker.exception.ResourceNotFoundException;
import com.quizapplication.placement_tracker.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        if (departmentRepository.existsByDepartmentName(departmentDTO.getDepartmentName())) {
            throw new ResourceAlreadyExistsException("Department with name '" + departmentDTO.getDepartmentName() + "' already exists");
        }

        // Auto-generate department code if not provided
        String departmentCode = departmentDTO.getDepartmentCode();
        if (departmentCode == null || departmentCode.trim().isEmpty()) {
            departmentCode = generateDepartmentCode(departmentDTO.getDepartmentName());
        }

        if (departmentRepository.existsByDepartmentCode(departmentCode)) {
            throw new ResourceAlreadyExistsException("Department with code '" + departmentCode + "' already exists");
        }

        Department department = new Department();
        department.setDepartmentName(departmentDTO.getDepartmentName());
        department.setDepartmentCode(departmentCode);
        department.setDescription(departmentDTO.getDescription());
        department.setDepartmentGroup(departmentDTO.getDepartmentGroup());

        Department savedDepartment = departmentRepository.save(department);
        return convertToDTO(savedDepartment);
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(String id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return convertToDTO(department);
    }

    public List<DepartmentDTO> getRelatedDepartments(String departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        
        return departmentRepository.findByDepartmentGroup(department.getDepartmentGroup()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DepartmentDTO> getDepartmentsByGroup(DepartmentGroup group) {
        return departmentRepository.findByDepartmentGroup(group).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentDTO updateDepartment(String id, DepartmentDTO departmentDTO) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (!department.getDepartmentName().equals(departmentDTO.getDepartmentName()) &&
                departmentRepository.existsByDepartmentName(departmentDTO.getDepartmentName())) {
            throw new ResourceAlreadyExistsException("Department with name '" + departmentDTO.getDepartmentName() + "' already exists");
        }

        // Auto-generate department code if not provided
        String departmentCode = departmentDTO.getDepartmentCode();
        if (departmentCode == null || departmentCode.trim().isEmpty()) {
            departmentCode = generateDepartmentCode(departmentDTO.getDepartmentName());
        }

        department.setDepartmentName(departmentDTO.getDepartmentName());
        department.setDepartmentCode(departmentCode);
        department.setDescription(departmentDTO.getDescription());
        department.setDepartmentGroup(departmentDTO.getDepartmentGroup());

        Department updatedDepartment = departmentRepository.save(department);
        return convertToDTO(updatedDepartment);
    }

    @Transactional
    public void deleteDepartment(String id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }

    /**
     * Generates a department code from the department name.
     * Strategy:
     * 1. If name has multiple words, take first letter of each word (e.g., "Computer Science" -> "CS")
     * 2. If name is single word, take capital letters or first 3-4 characters
     * @param departmentName the department name
     * @return generated department code
     */
    private String generateDepartmentCode(String departmentName) {
        if (departmentName == null || departmentName.trim().isEmpty()) {
            return "DEPT";
        }

        String trimmedName = departmentName.trim();
        
        // Split by spaces, hyphens, or common separators
        String[] words = trimmedName.split("[\\s-]+");
        
        if (words.length > 1) {
            // Multiple words: take first letter of each word
            StringBuilder code = new StringBuilder();
            for (String word : words) {
                if (!word.isEmpty()) {
                    code.append(Character.toUpperCase(word.charAt(0)));
                }
            }
            return code.toString();
        } else {
            // Single word: extract capital letters or use first few characters
            StringBuilder code = new StringBuilder();
            for (char c : trimmedName.toCharArray()) {
                if (Character.isUpperCase(c)) {
                    code.append(c);
                }
            }
            
            // If no capital letters found, use first 3-4 characters
            if (code.length() == 0) {
                int length = Math.min(4, trimmedName.length());
                return trimmedName.substring(0, length).toUpperCase();
            }
            
            return code.toString();
        }
    }

    private DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setDepartmentName(department.getDepartmentName());
        dto.setDepartmentCode(department.getDepartmentCode());
        dto.setDescription(department.getDescription());
        dto.setDepartmentGroup(department.getDepartmentGroup());
        return dto;
    }
}
