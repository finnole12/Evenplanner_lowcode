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
            const sEventUrl = `/service/low_code_attempt_6/Events(ID='${sEventId}', IsActiveEntity='true')?$expand=surveys,messages`;

            // Fetch the event data using the fetch API
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
                // Fetch the current user ID
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
                    // Determine the user's role
                    const sUserRole = eventData.manager_ID === userData.id ? "Event Manager" : "Participant";

                    // Add the user's role to the event data
                    eventData.userRole = sUserRole;
                    eventData.newMessage = ""; // Initialize new message property

                    // Create a JSON model with the updated event data
                    const oJsonModel = new JSONModel(eventData);
                    this.getView().setModel(oJsonModel, "eventModel");
                });
            })
            .catch(error => {
                console.error("Failed to fetch data:", error);
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

            // Send the message to the backend
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
                oModel.setProperty("/newMessage", ""); // Clear the input field

                // Refetch the event data to update the messages list
                this._onObjectMatched({ getParameter: () => ({ eventPath: encodeURIComponent(sEventId) }) });
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