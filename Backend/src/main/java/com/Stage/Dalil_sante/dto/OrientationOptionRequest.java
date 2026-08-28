package com.Stage.Dalil_sante.dto;

public class OrientationOptionRequest {

    private String optionText;

    private Integer optionOrder;

    private Boolean active;

    public OrientationOptionRequest() {
    }

    public OrientationOptionRequest(
            String optionText,
            Integer optionOrder,
            Boolean active
    ) {
        this.optionText = optionText;
        this.optionOrder = optionOrder;
        this.active = active;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Integer getOptionOrder() {
        return optionOrder;
    }

    public void setOptionOrder(Integer optionOrder) {
        this.optionOrder = optionOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}