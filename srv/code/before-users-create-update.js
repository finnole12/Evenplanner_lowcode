/**
 * The custom logic attached to the Users entity to validate data before creating or updating a user.
 * @Before(event = { "CREATE","UPDATE" }, entity = "low_code_attempt_6Srv.Users")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
  const { Users } = cds.entities;

  // Extract the data from the request
  const { name, email } = request.data;

  // Validate that name and email are not undefined
  if (name === undefined || email === undefined) {
    request.reject(400, "Name and email must be provided.");
  }

  // Validate that the email format is correct
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    request.reject(400, "Invalid email format.");
  }

  // Check for duplicate email
  const existingUser = await SELECT.one.from(Users).where({ email });
  if (existingUser && existingUser.ID !== request.data.ID) {
    request.reject(400, "Email is already in use.");
  }
};
