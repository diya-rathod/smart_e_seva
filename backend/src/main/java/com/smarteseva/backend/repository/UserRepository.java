package com.smarteseva.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smarteseva.backend.model.User;

@Repository
// Dhyaan dein, yahan 'class' ki jagah 'interface' likha hai
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA automatically creates a query to find a user by their email
    Optional<User> findByEmail(String email);
    // Inside the UserRepository interface

    List<User> findByRole(String role);

    List<User> findByRoleAndAvailabilityStatus(String role, String availabilityStatus);

    

}