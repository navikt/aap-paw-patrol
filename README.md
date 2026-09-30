# AAP Paw Patrol

Frontendapplikasjon for intern drift av saksbehandlingsapper i AAP

## Bygge og kjøre app lokalt

### Prettier og linting

Prosjektet bruker prettier og eslint. Skru gjerne på "Automatic configuration" for disse i din IDE.

For at pre-commit hooks for linting og formatering skal kunne kjøre, må du sette opp Husky med følgende kommando (trengs bare én gang):

```bash
  yarn husky
```

### Typesjekking

```bash
yarn tsc
```

Kjører `tsc --noEmit` mot hele prosjektet (alle `.ts`/`.tsx`-filer inkludert `mocks/`-katalogen, se
`tsconfig.json`). Kommandoen kjører `yarn mock:generate` først, slik at de genererte mock-handlerne
i `mocks/generated/` (som `mocks/run.ts` importerer fra, og som ikke er sjekket inn i git) finnes
før typesjekkingen kjøres — også ved første kjøring på en fersk klone.

### Github package registry

Vi bruker Github sitt package registry for npm-pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `yarn install` lokalt må du logge inn mot Github package registry. Legg til følgende i .bashrc eller .zshrc lokalt på din maskin:
I .bashrc eller .zshrc:

`export NODE_AUTH_TOKEN=github_pat`

Hvor github_pat er din personal access token laget på github (settings -> developer settings). Husk `read:packages`-rettighet og enable SSO når du oppdaterer/lager PAT.

### .env.local-fil

I tillegg må du kopiere `.env-template` til `.env.local` for å kunne kjøre lokalt.

### Kjøre lokalt

```sh
yarn dev
```

### Oppdatere openapi.json-filer

Backendenes openapi.json-URL-er er kodet inn i `scripts/update-openapi-specs.mjs`. Kjør
følgende for å hente ferske spesifikasjoner ned til `openapi/`:

```sh
yarn openapi:update
```

Dette regenererer også TypeScript-typene i `lib/types/generated/` (se under).

### TypeScript-typer generert fra openapi.json-filene

`lib/types/generated/<app>.ts` inneholder TypeScript-typer generert fra spesifikasjonene i
`openapi/` med [openapi-typescript](https://openapi-typescript.dev). Disse filene er
auto-generert og skal ikke redigeres for hånd (de er ekskludert fra eslint/prettier via
`lib/types/generated/**`-ignore).

Bruk dem til å typesjekke svar fra backendene, f.eks.:

```ts
import type { components } from 'lib/types/generated/behandlingsflyt';

type TidligereVurderingDto =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tidligerevurderinger.TidligereVurderingDto'];
```

For å regenerere typene manuelt (uten å hente nye spesifikasjoner):

```sh
yarn openapi:types
```

Kjør `yarn openapi:update` etter at en backend har endret sitt API, for å sjekke om
håndskrevne typer (f.eks. i `lib/types/`) fortsatt stemmer overens med de genererte.

### Kjøre lokalt med falske (mockede) backend-svar

Appen kaller flere backend-tjenester (behandlingsflyt, oppgave, meldekort, m.fl.) via URL-er
konfigurert i `.env.local`. For å kjøre lokalt uten at disse tjenestene faktisk kjører, kan du
bruke `yarn dev:mock`, som starter én lokal fake-server på `MOCK_API_BASE_URL` (standard:
`http://localhost:8080`). Serveren svarer med falske, men strukturelt riktige data generert fra
OpenAPI-spesifikasjoner med
[msw-auto-mock](https://github.com/zoubingwu/msw-auto-mock)/[MSW](https://mswjs.io).

```shell
yarn dev:mock
```

Dette:

- Genererer mock-handlere fra spesifikasjonene i `openapi/` (`yarn mock:generate`, kjøres
  automatisk av `dev:mock`).
- Starter én HTTP-server for alle mockede backendene på `MOCK_API_BASE_URL` (standard:
  `http://localhost:8080`). Hver backend får sin egen URL-prefiks for å skille like endepunkter.
- Lar `fakedings`-kallet for lokal token (`lib/services/localTokenService.ts`) være uendret/ekte —
  dette er ikke mocket, så du trenger fortsatt normal nettverkstilgang for det.
- `innsending` mockes ikke ennå. Kall til denne backenden går fortsatt reelt og vil feile/henge
  uten at den faktiske tjenesten kjører.
- Krever at porten til `MOCK_API_BASE_URL` er ledig — ikke kjør en annen tjeneste der samtidig.

For å legge til en ny backend, legg først backendens OpenAPI-URL til i
`scripts/update-openapi-specs.mjs`, og kjør `yarn openapi:update`. Da lastes spesifikasjonen ned til
`openapi/` og TypeScript-typene regenereres. For å mocke backenden lokalt må du deretter legge til
én oppføring i `MOCK_SPECS` i `mocks/mock-specs.mjs` med spesifikasjonsfil og riktig
`*_API_BASE_URL`.

#### Justere hvor "ekte"/omfattende de genererte dataene ser ut

`msw-auto-mock` bruker OpenAPI-skjemaene til å generere faker-data. Du kan justere dette slik:

- **Kortere/lengre lister:** Sett `MOCK_MAX_ARRAY_LENGTH` i `.env.local`.
- **Faste verdier:** Legg `example` eller `examples` på felt i `openapi/<navn>.json`.
- **Færre endepunkter:** Bruk `--includes` eller `--excludes` i `scripts/generate-mocks.mjs`.
- **Faste svar mellom kall:** Standard er `--static`. Sett `MOCK_STATIC=false` for nye data per kall.

Kjør `yarn mock:generate` (eller `yarn dev:mock`) etter endringer.

---

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.

# Henvendelser

---

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

# For NAV-ansatte

---

Interne henvendelser kan sendes via Slack i kanalen #ytelse-aap-værsågod.
