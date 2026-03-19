import { useEffect, useState } from 'react';
import { hentTilkjentYtelse } from 'lib/clientApi';
import { BodyShort, Box, HStack, Loader, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend, formaterPeriode } from 'lib/utils/date';
import { TilkjentYtelseDto } from 'lib/types/tilkjentytelse';
import { formaterTilNok, formaterTilProsent } from 'lib/utils/formatting';

export const TilkjentYtelse = ({ behandlingsreferanse }: { behandlingsreferanse: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tilkjentYtelse, setTilkjentYtelse] = useState<TilkjentYtelseDto>();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (behandlingsreferanse) {
        await hentTilkjentYtelse(behandlingsreferanse)
          .then(async (res) => {
            if (res.ok) return await res.json();
            else throw Error(await res.text());
          })
          .then((dto: TilkjentYtelseDto) => setTilkjentYtelse(dto))
          .finally(() => setIsLoading(false));
      }
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behandlingsreferanse]);

  if (isLoading) {
    return (
      <HStack gap="space-16" paddingBlock="space-32" paddingInline="space-16">
        <Loader />
        <span>Henter tilkjent ytelse for behandling ...</span>
      </HStack>
    );
  } else if (!isLoading && !tilkjentYtelse) {
    return (
      <Box paddingBlock="space-32" paddingInline="space-16">
        <BodyShort>Ingen resultat</BodyShort>
      </Box>
    );
  }

  return (
    <Box paddingBlock="space-32" paddingInline="space-16">
      <Table size="medium">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Meldeperiode</Table.HeaderCell>
            <Table.HeaderCell>Vurdert periode</Table.HeaderCell>
            <Table.HeaderCell>Dagsats</Table.HeaderCell>
            <Table.HeaderCell>Barnetillegg</Table.HeaderCell>
            <Table.HeaderCell>Arbeid</Table.HeaderCell>
            <Table.HeaderCell>Samordning</Table.HeaderCell>
            <Table.HeaderCell>Institusjon</Table.HeaderCell>
            <Table.HeaderCell>Arbeidsgiver</Table.HeaderCell>
            <Table.HeaderCell>Total reduksjon</Table.HeaderCell>
            <Table.HeaderCell>Barnepensjon</Table.HeaderCell>
            <Table.HeaderCell>Effektiv dagsats</Table.HeaderCell>
            <Table.HeaderCell>Meldekort levert</Table.HeaderCell>
            <Table.HeaderCell>Timer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tilkjentYtelse?.perioder?.map((periode) => {
            return periode.vurdertePerioder.map((vurdertPeriode, vurdertPeriodeIndex) => (
              <Table.Row key={crypto.randomUUID()}>
                <Table.DataCell textSize="small">
                  {vurdertPeriodeIndex === 0 && formaterPeriode(periode.meldeperiode.fom, periode.meldeperiode.tom)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterPeriode(vurdertPeriode.periode.fom, vurdertPeriode.periode.tom)}
                </Table.DataCell>
                <Table.DataCell textSize="small">{formaterTilNok(vurdertPeriode.felter.dagsats)}</Table.DataCell>
                <Table.DataCell textSize="small">{formaterTilNok(vurdertPeriode.felter.barnetillegg)}</Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterTilProsent(vurdertPeriode.felter.arbeidGradering)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterTilProsent(vurdertPeriode.felter.samordningGradering)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterTilProsent(vurdertPeriode.felter.institusjonGradering)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterTilProsent(vurdertPeriode.felter.arbeidsgiverGradering)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterTilProsent(vurdertPeriode.felter.totalReduksjon)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterTilNok(vurdertPeriode.felter.barnepensjonDagsats)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {formaterTilNok(vurdertPeriode.felter.effektivDagsats)}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {vurdertPeriodeIndex === 0 &&
                    (periode.levertMeldekortDato
                      ? formaterDatoForFrontend(periode.levertMeldekortDato)
                      : 'Ikke levert')}
                </Table.DataCell>
                <Table.DataCell textSize="small">
                  {periode.sisteLeverteMeldekort &&
                    `${periode.sisteLeverteMeldekort.timerArbeidPerPeriode.timerArbeid} t`}
                </Table.DataCell>
              </Table.Row>
            ));
          })}
        </Table.Body>
      </Table>
    </Box>
  );
};
