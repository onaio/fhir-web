/** lists tabular display of questionnaires uploaded to a fhir server */
import React from 'react';
import store from '@opensrp/store';
import rootReducer from '@helsenorge/skjemautfyller/reducers';
import { SkjemautfyllerContainer } from '@helsenorge/skjemautfyller/components';
import reducerRegistry from '@onaio/redux-reducer-registry';
import sampleQuestionnaire from './1082.json';

reducerRegistry.register('skjemautfyller', rootReducer);

// already adding to codebase that has its own store

/** not clear in documentation:
 * props:
 *  - resources
 * gotchas:
 *  - dependencies are actually peer dependencies
 *  - node-sass is left out.
 */

export const QuestionnaireForm = () => {
  const onSubmit = (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log(args);
  };
  const onCancel = () => void 0;
  return (
    <SkjemautfyllerContainer
      store={store}
      questionnaire={sampleQuestionnaire}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};
