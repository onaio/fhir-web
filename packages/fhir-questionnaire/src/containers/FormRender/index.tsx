/** lists tabular display of questionnaires uploaded to a fhir server */
import React from 'react';
import rootReducer from '@helsenorge/skjemautfyller/reducers';
import { SkjemautfyllerContainer } from '@helsenorge/skjemautfyller/components';
import sampleQuestionnaire from './1082.json';
import { Store, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const store: Store<{}> = createStore(rootReducer, applyMiddleware(thunk));

/** not clear in documentation:
 * props:
 *  - resources?
 * gotchas:
 *  - dependencies are actually peer dependencies, versions are left to trial and error
 *  - node-sass is left out.
 * TODOs:
 *  - validation errors are not intuitive
 */

export const QuestionnaireForm = () => {
  const onSubmit = (qr: unknown) => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(qr));
  };
  const onCancel = () => void 0;
  return (
    <div className="content-section">
      <Provider store={store} key="1">
        <SkjemautfyllerContainer
          store={store}
          questionnaire={sampleQuestionnaire}
          onSubmit={onSubmit}
          onCancel={onCancel}
          resources={{
            formCancel: 'Cancel',
            formSend: 'Submit',
          }}
          authorized={true} // TODO - if not authorized default behavior is to go to login
        />
      </Provider>
    </div>
  );
};
