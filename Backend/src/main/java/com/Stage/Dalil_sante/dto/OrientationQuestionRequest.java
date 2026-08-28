package com.Stage.Dalil_sante.dto;

public class OrientationQuestionRequest {

    private String questionText;

    private Integer questionOrder;

    private Boolean active;

    public OrientationQuestionRequest() {
    }

    public OrientationQuestionRequest(
            String questionText,
            Integer questionOrder,
            Boolean active
    ) {
        this.questionText = questionText;
        this.questionOrder = questionOrder;
        this.active = active;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}