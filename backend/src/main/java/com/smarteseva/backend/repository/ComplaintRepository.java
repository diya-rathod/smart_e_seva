package com.smarteseva.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smarteseva.backend.entity.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Spring Data JPA will automatically create all basic CRUD methods for us
    // (findAll, findById, save, delete, etc.)
}