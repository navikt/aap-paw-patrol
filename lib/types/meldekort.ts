import type { components } from 'lib/types/generated/meldekort-backend';

type Schemas = components['schemas'];

export type MeldekortDriftsinfoDto = Schemas['no.nav.aap.meldekort.drift.MeldekortDriftsinfoDto'];
export type KelvinSak = Schemas['no.nav.aap.kelvin.KelvinSak'];
export type Meldeperiode = Schemas['no.nav.aap.meldeperiode.Meldeperiode'];
export type AktuelleMeldeperioderDriftsinfo = Schemas['no.nav.aap.meldekort.drift.AktuelleMeldeperioderDriftsinfo'];
export type HistoriskeMeldeperioderDriftsinfo = Schemas['no.nav.aap.meldekort.drift.HistoriskeMeldeperioderDriftsinfo'];
export type UtfyllingDriftsinfo = Schemas['no.nav.aap.meldekort.drift.UtfyllingDriftsinfo'];
export type Varsel = Schemas['no.nav.aap.meldekort.drift.VarselDriftsinfo'];
export type FagsakReferanse = Schemas['no.nav.aap.sak.FagsakReferanse'];
export type Fagsaknummer = Schemas['no.nav.aap.sak.Fagsaknummer'];
export type Svar = Schemas['no.nav.aap.utfylling.Svar'];
export type AktivitetsInformasjon = Schemas['no.nav.aap.utfylling.AktivitetsInformasjon'];
export type UtfyllingFlytNavn = UtfyllingDriftsinfo['flyt'];
export type UtfyllingStegNavn = UtfyllingDriftsinfo['aktivtSteg'];
