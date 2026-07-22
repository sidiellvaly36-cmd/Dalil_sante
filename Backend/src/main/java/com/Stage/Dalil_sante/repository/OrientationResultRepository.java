package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.OrientationResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrientationResultRepository
        extends JpaRepository<OrientationResult, Long> {

    List<OrientationResult> findByActiveTrue();

    List<OrientationResult> findByUrgencyLevel(
            String urgencyLevel
    );
}
