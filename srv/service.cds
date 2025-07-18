using { low_code_attempt_6 as my } from '../db/schema.cds';

@path: '/service/low_code_attempt_6'
@requires: 'authenticated-user'
service low_code_attempt_6Srv {
  @odata.draft.enabled
  @cds.redirection.target
  entity Events as projection on my.Events;
  @odata.draft.enabled
  entity Users as projection on my.Users;
  @odata.draft.enabled
  entity Surveys as projection on my.Surveys;
  @odata.draft.enabled
  entity Questions as projection on my.Questions;
  @odata.draft.enabled
  entity Answers as projection on my.Answers;
  @odata.draft.enabled
  entity EventParticipants as projection on my.EventParticipants;
  @odata.draft.enabled
  entity EventMessages as projection on my.EventMessages;
  @odata.draft.enabled
  entity UserAnswers as projection on my.UserAnswers;

  entity ManagingEvents as select from my.Events as ev 
    where ev.manager.ID = $user.id;
  
  entity ParticipantEvents as select from my.Events as ev {
    key ev.ID as someid,
    ev.{ *},
    ev.participants.user.ID as userID,
    ev.participants.hasPayed
  }
    where ev.participants.user.ID = $user.id;

  function getCurrentUserId() returns {
    id: String
  }

  action addMessage(eventId: String, messageText: String) returns {
    success: Boolean
  }

  action makePayment(eventId: String) returns {
    success: Boolean
  }

  action submitAnswers(surveyId: String, answers: Array of String) returns {
    success: Boolean
  }
}