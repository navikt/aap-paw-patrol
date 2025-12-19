import { KjørFraSteg } from '../../../components/drift/settaktivtsteg/SettAktivtSteg';
import { Page, PageBlock } from '@navikt/ds-react/Page';

const BehandlingsflytPage = async () => {
  return (
    <Page>
      <PageBlock width="md">
        <KjørFraSteg />
      </PageBlock>
    </Page>
  );
};

export default BehandlingsflytPage;
