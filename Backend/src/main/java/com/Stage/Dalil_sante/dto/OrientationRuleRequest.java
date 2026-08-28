package com.Stage.Dalil_sante.dto;

public class OrientationRuleRequest {

    private Integer priority;

    private Boolean active;

    public OrientationRuleRequest() {
    }

    public OrientationRuleRequest(
            Integer priority,
            Boolean active
    ) {
        this.priority = priority;
        this.active = active;
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
}