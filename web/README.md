# Frontend Modułu Zamówień (Next.js + Server Actions)

Frontend do zadania rekrutacyjnego, zbudowany przy użyciu Next.js 14+ z App Router. Aplikacja implementuje interfejs do tworzenia i przeglądania zamówień, wykorzystując nowoczesne funkcje frameworka, takie jak Server Actions, Server-Side Rendering (SSR) i Streaming. Komunikacja w czasie rzeczywistym jest realizowana przez WebSockets.

## Struktura Projektu

Projekt znajduje się w katalogu `/apps/web` i wykorzystuje strukturę bez folderu `src/`.

- `/app`: Główny katalog App Router
  - `/app/orders/page.tsx`: Komponent serwerowy strony głównej
  - `/app/actions/`: Plik zawierający Server Actions
  - `/app/loading.tsx`: Komponent wyświetlany podczas ładowania danych na serwerze
- `/components`: Katalog z reużywalnymi komponentami React
- `/middleware.ts`: Middleware do "podszywania" użytkownika i tenanta za pomocą ciasteczka
- `/types`: Definicje typów TypeScript używane w aplikacji

## Uruchomienie

### Wymagania

- Node.js (wersja 18+)
- Uruchomiony backend (zgodnie z instrukcjami w jego `README.md`)

### 1. Konfiguracja Aplikacji

Aplikacja jest skonfigurowana za pomocą zmiennych środowiskowych.

1. W katalogu `/apps/web` stwórz plik `.env.local`.
2. Skopiuj do niego poniższą zawartość, upewniając się, że adresy URL pasują do Twojej konfiguracji backendu.

env
# Adres URL backendu (NestJS API)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Adres URL dla połączeń WebSocket
NEXT_PUBLIC_WS_URL=http://localhost:3000

# Przejdź do katalogu frontendu
cd apps/web

# Zainstaluj zależności
pnpm install

# Uruchom aplikację w trybie deweloperskim
pnpm run dev

Aplikacja domyślnie uruchomi się na porcie 3001 (http://localhost:3001), aby uniknąć konfliktu z backendem. Port można zmienić w pliku package.json w skrypcie dev.

# Kluczowe Decyzje i Technologie

    Next.js App Router: Wykorzystano najnowszą architekturę Next.js do budowy aplikacji

    Server Actions: Cała logika tworzenia zamówienia (w tym komunikacja z backendem, upload pliku) została zaimplementowana jako Server Action

    Server-Side Rendering (SSR) dla Listy: Początkowa lista zamówień jest w całości renderowana na serwerze

    Dynamiczna Paginacja po Stronie Klienta: Po pierwszym załadowaniu, kolejne strony listy są pobierane dynamicznie za pomocą axios/fetch

    WebSockets: Komponent listy zamówień nawiązuje połączenie WebSocket z backendem, aby nasłuchiwać na zdarzenia order.updated

    Uproszczona Autoryzacja: Zgodnie z wytycznymi, zastosowano Next.js Middleware do automatycznego tworzenia "podszytego" użytkownika i tenanta w ciasteczku httpOnly

# Kompromisy

    Nie użyłem contextu, ale można by go tu użyć

    Komponent listy nie jest uniwersalny, głównie z powodu ograniczeń czasowych. Bardziej uniwersalnym rozwiązaniem jest wrapper na niego, aby tylko przekazywać mu akcje, dane i listę kolumn (zarządzanie przez obiekt). Skupiłem się na tym, aby to zadziałało zgodnie z wymaganiami

    Użyłem Material UI

    Użyłem Tailwinda i stylów na zmianę - dla szybszego pisania

    Nie do końca wytypowałem wszystko

    Nie zrobiłem pełnego widoku danych ze względu na skupienie się na odpowiednim zachowaniu

    Akcje umieściłem w jednym folderze, bo mogłyby być wykorzystywane w innych modułach. Jeśli miałyby być tylko do orders, umieściłbym je w folderze danej strony, każdą akcję jako osobny plik + jeden agregujący, aby nie było wielu importów w modułach

# Co bym zrobił w wersji 2

    Napisałbym testy

    Dodałbym formularz tworzenia z wstępną walidacją danych. Główną walidację zostawiłbym API

    Zrobiłbym czytelniejszą obsługę błędów z serwera w wersji produkcyjnej

    Opakowałbym komponent listy, tak aby na wejściu otrzymywał np. definicję kolumn, akcje itd., aby był uniwersalny

    Dodałbym, aby dodawanie nowego zamówienia też odbywało się przez API

    Można by wykorzystać useOptimistic z Reacta, ale nie przepadam za tym pod względem UX (coś się dodaje a potem znika)

    Dodałbym prefetch na paginacji

    Dodałbym jakieś inputy do filtrowania

    Dodałbym pełną obsługę autoryzacyjną, np. NextAuth
