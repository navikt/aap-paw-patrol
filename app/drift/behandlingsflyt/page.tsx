import { KjørFraSteg } from '../../../components/drift/settaktivtsteg/SettAktivtSteg';
import { Page, PageBlock } from '@navikt/ds-react/Page';

const BehandlingsflytPage = async () => {
  return (
    <Page>
      <PageBlock width="2xl">
        <KjørFraSteg />
      </PageBlock>
    </Page>
  );
};

export default BehandlingsflytPage;
