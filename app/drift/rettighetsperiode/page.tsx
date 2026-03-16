import { Page, PageBlock } from '@navikt/ds-react/Page';
import { UtvidRettighetsperiodeSteg } from 'components/drift/utvidrettighetsperiode/UtvidRettighetsperiodeSteg';

const UtvidRettighetsperiodePage = async () => {
  return (
    <Page>
      <PageBlock width="md">
        <UtvidRettighetsperiodeSteg />
      </PageBlock>
    </Page>
  );
};

export default UtvidRettighetsperiodePage;
