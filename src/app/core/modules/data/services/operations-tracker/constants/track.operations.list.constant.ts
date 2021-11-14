export const enum TrackOperations {
  CREATE_USER = 'create-user',
  UPDATE_USER = 'update-user',
  LOAD_SPECIFIC_USER = 'load-specific-user',
  UPLOAD_USER_PROFILE_ICON = 'upload-user-profile-icon',
  CHANGE_USER_UNIVERSITY_STRUCTURE = 'change-user-university-structure',
  CHANGE_USER_ROLE = 'change-user-role',
  JOIN_USER_TO_ROOM = 'join-user-to-room',

  // University
  LOAD_FACULTIES = 'load-faculties',

  // Rooms
  CREATE_GROUP_ROOM = 'create-group-room',

  // Messages
  CREATE_MESSAGE = 'create-message',
  GET_MESSAGES_BEFORE_SPECIFIC = 'get-messages-before-specific-message',
  GET_LATEST_MESSAGES = 'get-latest-messages',
  QUERY_FOR_MESSAGES_FOR_ROOM = 'QUERY_FOR_MESSAGES_FOR_ROOM'
}
