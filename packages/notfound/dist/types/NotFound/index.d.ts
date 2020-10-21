/// <reference types="react" />
interface Props {
    pathtoredirectto: string;
    title: string;
    subTitle: string;
}
declare function NotFound(props: Props): JSX.Element;
declare namespace NotFound {
    var defaultProps: {
        title: string;
        subTitle: string;
    };
}
export default NotFound;
