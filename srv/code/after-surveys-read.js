/**
 * The custom logic attached to the Surveys entity to perform calculations or transformations after reading survey data.
 * @After(event = { "READ" }, entity = "low_code_attempt_6Srv.Surveys")
 * @param {(Object|Object[])} results - For the After phase only: the results of the event processing
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
*/
module.exports = async function(results, request) {
  const { Questions } = cds.entities;

  if (!results) return;

  // Ensure results is an array for consistent processing
  const surveys = Array.isArray(results) ? results : [results];

  for (const survey of surveys) {
    if (survey.ID) {
      // Count the number of questions associated with each survey
      const questionsCount = await SELECT.one.from(Questions)
        .columns('count(*) as count')
        .where({ surveys_ID: survey.ID });

      // Add the count to the survey result
      survey.questionsCount = questionsCount.count;
    }
  }
};
