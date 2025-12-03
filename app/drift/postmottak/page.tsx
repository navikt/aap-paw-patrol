import { TriggProsesserBehandling } from '../../../components/drift/triggprosesserbehandlingpostmottak/TriggProsesserBehandling';
import { Page, PageBlock } from '@navikt/ds-react/Page';

const BehandlingsflytPage = async () => {
  return (
    <Page>
      <PageBlock width="2xl">
        <TriggProsesserBehandling />
      </PageBlock>
    </Page>
  );
};

export default BehandlingsflytPage;
