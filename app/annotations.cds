using { low_code_attempt_6Srv } from '../srv/service.cds';

annotate low_code_attempt_6Srv.Events with @UI.HeaderInfo: { TypeName: 'Event', TypeNamePlural: 'Events' };
annotate low_code_attempt_6Srv.Events with {
  manager @Common.ValueList: {
    CollectionPath: 'Users',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: manager_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'name'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'email'
      },
    ],
  }
};
annotate low_code_attempt_6Srv.Events with {
  title @title: 'Title';
  description @title: 'Description';
  price @title: 'Price';
  dueDate @title: 'Due Date';
  isPublic @title: 'Is Public';
  maxCapacity @title: 'Max Capacity';
  url @title: 'URL'
};

annotate low_code_attempt_6Srv.Events with {
  price @Measures.ISOCurrency: Currency_code
};

annotate low_code_attempt_6Srv.Events with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: title },
 { $Type: 'UI.DataField', Value: description },
 { $Type: 'UI.DataField', Value: price },
 { $Type: 'UI.DataField', Value: dueDate },
 { $Type: 'UI.DataField', Value: isPublic },
 { $Type: 'UI.DataField', Value: maxCapacity },
 { $Type: 'UI.DataField', Value: url },
    { $Type: 'UI.DataField', Label: 'Manager', Value: manager_ID }
];

annotate low_code_attempt_6Srv.Events with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: title },
 { $Type: 'UI.DataField', Value: description },
 { $Type: 'UI.DataField', Value: price },
 { $Type: 'UI.DataField', Value: dueDate },
 { $Type: 'UI.DataField', Value: isPublic },
 { $Type: 'UI.DataField', Value: maxCapacity },
 { $Type: 'UI.DataField', Value: url },
    { $Type: 'UI.DataField', Label: 'Manager', Value: manager_ID }
  ]
};

annotate low_code_attempt_6Srv.Events with {
  manager @Common.Label: 'Manager';
  participants @Common.Label: 'Participants';
  surveys @Common.Label: 'Surveys'
};

annotate low_code_attempt_6Srv.Events with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate low_code_attempt_6Srv.Events with @UI.SelectionFields: [
  manager_ID
];

annotate low_code_attempt_6Srv.Users with @UI.HeaderInfo: { TypeName: 'User', TypeNamePlural: 'Users' };
annotate low_code_attempt_6Srv.Users with {
  events @Common.ValueList: {
    CollectionPath: 'Events',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: events_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'title'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'description'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'price'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'dueDate'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'isPublic'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'maxCapacity'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'url'
      },
    ],
  }
};
annotate low_code_attempt_6Srv.Users with {
  name @title: 'Name';
  email @title: 'Email'
};

annotate low_code_attempt_6Srv.Users with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: name },
 { $Type: 'UI.DataField', Value: email },
    { $Type: 'UI.DataField', Label: 'Event', Value: events_ID }
];

annotate low_code_attempt_6Srv.Users with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: name },
 { $Type: 'UI.DataField', Value: email },
    { $Type: 'UI.DataField', Label: 'Event', Value: events_ID }
  ]
};

annotate low_code_attempt_6Srv.Users with {
  events @Common.Label: 'Event'
};

annotate low_code_attempt_6Srv.Users with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate low_code_attempt_6Srv.Users with @UI.SelectionFields: [
  events_ID
];

annotate low_code_attempt_6Srv.Surveys with @UI.HeaderInfo: { TypeName: 'Survey', TypeNamePlural: 'Surveys' };
annotate low_code_attempt_6Srv.Surveys with {
  events @Common.ValueList: {
    CollectionPath: 'Events',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: events_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'title'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'description'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'price'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'dueDate'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'isPublic'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'maxCapacity'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'url'
      },
    ],
  }
};
annotate low_code_attempt_6Srv.Surveys with {
  isAnonymous @title: 'Is Anonymous'
};

annotate low_code_attempt_6Srv.Surveys with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: isAnonymous },
    { $Type: 'UI.DataField', Label: 'Event', Value: events_ID }
];

annotate low_code_attempt_6Srv.Surveys with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: isAnonymous },
    { $Type: 'UI.DataField', Label: 'Event', Value: events_ID }
  ]
};

annotate low_code_attempt_6Srv.Surveys with {
  questions @Common.Label: 'Questions';
  events @Common.Label: 'Event'
};

annotate low_code_attempt_6Srv.Surveys with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate low_code_attempt_6Srv.Surveys with @UI.SelectionFields: [
  events_ID
];

annotate low_code_attempt_6Srv.Questions with @UI.HeaderInfo: { TypeName: 'Question', TypeNamePlural: 'Questions' };
annotate low_code_attempt_6Srv.Questions with {
  surveys @Common.ValueList: {
    CollectionPath: 'Surveys',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: surveys_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'isAnonymous'
      },
    ],
  }
};
annotate low_code_attempt_6Srv.Questions with {
  text @title: 'Text';
  isMultipleChoice @title: 'Is Multiple Choice'
};

annotate low_code_attempt_6Srv.Questions with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: text },
 { $Type: 'UI.DataField', Value: isMultipleChoice },
    { $Type: 'UI.DataField', Label: 'Survey', Value: surveys_ID }
];

annotate low_code_attempt_6Srv.Questions with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: text },
 { $Type: 'UI.DataField', Value: isMultipleChoice },
    { $Type: 'UI.DataField', Label: 'Survey', Value: surveys_ID }
  ]
};

annotate low_code_attempt_6Srv.Questions with {
  answers @Common.Label: 'Answers';
  surveys @Common.Label: 'Survey'
};

annotate low_code_attempt_6Srv.Questions with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate low_code_attempt_6Srv.Questions with @UI.SelectionFields: [
  surveys_ID
];

annotate low_code_attempt_6Srv.Answers with @UI.HeaderInfo: { TypeName: 'Answer', TypeNamePlural: 'Answers' };
annotate low_code_attempt_6Srv.Answers with {
  questions @Common.ValueList: {
    CollectionPath: 'Questions',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: questions_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'text'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'isMultipleChoice'
      },
    ],
  }
};
annotate low_code_attempt_6Srv.Answers with {
  text @title: 'Text';
  isCorrect @title: 'Is Correct'
};

annotate low_code_attempt_6Srv.Answers with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: text },
 { $Type: 'UI.DataField', Value: isCorrect },
    { $Type: 'UI.DataField', Label: 'Question', Value: questions_ID }
];

annotate low_code_attempt_6Srv.Answers with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: text },
 { $Type: 'UI.DataField', Value: isCorrect },
    { $Type: 'UI.DataField', Label: 'Question', Value: questions_ID }
  ]
};

annotate low_code_attempt_6Srv.Answers with {
  questions @Common.Label: 'Question'
};

annotate low_code_attempt_6Srv.Answers with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate low_code_attempt_6Srv.Answers with @UI.SelectionFields: [
  questions_ID
];

