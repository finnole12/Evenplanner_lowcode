sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'eventsmanagement/test/integration/FirstJourney',
		'eventsmanagement/test/integration/pages/EventsList',
		'eventsmanagement/test/integration/pages/EventsObjectPage'
    ],
    function(JourneyRunner, opaJourney, EventsList, EventsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('eventsmanagement') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheEventsList: EventsList,
					onTheEventsObjectPage: EventsObjectPage
                }
            },
            opaJourney.run
        );
    }
);