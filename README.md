## Konfiguracja lokalnego serwera u siebie:

- Trzeba sobie zainstalować **NodeJS** wraz z **npm**.
  NodeJS to java-scriptowa platforma backendowa, npm to program zarządzający
  pakietami w projekcie. Tu macie link do instrukcji instalacyjnych: [link](https://nodejs.org/en/download/package-manager).
- Teraz wywołujemy kilka komend inicjalizujących projekt:

```sh
# klonujemy repozytorium
git clone https://gitlab-stud.elka.pw.edu.pl/polizarcie/pap2024z-z19
mv pap2024z-z19 polizarcie # opcjonalnie polecam zmienić nazwę katalogu
cd polizarcie # wchodzimy do projektu
# instalujemy wszystkie wymagane w projekcie pakiety (instalacja lokalna dla projektu)
npm install
```

- Następnie konfigurujemy bazę danych. W tym celu na początku instalujemy PostgreSQL. Instrukcje instalacyjne: [link](https://www.postgresql.org/download/). Po zakończeniu instalacji i skonfigurowania sobie jakiegoś administratora domyślnego na serwerze (zazwyczaj o nazwie postgres) przechodzimy dalej.
- W pliku `.env` w katalogu głównym (pliku najprawdopodobniej nie będzie ponieważ nie powinien on być pushowany, więc go tworzymy) dodajemy poniższą linijkę. Pola user, password i database podmieniamy oczywiście na te na naszym serwerze (możemy wpisać nazwę nieistniejącej bazy, zostanie wtedy utworzona)

```sh
DATABASE_URL="postgresql://<user>:<password>@localhost:5433/<database>?schema=public"
```

- Integracja bazy z prismą. Prisma udostępnia nam kilka narzędzi służących do jej szybkiej integracji z właściwą bazą danych. Ogólny schemat bazy zapisujemy w pliku `prisma/schema.prisma` natomiast pliki inicjalizujący bazę jakimiś domyślnymi danymi (tz. seed) znajduje się w `prisma/seed.ts`. Żeby zaaplikować zmiany w tych plikach (albo włączyć je na start) korzystamy z następujących poleceń:

```sh
# instalujemy na naszym komputerze naprzędzie do szybkiego uruchamiania plików .ts
# wymagane żeby uruchomić plik prisma/seed.ts, instalujemy to tylko raz.
npm install -g ts-node
# regenerujemy typy w projekcie tak, żeby odzwierciedlały konfigurację schema.prisma
npx prisma generate
# migrujemy bazę zadeklarowaną w schema.prisma do faktycznej bazy danych
npx prisma migrate dev
```

Jeżeli wszystko poszło zgodnie z planem nasz projekt powinien być w pełni skonfigurowany i gotowy do pracy. Aby go uruchomić wpisujemy:

```sh
npm run dev
```

O ile nie wystąpi żaden niespodziewany błąd to strona powinna być dostępna pod
adresem [http://localhost:3000](http://localhost:3000),
