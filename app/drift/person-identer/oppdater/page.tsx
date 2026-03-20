import { Page, PageBlock } from '@navikt/ds-react/Page';
import { OppdaterPersonIdenter } from '../../../../components/drift/person-identer/OppdaterPersonIdenter';

const OppdaterPersonIdenterPage = async () => {
  return (
    <Page>
      <PageBlock width="md">
        <OppdaterPersonIdenter />
      </PageBlock>
    </Page>
  );
};

export default OppdaterPersonIdenterPage;
