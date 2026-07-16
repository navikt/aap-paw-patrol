import { Page, PageBlock } from '@navikt/ds-react/Page';
import { ReferanseKonverter } from 'components/drift/utbetaling/ReferanseKonverter';

const ReferanseKonverterPage = () => {
  return (
    <Page>
      <PageBlock width="lg">
        <ReferanseKonverter />
      </PageBlock>
    </Page>
  );
};

export default ReferanseKonverterPage;
