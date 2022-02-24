import { ActionCreator, AnyAction, Store } from 'redux';

export const reducerName = 'messages';

// actions
export const SEND_MESSAGE = 'reveal-test/reducer/SEND_MESSAGE';
export const REMOVE_MESSAGES = 'reveal-test/reducer/REMOVE_MESSAGES';

export interface Message {
  user: string;
  message: string;
}

export interface SendMessageAction extends AnyAction {
  payload?: Message;
  type: typeof SEND_MESSAGE;
}

interface RemoveMessagesAction extends AnyAction {
  type: typeof REMOVE_MESSAGES;
}

export type MessageActionTypes = SendMessageAction | RemoveMessagesAction;

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

/**
 *
 * @param {object} state The initial value
 * @param {object} action - should have type or payload
 * @returns {Object} object be used to initialize a Redux store
 */
export default function reducer(state = initialState, action: MessageActionTypes): MessageState {
  switch (action.type) {
    case SEND_MESSAGE:
      if (action.payload) {
        return { messages: [...state.messages, action.payload] };
      }
      return state;
    case REMOVE_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}

// action creators
export const sendMessage: ActionCreator<SendMessageAction> = (newMessage: Message) => ({
  payload: newMessage,
  type: SEND_MESSAGE,
});

/**
 * Action to remove all Messages from store
 *
 * @returns {Object} to dispatch the action
 */
export const removeMessagesAction: ActionCreator<RemoveMessagesAction> = () => {
  return {
    type: REMOVE_MESSAGES,
  };
};

/**
 * select all messages
 *
 * @param {any} state -
 * @returns {Object} to dispatch the action
 */
export function selectAllMessages(state: Partial<Store>): Message[] {
  return (state as { [key: string]: MessageState })[reducerName].messages;
}

/**
 * select one message
 *
 * @param {any} state -
 * @returns {Object} to dispatch the action
 */
export function selectOneMessage(state: Partial<Store>): Message | null {
  return (state as { [key: string]: MessageState })[reducerName].messages[0]
    ? (state as { [key: string]: MessageState })[reducerName].messages[0]
    : null;
}
