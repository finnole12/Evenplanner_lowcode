/**
 * The custom logic attached to the Answers entity to validate data before creating a new answer.
 * @Before(event = { "CREATE" }, entity = "low_code_attempt_6Srv.Answers")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
  const { Answers, Questions } = cds.entities;
  const { data } = request;

  // Validate that the text field is not empty
  if (!data.text || data.text.trim() === '') {
    return request.reject(400, 'The answer text cannot be empty.');
  }

  // Validate that the questions_ID foreign key is valid
  if (!data.questions_ID) {
    return request.reject(400, 'The question ID must be provided.');
  }

  const questionExists = await SELECT.one.from(Questions).where({ ID: data.questions_ID });
  if (!questionExists) {
    return request.reject(404, 'The specified question does not exist.');
  }
};
