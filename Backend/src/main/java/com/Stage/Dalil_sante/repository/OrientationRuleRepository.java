package com.Stage.Dalil_sante.repository;

import com.Stage.Dalil_sante.entity.OrientationRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrientationRuleRepository
        extends JpaRepository<OrientationRule, Long> {

    List<OrientationRule> findByOptionId(Long optionId);

    List<OrientationRule>
    findByOptionIdAndActiveTrueOrderByPriorityDesc(Long optionId);
}