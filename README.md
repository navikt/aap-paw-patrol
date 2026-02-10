# AAP Paw Patrol

Frontendapplikasjon for intern drift av saksbehandlingsapper i AAP

## Bygge og kjøre app lokalt

### Prettier og linting

Prosjektet bruker prettier og eslint. Skru gjerne på "Automatic configuration" for disse i din IDE.

For at pre-commit hooks for linting og formatering skal kunne kjøre, må du sette opp Husky med følgende kommando (trengs bare én gang):

```bash
  yarn husky
```

### Github package registry

Vi bruker Github sitt package registry for npm pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `yarn install` lokalt må du logge inn mot Github package registry. Legg til følgende i .bashrc eller .zshrc lokalt på din maskin:
I .bashrc eller .zshrc:

`export NPM_AUTH_TOKEN=github_pat`

Hvor github_pat er din personal access token laget på github (settings -> developer settings). Husk `read:packages`-rettighet og enable SSO når du oppdaterer/lager PAT.

### .env.local-fil

I tillegg må du kopiere `.env-template` til `.env.local` for å kunne kjøre lokalt.

### Kjøre lokalt

```
yarn dev
```

---

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.

# Henvendelser

---

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

# For NAV-ansatte

---

Interne henvendelser kan sendes via Slack i kanalen #po-aap-team-aap.
