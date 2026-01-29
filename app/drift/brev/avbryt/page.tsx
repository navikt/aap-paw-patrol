import { Page, PageBlock } from '@navikt/ds-react/Page';
import { AvbrytBrev } from '../../../../components/drift/brev/AvbrytBrev';

const BrevPage = async () => {
  return (
    <Page>
      <PageBlock width="md">
        <AvbrytBrev />
      </PageBlock>
    </Page>
  );
};

export default BrevPage;
