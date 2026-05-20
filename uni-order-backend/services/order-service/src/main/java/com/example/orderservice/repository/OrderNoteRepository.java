package com.example.orderservice.repository;

import com.example.orderservice.entity.OrderNoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderNoteRepository extends JpaRepository<OrderNoteEntity,Long> {
}
