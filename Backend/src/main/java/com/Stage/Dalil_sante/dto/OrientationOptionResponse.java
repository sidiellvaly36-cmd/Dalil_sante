package com.Stage.Dalil_sante.dto;

public class OrientationOptionResponse {

    private Long id;

    private String optionText;

    private Integer optionOrder;

    private Boolean active;

    private Long questionId;

    public OrientationOptionResponse() {
    }

    public OrientationOptionResponse(
            Long id,
            String optionText,
            Integer optionOrder,
            Boolean active,
            Long questionId
    ) {
        this.id = id;
        this.optionText = optionText;
        this.optionOrder = optionOrder;
        this.active = active;
        this.questionId = questionId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
}