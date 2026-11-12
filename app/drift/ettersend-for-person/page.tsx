import { Page, PageBlock } from '@navikt/ds-react/Page';
import { EttersendDokument } from 'components/drift/ettersend-dokument/EttersendDokument.tsx';

const EttersendForPersonPage = async () => {
  return (
    <Page>
      <PageBlock width="md">
        <EttersendDokument />
      </PageBlock>
    </Page>
  );
};

export default EttersendForPersonPage;
