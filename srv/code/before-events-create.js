/**
 * The custom logic attached to the Events entity to validate data before creating a new event.
 * @Before(event = { "CREATE" }, entity = "low_code_attempt_6Srv.Events")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
  const { Events } = cds.entities;

  // Extract the data from the request
  const { title, price, dueDate, maxCapacity, manager_ID } = request.data;

  // Validate title
  if (!title || title.trim() === '') {
    request.reject(400, 'Title is required.');
  }

  // Validate price
  if (price !== undefined && price < 0) {
    request.reject(400, 'Price cannot be negative.');
  }

  // Validate dueDate
  if (dueDate !== undefined && new Date(dueDate) < new Date()) {
    request.reject(400, 'Due date cannot be in the past.');
  }

  // Validate maxCapacity
  if (maxCapacity !== undefined && maxCapacity <= 0) {
    request.reject(400, 'Max capacity must be greater than zero.');
  }

  // Validate manager existence
  if (manager_ID !== undefined) {
    const managerExists = await SELECT.one.from(Events).where({ manager_ID });
    if (!managerExists) {
      request.reject(404, 'Manager not found.');
    }
  }
};
