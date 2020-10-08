import { ActionCreator, AnyAction, Store } from 'redux';
export declare const reducerName = "messages";
export declare const SEND_MESSAGE = "reveal-test/reducer/SEND_MESSAGE";
export declare const REMOVE_MESSAGES = "reveal-test/reducer/REMOVE_MESSAGES";
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
export declare type MessageActionTypes = SendMessageAction | RemoveMessagesAction;
interface MessageState {
    messages: Message[];
}
export default function reducer(state: MessageState | undefined, action: MessageActionTypes): MessageState;
export declare const sendMessage: ActionCreator<SendMessageAction>;
/** Action to remove all Messages from store */
export declare const removeMessagesAction: ActionCreator<RemoveMessagesAction>;
export declare function selectAllMessages(state: Partial<Store>): Message[];
export declare function selectOneMessage(state: Partial<Store>): Message | null;
export {};
