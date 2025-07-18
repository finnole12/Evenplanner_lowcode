sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (UIComponent, History, Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("eventsmanagement.controller.EventController", {
        onInit: function () {
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("Event").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sEventId = window.decodeURIComponent(oEvent.getParameter("arguments").eventPath);
            this._fetchEventData(sEventId);
        },

        _fetchEventData: function (sEventId) {
            const sEventUrl = `/service/low_code_attempt_6/Events(ID='${sEventId}', IsActiveEntity='true')?$expand=surveys,messages`;

            fetch(sEventUrl, {
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
            .then(eventData => {
                return fetch('/service/low_code_attempt_6/getCurrentUserId', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch current user ID');
                    }
                    return response.json();
                })
                .then(userData => {
                    const sUserRole = eventData.manager_ID === userData.id ? "Event Manager" : "Participant";

                    if (sUserRole === "Participant") {
                        const sParticipantEventUrl = `/service/low_code_attempt_6/ParticipantEvents(someid='${sEventId}')?$expand=surveys,messages`;
                        return fetch(sParticipantEventUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch participant event data');
                            }
                            return response.json();
                        })
                        .then(participantEventData => {
                            participantEventData.userRole = sUserRole;
                            participantEventData.newMessage = "";

                            const oJsonModel = new JSONModel(participantEventData);
                            this.getView().setModel(oJsonModel, "eventModel");
                        });
                    } else {
                        eventData.userRole = sUserRole;
                        eventData.newMessage = "";

                        const oJsonModel = new JSONModel(eventData);
                        this.getView().setModel(oJsonModel, "eventModel");
                    }
                });
            })
            .catch(error => {
                console.error("Failed to fetch data:", error);
            });
        },

        onMakePayment: function () {
            const oModel = this.getView().getModel("eventModel");
            const sEventId = oModel.getProperty("/ID");

            fetch('/service/low_code_attempt_6/makePayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventId: sEventId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to process payment');
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    MessageToast.show("Payment processed successfully.");
                    this._fetchEventData(sEventId); // Refresh the event data
                } else {
                    MessageToast.show("Payment processing failed.");
                }
            })
            .catch(error => {
                console.error("Failed to process payment:", error);
                MessageToast.show("Failed to process payment.");
            });
        },

        onSendMessage: function () {
            const oModel = this.getView().getModel("eventModel");
            const sEventId = oModel.getProperty("/ID");
            const sMessage = oModel.getProperty("/newMessage");

            if (!sMessage) {
                MessageToast.show("Please enter a message.");
                return;
            }

            fetch('/service/low_code_attempt_6/addMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventId: sEventId,
                    messageText: sMessage
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send message');
                }
                MessageToast.show("Message sent successfully.");
                oModel.setProperty("/newMessage", "");

                this._fetchEventData(sEventId);
            })
            .catch(error => {
                console.error("Failed to send message:", error);
                MessageToast.show("Failed to send message.");
            });
        },

        onDetailsPress: function () {
            // Implement the logic for the Details button press
        },

        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("EventsList", {}, true);
            }
        }
    });
});