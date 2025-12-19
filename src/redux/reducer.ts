import {
  SET_NOTIFICATION_LIST,
  TOGGLE_MAIN_SWITCH,
  TOGGLE_CHECKBOX,
  NotificationsState,
  NotificationActionTypes,
  NotificationItem,
} from './types';

const initialState: NotificationsState = {
  notificationList: [],
};

const notificationsReducer = (
  state = initialState,
  action: NotificationActionTypes
): NotificationsState => {
  switch (action.type) {
    case SET_NOTIFICATION_LIST:
      return {
        ...state,
        notificationList: action.payload.map((item: any) => ({
          ...item,
          isEnabled: item.isEnabled ?? true,
        })),
      };

    case TOGGLE_MAIN_SWITCH: {
      const { index, isEnabled } = action.payload;
      const updatedList = [...state.notificationList];
      updatedList[index] = {
        ...updatedList[index],
        isEnabled,
        pushEnable: isEnabled ? updatedList[index].pushEnable : false,
        emailEnable: isEnabled ? updatedList[index].emailEnable : false,
        smsEnable: isEnabled ? updatedList[index].smsEnable : false,
      };
      return {
        ...state,
        notificationList: updatedList,
      };
    }

    case TOGGLE_CHECKBOX: {
      const { index, field } = action.payload;
      const updatedList = [...state.notificationList];
      updatedList[index] = {
        ...updatedList[index],
        [field]: !updatedList[index][field],
      };
      return {
        ...state,
        notificationList: updatedList,
      };
    }

    default:
      return state;
  }
};

export default notificationsReducer;
