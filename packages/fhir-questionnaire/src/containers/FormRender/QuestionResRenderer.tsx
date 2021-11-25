/** lists tabular display of questionnaires uploaded to a fhir server */
import React from 'react';
import rootReducer from '@helsenorge/skjemautfyller/reducers';
import { SkjemautfyllerContainer } from '@helsenorge/skjemautfyller/components';
import { Store, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { useParams } from 'react-router';
import { questionnaireResourceType, questionnaireResponseResourceType } from '../../constants';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
// import { sampleQr } from './1082-qr';
// import { msf } from './A - msf-Questionnaire.fhir';

const store: Store<{}> = createStore(rootReducer, applyMiddleware(thunk));

/** not clear in documentation:
 * props:
 *  - resources?
 * gotchas:
 *  - dependencies are actually peer dependencies, versions are left to trial and error
 *  - node-sass is left out.
 *  - comes with its own redux-store arch
 * TODOs:
 *  - validation errors are not intuitive
 *
 * Issues:
 * - some forms are not displayed, they just show submit and cancel buttons
 *  - This function `getRootQuestionnaireResponseItemFromData` in skjemautfyller is passed stale formData parameter
 *     bug with action creator.
 */

export const QuestionnaireResponseForm = (props: any) => {
  const { questResId } = useParams<{ questResId: string }>();
  const { fhirBaseURL } = props;

  /** is it possible to have this form show for both questionnaire only and
   * questionnaireResponse, questionnaireResponse, we can have the first questy for questionnaireResponse
   */

  const { isLoading: questRespIsLoading, data: questResp } = useQuery(
    [questionnaireResponseResourceType, questResId],
    () => new FHIRServiceClass(fhirBaseURL, questionnaireResponseResourceType).read(questResId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  /** if questionnaire response loads up */
  const { isLoading, data } = useQuery(
    [questionnaireResourceType, questResp?.questionnaire],
    () => new FHIRServiceClass(fhirBaseURL, questResp?.questionnaire).read(''),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!questResp?.questionnaire,
    }
  );

  if (isLoading || questRespIsLoading) {
    return <Spin />;
  }

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
          questionnaire={data}
          questionnaireResponse={questResp}
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
