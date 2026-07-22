package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.OrientationOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrientationOptionRepository
        extends JpaRepository<OrientationOption, Long> {

    List<OrientationOption>
    findByQuestionIdOrderByOptionOrderAsc(Long questionId);

    List<OrientationOption>
    findByQuestionIdAndActiveTrueOrderByOptionOrderAsc(Long questionId);
}
