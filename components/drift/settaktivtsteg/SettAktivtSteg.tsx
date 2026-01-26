'use client';
import { useEffect, useState } from 'react';
import { Alert, Button, Heading, TextField, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import { kjørFraSteg } from '../../../lib/clientApi';

export const KjørFraSteg = () => {
  const [behandlingsreferanse, setBehandlingsreferanse] = useState<string>();
  const [steg, setSteg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (behandlingsreferanse && steg) {
      setError(undefined);
    }
  }, [behandlingsreferanse, steg]);

  const onClick = async () => {
    setMessage(undefined);
    setError(undefined);

    if (!behandlingsreferanse || !steg) {
      setError('Behandlingsreferanse og steg må fylles ut');
      return;
    }

    setIsLoading(true);
    console.log('kjør-fra-steg', { behandlingsreferanse, steg });

    try {
      await kjørFraSteg(behandlingsreferanse, steg).then(async (res) => {
        if (res.ok) setMessage('ok 👍');
        else setError(await res.text());
      });
    } catch (err) {
      console.log(err);
      setError(`Noe gikk galt: ${err}`);
    }
    setIsLoading(false);
  };

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="medium">Sett aktivt steg for behandling</Heading>
      <TextField
        label="Behandlingsreferanse (UUID)"
        value={behandlingsreferanse}
        onChange={(e) => setBehandlingsreferanse(e.target.value)}
      />

      <UNSAFE_Combobox
        label="Steg"
        options={Object.entries(muligeSteg).map(([key, value]) => ({ label: value, value: key }))}
        multiple={false}
        onToggleSelected={(value) => setSteg(value)}
        shouldAutocomplete={false}
      />

      <div>
        <Button onClick={onClick} loading={isLoading}>
          Sett aktivt steg
        </Button>
      </div>

      {message && <Alert variant="info">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
    </VStack>
  );
};

export const muligeSteg: Record<string, string> = {
  SØKNAD: 'Søknad',
  VURDER_RETTIGHETSPERIODE: 'Vurder rettighetsperiode',
  VURDER_ALDER: 'Vurder alder',
  VURDER_LOVVALG: 'Vurder lovvalg',
  VURDER_MEDLEMSKAP: 'Vurder medlemskap',
  VURDER_OPPHOLDSKRAV: 'Vurder oppholdskrav',
  FASTSETT_MELDEPERIODER: 'Fastsett meldeperioder',
  AVKLAR_STUDENT: 'Avklar student',
  VURDER_BISTANDSBEHOV: 'Vurder bistandsbehov',
  OVERGANG_UFORE: 'Overgang ufore',
  OVERGANG_ARBEID: 'Overgang arbeid',
  VURDER_SYKEPENGEERSTATNING: 'Vurder sykepengeerstatning',
  FASTSETT_SYKDOMSVILKÅRET: 'Fastsett sykdomsvilkåret',
  VURDER_YRKESSKADE: 'Vurder yrkesskade',
  FRITAK_MELDEPLIKT: 'Fritak meldeplikt',
  SYKDOMSVURDERING_BREV: 'Sykdomsvurdering brev',
  KVALITETSSIKRING: 'Kvalitetssikring',
  BARNETILLEGG: 'Barnetillegg',
  AVKLAR_SYKDOM: 'Avklar sykdom',
  ARBEIDSOPPTRAPPING: 'Arbeidsopptrapping',
  REFUSJON_KRAV: 'Refusjon krav',
  FASTSETT_ARBEIDSEVNE: 'Fastsett arbeidsevne',
  FASTSETT_BEREGNINGSTIDSPUNKT: 'Fastsett beregningstidspunkt',
  FASTSETT_GRUNNLAG: 'Fastsett grunnlag',
  VIS_GRUNNLAG: 'Vis grunnlag',
  MANGLENDE_LIGNING: 'Manglende ligning',
  SAMORDNING_UFØRE: 'Samordning uføre',
  SAMORDNING_GRADERING: 'Samordning gradering',
  SAMORDNING_AVSLAG: 'Samordning avslag',
  SAMORDNING_ANDRE_STATLIGE_YTELSER: 'Samordning andre statlige ytelser',
  SAMORDNING_ARBEIDSGIVER: 'Samordning arbeidsgiver',
  SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV: 'Samordning tjenestepensjon refusjonskrav',
  IKKE_OPPFYLT_MELDEPLIKT: 'Ikke oppfylt meldeplikt',
  FASTSETT_UTTAK: 'Fastsett uttak',
  EFFEKTUER_11_7: 'Effektuer 11 7',
  DU_ER_ET_ANNET_STED: 'Du er et annet sted',
  BEREGN_TILKJENT_YTELSE: 'Beregn tilkjent ytelse',
  SIMULERING: 'Simulering',
  FORESLÅ_VEDTAK: 'Foreslå vedtak',
  FATTE_VEDTAK: 'Fatte vedtak',
};
