import * as React from 'react';
import { useTranslation } from '../../mls';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return <div>{t('404!')}</div>;
};

export default NotFound;
