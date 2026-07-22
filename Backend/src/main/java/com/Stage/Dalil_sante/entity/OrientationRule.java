package com.Stage.Dalil_sante.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orientation_rules")
public class OrientationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer priority;

    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id", nullable = false)
    private OrientationOption option;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private OrientationResult result;

    public OrientationRule() {
    }

    public OrientationRule(
            Integer priority,
            Boolean active,
            OrientationOption option,
            OrientationResult result
    ) {
        this.priority = priority;
        this.active = active;
        this.option = option;
        this.result = result;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public OrientationOption getOption() {
        return option;
    }

    public void setOption(OrientationOption option) {
        this.option = option;
    }

    public OrientationResult getResult() {
        return result;
    }

    public void setResult(OrientationResult result) {
        this.result = result;
    }
}