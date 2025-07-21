sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (UIComponent, History, Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("eventsmanagement.controller.NewEventController", {
        onInit: function () {
            const oRouter = UIComponent.getRouterFor(this);
            const oModel = new JSONModel({
                newEvent: {
                    title: "",
                    description: "",
                    price: 0,
                    isPublic: true,
                    maxParticipants: 0,
                    whitelistedEmails: ""
                }
            });
            this.getView().setModel(oModel, "newEventModel");
        },

        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("EntryPage", {}, true);
            }
        },

        onCreateEvent: function () {
            const oModel = this.getView().getModel("newEventModel");
            const oNewEvent = oModel.getProperty("/newEvent");

            const payload = {
                title: oNewEvent.title,
                description: oNewEvent.description,
                price: oNewEvent.price,
                currency: "EUR", // Assuming currency is EUR, adjust as needed
                dueDate: new Date().toISOString().split('T')[0], // Assuming current date, adjust as needed
                isPublic: oNewEvent.isPublic,
                maxCapacity: oNewEvent.maxParticipants,
            };

            fetch('/service/low_code_attempt_6/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create event');
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    MessageToast.show("Event created successfully.");
                    this.onNavBack();
                } else {
                    MessageToast.show("Event creation failed.");
                }
            })
            .catch(error => {
                console.error("Failed to create event:", error);
                MessageToast.show("Failed to create event.");
            });
        }
    });
});