package com.smarteseva.backend.repository;

import com.smarteseva.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
// Dhyaan dein, yahan 'class' ki jagah 'interface' likha hai
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA automatically creates a query to find a user by their email
    Optional<User> findByEmail(String email);

}