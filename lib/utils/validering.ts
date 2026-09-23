// Saksnummer skal bestå av både tall og bokstaver
export const erSaksnummer = (verdi: string) => /[a-zA-ZæøåÆØÅ]/.test(verdi) && /\d/.test(verdi);

// Ekstremt forenklet test for å validere fødselsnummer. Nøyaktig 11 siffer antas å være fødselsnummer.
export const erFødselsnummer = (verdi: string) => /^\d{11}$/.test(verdi);
