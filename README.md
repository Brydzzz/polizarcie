# Poliżarcie

## Konspekt

Konspekt znajduje się w pliku: [konspekt.md](./konspekt.md)

## Zintegrowane i użyte technologie:

<div style="display: flex; gap: 50px; max-width: 500px; flex-wrap: wrap; justify-content: center;">
  <img src="https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg" alt="NextJS" />
  <img src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg" alt="React" />
  <img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg" alt="TypeScript" />
  <img src="https://www.vectorlogo.zone/logos/js_redux/js_redux-icon.svg" alt="Redux" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/prisma.svg" height=60 alt="Prisma" />
  <img src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/refs/heads/main/svg/openstreetmap.svg" height=60 alt="OpenStreetMap" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/openlayers.svg" height=60 alt="OpenLayers" />
  <img src="https://authjs.dev/img/etc/logo-sm.webp" height=60 alt="AuthJS" />
  <img src="https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg" alt="Supabase" />
  <img src="https://www.vectorlogo.zone/logos/sass-lang/sass-lang-icon.svg" alt="Sass" />
  <img src="https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg" alt="PostgreSQL" />
  <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" alt="NodeJS" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/zod.svg" height=60 alt="Coolify" />
  <img src="https://www.vectorlogo.zone/logos/docker/docker-tile.svg" height=60 alt="Docker" />
  <img src="https://raw.githubusercontent.com/walkxcode/dashboard-icons/refs/heads/main/svg/coolify.svg" height=60 alt="Coolify" />
</div>

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

- Następnie konfigurujemy bazę danych. W tym celu na początku instalujemy **PostgreSQL**. Instrukcje instalacyjne: [link](https://www.postgresql.org/download/). Po zakończeniu instalacji i skonfigurowania sobie jakiegoś administratora domyślnego na serwerze (zazwyczaj o nazwie postgres) przechodzimy dalej.
- W pliku `.env` w katalogu głównym (pliku najprawdopodobniej nie będzie ponieważ nie powinien on być pushowany, więc go tworzymy) dodajemy poniższą linijkę. Pola user, password i database podmieniamy oczywiście na te na naszym serwerze (możemy wpisać nazwę nieistniejącej bazy, zostanie wtedy utworzona)

```sh
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
```

- Integracja bazy z prismą. **Prisma** udostępnia nam kilka narzędzi służących do jej szybkiej integracji z właściwą bazą danych. Ogólny schemat bazy zapisujemy w pliku `prisma/schema.prisma` natomiast pliki inicjalizujący bazę jakimiś domyślnymi danymi (tz. seed) znajduje się w `prisma/seed.ts`. Żeby zaaplikować zmiany w tych plikach (albo włączyć je na start) korzystamy z następujących poleceń:

```sh
# instalujemy na naszym komputerze naprzędzie do szybkiego uruchamiania plików .ts
# wymagane żeby uruchomić plik prisma/seed.ts, instalujemy to tylko raz.
npm install -g ts-node
# regenerujemy typy w projekcie tak, żeby odzwierciedlały konfigurację schema.prisma
npx prisma generate
# migrujemy bazę zadeklarowaną w schema.prisma do faktycznej bazy danych
npx prisma migrate dev
```

- Kolejnym krokiem jest instalacja i konfiguracja **Supabase**.
  W tym celu musimy najpierw zainstalować **Docker**-a na naszym komputerze - link do poradnika instalacyjnego: [link](https://docs.docker.com/desktop/).
  Następnie instalujemy Supabase zgodnie z instrukcjami zawartymi pod linkiem: [link](https://supabase.com/docs/guides/self-hosting/docker),
  dokładniej interesuje nas poniższy fragment kodu:

```sh
# Instalujemy kod źródłowy
# (Polecam wcześniej wejść do katalogu w którym chcemy to mieć)
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env # Kopiujemy domyślne zmienne .env
docker compose pull
```

```sh
# Modyfikujemy poniższe linijki w pliku .env (tym supabase-a, nie naszym!)
# Poniżej podałem jakieś przykładowe wartości, w produkcji będzie trzeba ustawić inne!
# Możemy wygenerować własne przy pomocy: https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys
POSTGRES_PASSWORD=postgres
JWT_SECRET=iHoI8ceNlSWQ85k0Ml4XIO1ldUVaGXGn7mY4oZNI
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM0NjQ5MjAwLAogICJleHAiOiAxODkyNDE1NjAwCn0.cldxy7XXdlWdZFjkGQHsA3dDEzx-lP79dCO43FDCEa0
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MzQ2NDkyMDAsCiAgImV4cCI6IDE4OTI0MTU2MDAKfQ.zC2mOmlxiqTbDutERZklO5A17KA8ah7e5lN17TghMS4
DASHBOARD_USERNAME=supabase
DASHBOARD_PASSWORD=supabase
```

```sh
# Uruchamiamy supabase (wszystko w <katalog supabase-a>/docker)
# Będzie to trzeba uruchamiać przed każdym startem aplikacji
docker compose up -d
# W przypadku restartu supabase (np. po zmianie jego zmiennych .env) wpisujemy
docker compose down -v
rm -rf volumes/db/data/
docker compose up -d
```

- Po uruchomieniu supabase-a wchodzimy sobie pod [http://localhost:8000/project/default/storage/buckets](http://localhost:8000/project/default/storage/buckets),
  logujemy się (w przypadku powyżeszej konfiguracji supabase:supabase) i klikamy guzik "New bucket".
  Nazywamy nasz nowy kubełek "polizarcie", zaznaczamy "Public bucket" i zapisujemy zmiany.
  Ostatnim krokiem jest dopisanie do naszego projektowego pliku .env poniższych linijek:

```sh
NEXT_PUBLIC_SUPABASE_URL="http://localhost:8000"
NEXT_PUBLIC_SUPABASE_ANON_KEY=<nasz ANON_KEY>
SUPABASE_SERVICE_KEY=<nasz SERVICE_ROLE_KEY>
NEXT_PUBLIC_SUPABASE_BUCKET_NAME="polizarcie"
```

Jeżeli wszystko poszło zgodnie z planem nasz projekt powinien być w pełni skonfigurowany i gotowy do pracy. Aby go uruchomić wpisujemy:

```sh
npm run dev
```

O ile nie wystąpi żaden niespodziewany błąd to strona powinna być dostępna pod
adresem [http://localhost:3000](http://localhost:3000),
