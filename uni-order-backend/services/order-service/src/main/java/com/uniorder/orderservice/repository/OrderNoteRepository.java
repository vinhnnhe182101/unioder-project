package com.uniorder.orderservice.repository;

import com.uniorder.orderservice.entity.OrderNoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderNoteRepository extends JpaRepository<OrderNoteEntity,Long> {
}
