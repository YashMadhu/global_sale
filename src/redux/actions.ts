import {
  SET_NOTIFICATION_LIST,
  TOGGLE_MAIN_SWITCH,
  TOGGLE_CHECKBOX,
  NotificationItem,
} from './types';

export const setNotificationList = (list: NotificationItem[]) => ({
  type: SET_NOTIFICATION_LIST,
  payload: list,
});

export const toggleMainSwitch = (index: number, isEnabled: boolean) => ({
  type: TOGGLE_MAIN_SWITCH,
  payload: { index, isEnabled },
});

export const toggleCheckbox = (index: number, field: 'pushEnable' | 'emailEnable' | 'smsEnable') => ({
  type: TOGGLE_CHECKBOX,
  payload: { index, field },
});

