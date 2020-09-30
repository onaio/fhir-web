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

/** Action to remove all Messages from store */
export const removeMessagesAction: ActionCreator<RemoveMessagesAction> = () => {
  return {
    type: REMOVE_MESSAGES,
  };
};

// selectors
export function selectAllMessages(state: Partial<Store>): Message[] {
  return (state as { [key: string]: MessageState })[reducerName].messages;
}

export function selectOneMessage(state: Partial<Store>): Message | null {
  return (state as { [key: string]: MessageState })[reducerName].messages[0] || null;
}
