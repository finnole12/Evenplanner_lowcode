/**
 * The custom logic attached to the Questions entity to validate data before creating or updating a question.
 * @Before(event = { "CREATE","UPDATE" }, entity = "low_code_attempt_6Srv.Questions")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
  const { Questions } = cds.entities;

  // Extract data from the request
  const { data } = request;

  // Ensure the text field is not empty
  if (!data.text || data.text.trim() === '') {
    request.reject(400, 'The question text cannot be empty.');
  }

  // Ensure the text field does not exceed the maximum length
  if (data.text.length > 500) {
    request.reject(400, 'The question text exceeds the maximum length of 500 characters.');
  }

  // If the question is multiple choice, ensure there are associated answers
  if (data.isMultipleChoice) {
    const { Answers } = cds.entities;
    const answers = await SELECT.from(Answers).where({ questions_ID: data.ID });

    if (!answers || answers.length === 0) {
      request.reject(400, 'Multiple choice questions must have associated answers.');
    }
  }
};
