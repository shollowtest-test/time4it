# Frontend Modułu Zamówień (Next.js + Server Actions)

Frontend do zadania rekrutacyjnego, zbudowany przy użyciu Next.js 14+ z App Router. Aplikacja implementuje interfejs do tworzenia i przeglądania zamówień, wykorzystując nowoczesne funkcje frameworka, takie jak Server Actions, Server-Side Rendering (SSR) i Streaming. Komunikacja w czasie rzeczywistym jest realizowana przez WebSockets.

## Struktura Projektu

Projekt znajduje się w katalogu `/apps/web` i wykorzystuje strukturę bez folderu `src/`.

- `/app`: Główny katalog App Routera.
  - `/app/orders/page.tsx`: Komponent serwerowy strony głównej,
  - `/app/actions/`: Plik zawierający Server Actions,
  - `/app/loading.tsx`: Komponent wyświetlany podczas ładowania danych na serwerze.
- `/components`: Katalog z reużywalnymi komponentami React.
- `/middleware.ts`: Middleware do "podszywania" użytkownika i tenanta za pomocą ciasteczka.
- `/types`: Definicje typów TypeScript używane w aplikacji.

## Uruchomienie

### Wymagania

- Node.js (wersja 18+)
- Uruchomiony backend (zgodnie z instrukcjami w jego `README.md`)

### 1. Konfiguracja Aplikacji

Aplikacja jest skonfigurowana za pomocą zmiennych środowiskowych.

1.  W katalogu `/apps/web` stwórz plik `.env.local`.
2.  Skopiuj do niego poniższą zawartość, upewniając się, że adresy URL pasują do Twojej konfiguracji backendu.

    ```env
    # Adres URL backendu (NestJS API)
    NEXT_PUBLIC_API_URL=http://localhost:3000/api

    # Adres URL dla połączeń WebSocket
    NEXT_PUBLIC_WS_URL=http://localhost:3000
    ```

### 2. Instalacja i Start

```bash
# Przejdź do katalogu frontendu
cd apps/web

# Zainstaluj zależności
npm install

# Uruchom aplikację w trybie deweloperskim
npm run dev
```

Aplikacja domyślnie uruchomi się na porcie `3001` (`http://localhost:3001`), aby uniknąć konfliktu z backendem. Port można zmienić w pliku `package.json` w skrypcie `dev`.

## Kluczowe Decyzje i Technologie

- **Next.js App Router**: Wykorzystano najnowszą architekturę Next.js do budowy aplikacji.
- **Server Actions**: Cała logika tworzenia zamówienia (w tym komunikacja z backendem, upload pliku) została zaimplementowana jako Server Action.
- **Server-Side Rendering (SSR) dla Listy**: Początkowa lista zamówień jest w całości renderowana na serwerze.
- **Dynamiczna Paginacja po Stronie Klienta**: Po pierwszym załadowaniu, kolejne strony listy są dociągane dynamicznie za pomocą `axiso/fetch`
- **WebSockets**: Komponent listy zamówień nawiązuje połączenie WebSocket z backendem, aby nasłuchiwać na zdarzenia `order.updated`.
- **Uproszczona Autoryzacja**: Zgodnie z wytycznymi, zastosowano Next.js Middleware do automatycznego tworzenia "podszytego" użytkownika i tenanta w ciasteczku `httpOnly`.

## Kompromsy

- nie używałem contextu, ale można by go tu użyć.
- komponent listy nie jest uniwersalny, główny chodzi o czas. Bardziej uniwersalnym rozwiązaniem jest wrapper na niego, aby tylko przekazywać mu akcje, dane i listę kolumn ( zarządzanie po przez objekt) skupiłem się na tym aby to tak zadziałało jak miało zadziałać.
- użyłem MaterialUi.
- uzyłem tailwinda i styli na zmiane - bo szybciej jak z palca pisałem
- Nie do konca wytypowałem wszystko.
- Nie robiłem pełnego widoku danych ze wzgldu na skupieniu się na odpowiednim zachowaniu
- akcje dałem w jednym folderze, bo mogłyby być wykorzystywane w innym modułach. a nie tylko w orders ( aby były tylko do orders to dałbym jest w folderze danej strony jakżda akcja jako osobny plik + jeden agrgujący aby nie był n importów w modułach.

## Co bym zrobił w v2

- Napisałbym testy
- dodałbym formularz tworzenia Formularz z wstepną waldacją danych. Ale główną walidację zostawiam API
- zrobił bym czytelniejszą obsługę błędów z serwera w wersji produkcyjnej
- Zwrapował byl komponent listy, tak aby na wejsciu otrzymywał np. Definicję kolumn, akcje itd. Aby był uniwersalny
- dodałbym, jakby w aby dodawanie nowego zamówienia też odbywało sie po api
- można by wykorzystać useOptymistic z reacta, ale nie przepadam za tym pod względem UX. Cos się dodaje a potem znika.
- Dodałbym prefacha na paginacji
- I dodał jakieś inputy do filtrowania.
- Dodałbym pełną obsługę Autoryzacyjną. np NextAuth
