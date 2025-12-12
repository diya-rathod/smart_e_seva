package com.smarteseva.backend.repository;

import com.smarteseva.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Agent ke purane notifications nikalne ke liye (Latest pehle)
    List<Notification> findByRecipientIdOrderByTimestampDesc(Long recipientId);
    
    // Sirf unread count ke liye (Optional, performance ke liye)
    long countByRecipientIdAndIsReadFalse(Long recipientId);
}