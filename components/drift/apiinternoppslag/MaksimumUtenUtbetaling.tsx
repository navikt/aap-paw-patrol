import {
  Box,
  Button,
  InlineMessage,
  Loader,
  LocalAlert,
  Table,
  VStack,
} from '@navikt/ds-react';
import { formatISO } from 'date-fns';
import { hentMaksimumUtenUtbetaling } from 'lib/clientApi';
import { useState } from 'react';

interface MaksimumUtenUtbetalingResponse {
  vedtak: Vedtak[];
}

interface Vedtak {
  dagsats: number;
  dagsatsEtterUføreReduksjon?: number;
  vedtakId: string;
  status: string;
  saksnummer: string;
  vedtaksdato: string;
  vedtaksTypeKode?: string;
  vedtaksTypeNavn?: string;
  periode: { fraOgMedDato: string, tilOgMedDato: string };
  rettighetsType: string;
  beregningsgrunnlag: number;
  barnMedStonad: number;
  barnetillegg: number;
  kildesystem: string;
  samordningsId?: string | null;
  opphorsAarsak?: string | null;
}

export interface Props {
  fom?: Date | null;
  tom?: Date | null;
  fnr?: string | null;
}

export const MaksimumUtenUtbetaling = ({fom, tom, fnr}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [vedtak, setVedtak] = useState<MaksimumUtenUtbetalingResponse>();

  const onClickHentVedtak = async () => {
    if (!fnr || !fom || !tom) {
      const mangler = [fnr ? null : 'fnr', fom ? null : 'fom', tom ? null : 'tom'].filter((it) => it);
      setError(`mangler verdi for ${mangler.join(', ')}`);
      return;
    }
    setError(undefined);
    setLoading(true);
    const response = await hentMaksimumUtenUtbetaling(
      fnr,
      formatISO(fom, { representation: 'date' }),
      formatISO(tom, { representation: 'date' })
    );

    if (response.ok) {
      setVedtak(await response.json());
    } else {
      setError(`http error ${response.statusText}`);
      setVedtak(undefined);
    }
    setLoading(false);
  };

  return (
    <Box borderWidth="1" borderColor="neutral-subtle" borderRadius="12" padding="space-16">
      <VStack gap="space-16">
        <Box maxWidth="20em">
          <Button onClick={onClickHentVedtak}>Hent maksimumUtenUtbetaling-vedtak (TP)</Button>
        </Box>

        {loading && <Loader size="3xlarge" />}

        {error && (
          <LocalAlert status="error">
            <LocalAlert.Header>
              <LocalAlert.Title>Feil ved henting av maksimumUtenUtbetaling-vedtak</LocalAlert.Title>
              <LocalAlert.CloseButton onClick={() => setError(undefined)} />
            </LocalAlert.Header>
            <LocalAlert.Content>{error}</LocalAlert.Content>
          </LocalAlert>
        )}

        {vedtak != null ? (
          vedtak.vedtak.length === 0 ? (
            <InlineMessage status="info">Ingen vedtak</InlineMessage>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">fom</Table.HeaderCell>
                  <Table.HeaderCell scope="col">tom</Table.HeaderCell>
                  <Table.HeaderCell scope="col">kildesystem</Table.HeaderCell>
                  <Table.HeaderCell scope="col">saksnummer</Table.HeaderCell>
                  <Table.HeaderCell scope="col">vedtakId</Table.HeaderCell>
                  <Table.HeaderCell scope="col">status</Table.HeaderCell>
                  <Table.HeaderCell scope="col">rettighetsType</Table.HeaderCell>
                  <Table.HeaderCell scope="col">vedtaksdato</Table.HeaderCell>
                  <Table.HeaderCell scope="col">vedtaksTypeKode</Table.HeaderCell>
                  <Table.HeaderCell scope="col">vedtaksTypeNavn</Table.HeaderCell>
                  <Table.HeaderCell scope="col">beregningsgrunnlag</Table.HeaderCell>
                  <Table.HeaderCell scope="col">dagsats</Table.HeaderCell>
                  <Table.HeaderCell scope="col">dagsatsEtterUføreReduksjon</Table.HeaderCell>
                  <Table.HeaderCell scope="col">barnMedStonad</Table.HeaderCell>
                  <Table.HeaderCell scope="col">barnetillegg</Table.HeaderCell>
                  <Table.HeaderCell scope="col">samordningsId</Table.HeaderCell>
                  <Table.HeaderCell scope="col">opphorsAarsak</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {vedtak.vedtak.map( (v) => {
                    return (
                      <Table.Row key={`${v.saksnummer}${v.vedtakId}${v.periode.fraOgMedDato}`}>
                        <Table.DataCell>{v.periode.fraOgMedDato}</Table.DataCell>
                        <Table.DataCell>{v.periode.tilOgMedDato}</Table.DataCell>
                        <Table.DataCell>{v.kildesystem}</Table.DataCell>
                        <Table.DataCell>{v.saksnummer}</Table.DataCell>
                        <Table.DataCell>{v.vedtakId}</Table.DataCell>
                        <Table.DataCell>{v.status}</Table.DataCell>
                        <Table.DataCell>{v.rettighetsType}</Table.DataCell>
                        <Table.DataCell>{v.vedtaksdato}</Table.DataCell>
                        <Table.DataCell>{v.vedtaksTypeKode}</Table.DataCell>
                        <Table.DataCell>{v.vedtaksTypeNavn}</Table.DataCell>
                        <Table.DataCell>{v.beregningsgrunnlag}</Table.DataCell>
                        <Table.DataCell>{v.dagsats}</Table.DataCell>
                        <Table.DataCell>{v.dagsatsEtterUføreReduksjon}</Table.DataCell>
                        <Table.DataCell>{v.barnMedStonad}</Table.DataCell>
                        <Table.DataCell>{v.barnetillegg}</Table.DataCell>
                        <Table.DataCell>{v.samordningsId}</Table.DataCell>
                        <Table.DataCell>{v.opphorsAarsak}</Table.DataCell>
                      </Table.Row>
                    );
                  }
                )}
              </Table.Body>
            </Table>
          )
        ) : null}
      </VStack>
    </Box>
  );
}
