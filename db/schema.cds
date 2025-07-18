namespace low_code_attempt_6;
using { cuid, Currency } from '@sap/cds/common';

entity Events : cuid {
  title: String(100);
  description: String(500);
  price: Decimal(10,2);
  Currency: Currency;
  dueDate: Date;
  isPublic: Boolean;
  maxCapacity: Integer;
  url: String(200);
  manager: Association to Users;
  surveys: Association to many Surveys
    on surveys.event = $self;
  participants: Association to many EventParticipants
    on participants.event = $self;
  messages: Association to many EventMessages
    on messages.event = $self;
}

entity Users : cuid {
  name: String(100);
  email: String(100);
}

entity Surveys : cuid {
  isAnonymous: Boolean;
  questions: Association to many Questions
    on questions.survey = $self;
  event: Association to Events;
  title: String(100);
  description: String(500);
  dueDate: Date;
  isActive: Boolean;
}

entity Questions : cuid {
  text: String(500);
  isMultipleChoice: Boolean;
  answers: Association to many Answers
    on answers.question = $self;
  survey: Association to Surveys;
}

entity Answers : cuid {
  text: String(200);
  isCorrect: Boolean;
  question: Association to Questions;
}

entity EventParticipants : cuid {
  event: Association to Events;
  user: Association to Users;
  hasPayed: Boolean;
}

entity EventMessages : cuid {
  text: String(500);
  event: Association to Events;
}