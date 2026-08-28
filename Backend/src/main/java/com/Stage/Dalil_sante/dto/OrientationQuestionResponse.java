package com.Stage.Dalil_sante.dto;

public class OrientationQuestionResponse {

    private Long id;

    private String questionText;

    private Integer questionOrder;

    private Boolean active;

    public OrientationQuestionResponse() {
    }

    public OrientationQuestionResponse(
            Long id,
            String questionText,
            Integer questionOrder,
            Boolean active
    ) {
        this.id = id;
        this.questionText = questionText;
        this.questionOrder = questionOrder;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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