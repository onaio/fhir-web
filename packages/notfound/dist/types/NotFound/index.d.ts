import React from 'react';
export interface NotFoundProps {
  pathtoredirectto: string;
  title?: string;
  subTitle?: string;
}
/** Component to show when a page is not found in routes
 *
 * @param {NotFoundProps} props to contain functionality of NotsFound Component.
 * @returns {NotFound} returns Notfound component
 */
declare const NotFound: React.FC<NotFoundProps>;
export default NotFound;
