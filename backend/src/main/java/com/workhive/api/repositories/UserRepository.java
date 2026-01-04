package com.workhive.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.workhive.api.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(
            value = "SELECT * FROM users WHERE email = :email",
            nativeQuery = true
    )
    Optional<User> findByEmail(@Param("email") String email);

    @Query(value = """
        SELECT * FROM users u
        WHERE u.id NOT IN (
            SELECT DISTINCT r.user_id FROM reservations r
        )
        """, nativeQuery = true)
    List<User> findUsersWithNoReservations();
}
