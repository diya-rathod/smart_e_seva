package com.smarteseva.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smarteseva.backend.entity.Complaint;
import com.smarteseva.backend.model.User;


@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Spring Data JPA will automatically create all basic CRUD methods for us
    // (findAll, findById, save, delete, etc.)

    List<Complaint> findByAgent(User agent);
    List<Complaint> findByStatus(String status);
    List<Complaint> findByCitizen(User citizen);
}