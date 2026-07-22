package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.OrientationQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrientationQuestionRepository
        extends JpaRepository<OrientationQuestion, Long> {

    List<OrientationQuestion> findByActiveTrue();

    List<OrientationQuestion> findAllByOrderByQuestionOrderAsc();
}
