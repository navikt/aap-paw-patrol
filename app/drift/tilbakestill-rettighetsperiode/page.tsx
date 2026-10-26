import { Page, PageBlock } from '@navikt/ds-react/Page';
import { TilbakestillRettighetsperiode } from 'components/drift/tilbakestillrettighetsperiode/TilbakestillRettighetsperiode';

const TilbakestillRettighetsperiodePage = async () => {
  return (
    <Page>
      <PageBlock width="md">
        <TilbakestillRettighetsperiode />
      </PageBlock>
    </Page>
  );
};

export default TilbakestillRettighetsperiodePage;
