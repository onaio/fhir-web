import { Dictionary } from '@onaio/utils';
/** declare globals interface */
declare global {
    interface Window {
        __PRELOADED_STATE__: Dictionary;
    }
}
/** The initial store for the reveal web app */
export declare const store: import("redux").Store<{
    [x: string]: any;
}, import("redux").AnyAction> & {
    dispatch: {};
};
