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
            const sUserAnswersUrl = `/service/low_code_attempt_6/UserAnswers?$filter=answer/question/surveys_ID eq '${surveyData.ID}'&$expand=user,answer`;

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
                const userAnswers = userAnswersData.value;

                // Set selected answers for the current user
                surveyData.questions.forEach(question => {
                    if (!question.isMultipleChoice) {
                        question.selectedAnswer = question.answers.findIndex(answer => userAnswers.some(userAnswer => userAnswer.answer.ID === answer.ID));
                    } else {
                        question.answers.forEach(answer => {
                            answer.selectedAnswers = userAnswers.some(userAnswer => userAnswer.answer.ID === answer.ID);
                        });
                    }
                });

                // Calculate percentage of votes for each answer and determine the most picked answer
                const answerStatistics = surveyData.questions.map(question => {
                    const totalVotes = userAnswers.filter(userAnswer => question.answers.some(answer => answer.ID === userAnswer.answer.ID)).length;
                    const statistics = question.answers.map(answer => {
                        const votes = userAnswers.filter(userAnswer => userAnswer.answer.ID === answer.ID).length;
                        return {
                            questionText: question.text,
                            answerText: answer.text,
                            percentage: totalVotes ? (votes / totalVotes * 100).toFixed(2) + '%' : '0%',
                            votes: votes, // Store votes for comparison
                            isMostPicked: false // Initialize isMostPicked
                        };
                    });

                    // Sort answers by percentage
                    statistics.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

                    // Determine the most picked answer
                    const maxVotes = Math.max(...statistics.map(stat => stat.votes));
                    statistics.forEach(stat => {
                        stat.isMostPicked = stat.votes === maxVotes;
                    });

                    return statistics;
                }).flat();

                const oResultsModel = new JSONModel({
                    answerStatistics: answerStatistics,
                    userAnswers: userAnswers.map(userAnswer => ({
                        userName: userAnswer.user.name,
                        questionText: surveyData.questions.find(q => q.answers.some(a => a.ID === userAnswer.answer.ID)).text,
                        pickedAnswerText: surveyData.questions.flatMap(q => q.answers).filter(a => userAnswers.some(ua => ua.answer.ID === a.ID)).map(a => a.text).join(", ")
                    }))
                });

                this.getView().setModel(oResultsModel, "resultsModel");

                const oJsonModel = new JSONModel(surveyData);
                this.getView().setModel(oJsonModel, "surveyModel");

                this._updateSubmitButtonState();
                this.applyHighlightClass();
            })
            .catch(error => {
                console.error("Failed to fetch user answers:", error);
            });
        },

        _updateSubmitButtonState: function () {
            const oModel = this.getView().getModel("surveyModel");
            const aQuestions = oModel.getProperty("/questions");

            const bAllQuestionsAnswered = aQuestions.every(question => {
                if (!question.isMultipleChoice) {
                    return question.selectedAnswer !== undefined && question.selectedAnswer !== null;
                } else {
                    return question.answers.some(answer => answer.selectedAnswers === true);
                }
            });

            oModel.setProperty("/allQuestionsAnswered", bAllQuestionsAnswered);
        },

        onSelectionChange: function () {
            this._updateSubmitButtonState();
        },

        onSubmitSurvey: function () {
            const oModel = this.getView().getModel("surveyModel");
            const sSurveyId = oModel.getProperty("/ID");
            const aQuestions = oModel.getProperty("/questions");

            const aSelectedAnswerIds = aQuestions.map(question => {
                if (!question.isMultipleChoice) {
                    const selectedAnswerIndex = question.selectedAnswer;
                    return question.answers[selectedAnswerIndex].ID;
                } else {
                    return question.answers.filter(answer => answer.selectedAnswers === true).map(answer => answer.ID);
                }
            }).flat();

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
        },

        formatHighlightClass: function (isMostPicked) {
            return isMostPicked ? "highlightedAnswer" : "";
        },

        applyHighlightClass: function () {
            const oTable = this.byId("answerStatisticsTable");
            const aItems = oTable.getItems();
            aItems.forEach(item => {
                const oContext = item.getBindingContext("resultsModel");
                const isMostPicked = oContext.getProperty("isMostPicked");
                const sClass = this.formatHighlightClass(isMostPicked);
                item.addStyleClass(sClass);
            });
        }
    });
});