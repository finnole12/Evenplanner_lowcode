sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("eventsmanagement.controller.EntryPageController", {
        onInit: function () {
            console.log("incontrollerinit");
        },

        onEventPress: function (eventId) {
            console.log(eventId);
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Event", {
                eventPath: encodeURIComponent(eventId) // Use the event ID directly
            });
        },

        onNavToNewEvent: function () {
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("NewEvent");
        }
    });
});