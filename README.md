## Konfiguracja lokalnego serwera u siebie:

- Trzeba sobie zainstalować **NodeJS** wraz z **npm**.
  NodeJS to java-scriptowa platforma backendowa, npm to program zarządzający
  pakietami w projekcie. Tu macie link do instrukcji instalacyjnych: [link](https://nodejs.org/en/download/package-manager).
- Teraz wywołujemy kilka komend:

```sh
# klonujemy repozytorium
git clone https://gitlab-stud.elka.pw.edu.pl/polizarcie/pap2024z-z19
mv pap2024z-z19 polizarcie # opcjonalnie polecam zmienić nazwę katalogu
cd polizarcie # wchodzimy do projektu
# instalujemy wszystkie wymagane w projekcie pakiety (instalacja lokalna dla projektu)
npm install
# uruchamiamy serwer developerski
npm run dev
```

Jeżeli wszystko poszło zgodnie z planem nasza strona powinna być dostępna pod
adresem [http://localhost:3000](http://localhost:3000),
