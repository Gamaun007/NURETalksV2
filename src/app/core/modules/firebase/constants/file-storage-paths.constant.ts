export const USER_PROFILE_IMAGE_PATH_FACTORY = (user_id: string) => `${USER_PROFILE_IMAGE_PATH}${user_id}`;
export const USER_PROFILE_IMAGE_PATH = 'profiles_images/';

export const ROOM_IMAGE_PATH = 'group_icons/';
export const ROOM_IMAGE_PATH_FACTORY = (room_id: string) => `${ROOM_IMAGE_PATH}${room_id}`;

const ROOM_ATTACHMENTS_PATH = 'group_attachments/';
export const ROOM_ATTACHMENTS_PATH_FACTORY = (room_id: string) => `${ROOM_ATTACHMENTS_PATH}${room_id}`;
