/**
 * The custom logic attached to the low_code_attempt_6Srv service for sending messages within events.
 * @On(event = { "sendMessage" })
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 * @param {Function} next - Callback function to the next handler
*/
module.exports = async function(request, next) {
  const { Events, Users } = cds.entities;
  const { eventId, message } = request.data;

  // Check if eventId and message are provided
  if (!eventId || !message) {
    return request.reject(400, 'Event ID and message are required.');
  }

  // Retrieve the event to ensure it exists
  const event = await SELECT.one.from(Events).where({ ID: eventId });
  if (!event) {
    return request.reject(404, 'Event not found.');
  }

  // Retrieve participants associated with the event
  const participants = await SELECT.from(Users).where({ events_ID: eventId });

  // Check if there are participants
  if (!participants.length) {
    return request.reject(404, 'No participants found for the event.');
  }

  // Logic to send messages to participants
  // This is a placeholder for the actual message sending logic
  participants.forEach(participant => {
    console.log(`Sending message to ${participant.email}: ${message}`);
    // Implement actual message sending logic here
  });

  return next();
}
