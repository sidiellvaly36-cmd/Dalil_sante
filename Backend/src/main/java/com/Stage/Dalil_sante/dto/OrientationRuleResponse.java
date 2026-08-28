package com.Stage.Dalil_sante.dto;

public class OrientationRuleResponse {

    private Long id;

    private Integer priority;

    private Boolean active;

    private Long optionId;

    private Long resultId;

    public OrientationRuleResponse() {
    }

    public OrientationRuleResponse(
            Long id,
            Integer priority,
            Boolean active,
            Long optionId,
            Long resultId
    ) {
        this.id = id;
        this.priority = priority;
        this.active = active;
        this.optionId = optionId;
        this.resultId = resultId;
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

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }
}