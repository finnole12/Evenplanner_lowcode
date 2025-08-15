sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Text",
], function (UIComponent, History, Controller, JSONModel, MessageToast, Text) {
    "use strict";

    return Controller.extend("eventsmanagement.controller.NewSurveyController", {
        onInit: function () {
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("NewSurvey").attachPatternMatched(this._onObjectMatched, this);

            const oModel = new JSONModel({
                title: "",
                description: "",
                anonymous: false,
                dueDate: new Date(),
                questions: [],
                eventId: "" // Initialize eventId
            });
            this.getView().setModel(oModel, "newSurveyModel");
        },

        _onObjectMatched: function (oEvent) {
            const eventId = oEvent.getParameter("arguments").eventId;
            const oModel = this.getView().getModel("newSurveyModel");
            oModel.setProperty("/eventId", eventId);
        },

        onAddQuestion: function () {
            const oModel = this.getView().getModel("newSurveyModel");
            const aQuestions = oModel.getProperty("/questions");
            aQuestions.push({
                text: "",
                isMultipleChoice: false,
                answers: []
            });
            oModel.setProperty("/questions", aQuestions);
            this._updateCreateButtonState();
        },

        onAddAnswer: function (oEvent) {
            const oModel = this.getView().getModel("newSurveyModel");
            const oContext = oEvent.getSource().getBindingContext("newSurveyModel");
            const aAnswers = oContext.getProperty("answers");
            aAnswers.push({
                text: ""
            });
            oContext.getModel().setProperty(oContext.getPath() + "/answers", aAnswers);
            this._updateCreateButtonState();
        },

        onCreateSurvey: function () {
            const oModel = this.getView().getModel("newSurveyModel");
            const oSurveyData = oModel.getData();

            // Format the dueDate to 'YYYY-MM-DD'
            const formattedDueDate = new Date(oSurveyData.dueDate).toISOString().split('T')[0];
            oSurveyData.dueDate = formattedDueDate;

            fetch('/service/low_code_attempt_6/createSurvey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(oSurveyData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create survey');
                }
                MessageToast.show("Survey created successfully.");
                this.onNavBack();
            })
            .catch(error => {
                console.error("Failed to create survey:", error);
                MessageToast.show("Failed to create survey.");
            });
        },

        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = UIComponent.getRouterFor(this);
                const oModel = this.getView().getModel("newSurveyModel");
                const sEventId = oModel.getProperty("/eventId");
                oRouter.navTo("Event", { eventPath: sEventId }, true);
            }
        },

        onInputChange: function () {
            this._updateCreateButtonState();
        },

        _updateCreateButtonState: function () {
            const oModel = this.getView().getModel("newSurveyModel");
            const oSurveyData = oModel.getData();
            let bEnableCreateButton = true;

            // Check if title and description are set
            if (!oSurveyData.title || !oSurveyData.description) {
                bEnableCreateButton = false;
            }

            // Check if there is at least one question
            if (oSurveyData.questions.length === 0) {
                bEnableCreateButton = false;
            }

            // Check each question for text and at least two answers with text
            oSurveyData.questions.forEach(question => {
                if (!question.text || question.answers.length < 2) {
                    bEnableCreateButton = false;
                }
                question.answers.forEach(answer => {
                    if (!answer.text) {
                        bEnableCreateButton = false;
                    }
                });
            });

            // Update the enabled state of the Create Survey button
            const oCreateSurveyButton = this.getView().byId("createSurveyButton");
            if (oCreateSurveyButton) {
                oCreateSurveyButton.setEnabled(bEnableCreateButton);
            }
        }
    });
});