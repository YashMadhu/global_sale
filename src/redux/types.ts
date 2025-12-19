// Action Types
export const SET_NOTIFICATION_LIST = 'SET_NOTIFICATION_LIST';
export const TOGGLE_MAIN_SWITCH = 'TOGGLE_MAIN_SWITCH';
export const TOGGLE_CHECKBOX = 'TOGGLE_CHECKBOX';

// Notification Item Interface
export interface NotificationItem {
  id?: string | number;
  displayText: string;
  description: string;
  preference?: string;
  preferenceKey?: string;
  isEnabled: boolean;
  pushEnable: boolean;
  emailEnable: boolean;
  smsEnable: boolean;
}

// State Interface
export interface NotificationsState {
  notificationList: NotificationItem[];
}

// Action Interfaces
export interface SetNotificationListAction {
  type: typeof SET_NOTIFICATION_LIST;
  payload: NotificationItem[];
}

export interface ToggleMainSwitchAction {
  type: typeof TOGGLE_MAIN_SWITCH;
  payload: { index: number; isEnabled: boolean };
}

export interface ToggleCheckboxAction {
  type: typeof TOGGLE_CHECKBOX;
  payload: { index: number; field: 'pushEnable' | 'emailEnable' | 'smsEnable' };
}

export type NotificationActionTypes = 
  | SetNotificationListAction 
  | ToggleMainSwitchAction 
  | ToggleCheckboxAction;

