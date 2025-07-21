sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (UIComponent, History, Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("eventsmanagement.controller.EventDetailsController", {
        onInit: function () {
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("EventDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sEventId = window.decodeURIComponent(oEvent.getParameter("arguments").eventPath);
            this._fetchEventDetails(sEventId);
        },

        _fetchEventDetails: function (sEventId) {
            // First, retrieve the current user's ID using the getCurrentUserId endpoint
            fetch('/service/low_code_attempt_6/getCurrentUserId', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to retrieve current user ID');
                }
                return response.json();
            })
            .then(userData => {
                this._sCurrentUserId = userData.id;

                // Now fetch the event details
                const sEventUrl = `/service/low_code_attempt_6/Events(ID='${sEventId}', IsActiveEntity='true')?$expand=participants($expand=user)`;

                return fetch(sEventUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(eventData => {
                // Determine the role of the current user
                let sUserRole = "Participant"; // Default role
                if (eventData.manager_ID === this._sCurrentUserId) {
                    sUserRole = "Manager";
                }

                // Add the role to each participant
                eventData.role = sUserRole

                const oJsonModel = new JSONModel(eventData);
                this.getView().setModel(oJsonModel, "eventModel");
            })
            .catch(error => {
                console.error("Failed to fetch data:", error);
            });
        },

        onKickParticipant: function (oEvent) {
            const oModel = this.getView().getModel("eventModel");
            const sParticipantId = oEvent.getSource().getBindingContext("eventModel").getProperty("ID");

            fetch('/service/low_code_attempt_6/kickParticipant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participantId: sParticipantId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to kick participant');
                }
                MessageToast.show("Participant kicked successfully.");
                this._fetchEventDetails(oModel.getProperty("/ID"));
            })
            .catch(error => {
                console.error("Failed to kick participant:", error);
                MessageToast.show("Failed to kick participant.");
            });
        },

        onLeaveEvent: function (oEvent) {
            const oModel = this.getView().getModel("eventModel");
            const sParticipantId = oEvent.getSource().getBindingContext("eventModel").getProperty("ID");

            fetch('/service/low_code_attempt_6/leaveEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participantId: sParticipantId })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to leave event');
                }
                MessageToast.show("You have left the event successfully.");
                this._fetchEventDetails(oModel.getProperty("/ID"));
            })
            .catch(error => {
                console.error("Failed to leave event:", error);
                MessageToast.show("Failed to leave event.");
            });
        },

        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("Event", {}, true);
            }
        }
    });
});