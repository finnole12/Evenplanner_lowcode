sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (UIComponent, History, Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("eventsmanagement.controller.SurveyController", {
        onInit: function () {
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("Survey").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sSurveyId = window.decodeURIComponent(oEvent.getParameter("arguments").surveyPath);
            this._fetchSurveyData(sSurveyId);
        },

        _fetchSurveyData: function (sSurveyId) {
            const sSurveyUrl = `/service/low_code_attempt_6/Surveys(ID='${sSurveyId}', IsActiveEntity='true')?$expand=questions($expand=answers)`;

            fetch(sSurveyUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(surveyData => {
                this._fetchUserAnswers(surveyData);
            })
            .catch(error => {
                console.error("Failed to fetch survey data:", error);
            });
        },

        _fetchUserAnswers: function (surveyData) {
            const sUserAnswersUrl = `/service/low_code_attempt_6/UserAnswers?$filter=answer_ID in (${surveyData.questions.map(q => q.answers.map(a => a.ID)).flat().join(',')})`;

            fetch(sUserAnswersUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(userAnswersData => {
                const userAnswers = userAnswersData.value.map(userAnswer => userAnswer.answer_ID);

                surveyData.questions.forEach(question => {
                    question.selectedAnswer = question.answers.findIndex(answer => userAnswers.includes(answer.ID));
                });

                const oJsonModel = new JSONModel(surveyData);
                this.getView().setModel(oJsonModel, "surveyModel");
            })
            .catch(error => {
                console.error("Failed to fetch user answers:", error);
            });
        },

        onSubmitSurvey: function () {
            const oModel = this.getView().getModel("surveyModel");
            const sSurveyId = oModel.getProperty("/ID");
            const aQuestions = oModel.getProperty("/questions");

            const aSelectedAnswerIds = aQuestions.map(question => {
                const selectedAnswerIndex = question.selectedAnswer;
                return question.answers[selectedAnswerIndex].ID;
            });

            fetch('/service/low_code_attempt_6/submitAnswers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    surveyId: sSurveyId,
                    answers: aSelectedAnswerIds
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit survey results');
                }
                MessageToast.show("Survey results submitted successfully.");
                this.onNavBack(); // Navigate back to the event page
            })
            .catch(error => {
                console.error("Failed to submit survey results:", error);
                MessageToast.show("Failed to submit survey results.");
            });
        },

        onNavBack: function () {
            const oModel = this.getView().getModel("surveyModel");
            const sEventId = oModel.getProperty("/event_ID"); // Assuming event_ID is part of the survey data

            const sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("Event", { eventPath: sEventId }, true);
            }
        }
    });
});