# Backend Modułu Zamówień (NestJS + CQRS)

Backend do zadania rekrutacyjnego implementujący mini-moduł "Zamówienia". Aplikacja została zbudowana w oparciu o architekturę CQRS z wykorzystaniem NestJS, MongoDB i komunikacji w czasie rzeczywistym przez WebSocket.

## Struktura Projektu

Projekt jest częścią monorepo i znajduje się w katalogu `/apps/api`. Główne moduły to:

- `/src/orders`: Zawiera całą logikę biznesową związaną z zamówieniami, zaimplementowaną w architekturze CQRS (komendy, zapytania, zdarzenia).
- `/src/uploads`: Odpowiada za generowanie bezpiecznych linków pre-signed URL do wysyłania plików.

## Uruchomienie

### Wymagania

- Node.js (wersja 18+)
- Docker i Docker Compose

### 1. Uruchomienie infrastruktury

Wszystkie niezbędne usługi (MongoDB, MinIO) są zarządzane przez Docker Compose.

# Z głównego katalogu repozytorium

docker-compose -f infra/docker-compose.yml up -d

Po uruchomieniu kontenerów, należy ręcznie skonfigurować MinIO:

    Otwórz konsolę MinIO w przeglądarce: http://localhost:9001.

    Zaloguj się używając domyślnych danych: admin12345 / admin12345.

    Utwórz nowy bucket o nazwie orders-bucket.

2. Konfiguracja Aplikacji

Aplikacja jest skonfigurowana za pomocą zmiennych środowiskowych. W katalogu /apps/api stwórz plik .env z poniższą zawartością:

# Kluczowe Decyzje i Kompromisy

## CQRS i Broker Zdarzeń

Zgodnie z wytycznymi, zastosowano pełną separację modeli zapisu i odczytu. Zamiast Kafki, wykorzystano wbudowany w NestJS `EventBus` (in-memory), Ale wymienibym go na Kafkę.

## WebSocket po Projekcji

Powiadomienia w czasie rzeczywistym są wysyłane dopiero po pomyślnym zapisaniu danych w zdenormalizowanym modelu do odczytu (`OrderCreatedHandler`) aby odpytać API o spójne, zaktualizowane dane

## Idempotencja

na poziomie:

- bazy danych – unikalny indeks `(tenantId, requestId)`,
- aplikacji – dodatkowe sprawdzenie przed zapisem.

Zapewnia to solidną ochronę przed duplikacją żądań.

## Walidacja Uploadu

Walidacja typu i rozmiaru pliku odbywa się w backendzie przed wygenerowaniem linku pre-signed. Nie zrobiłem pełnej walidacji ( założym że "ufami klientowi" ), ale tu rozbudowała tą walidację, a w wersji produkcujnej rozwiną był jeszcze politykę po stronie S3/MinIO.

---

# Co bym zrobił w wersji v2?

- dodabym api do kontenera dockerowego ( ale to juz jak miałby trafiać na produkcje)

- Zabezpieczyłmy był sockety przy pomocy CORS, i portu ( wstepnie )

- W połączeniu z nextJS zastanowiłbym się czy nie zrobić użyć go jako wejscowego endpointu. Czyli tylko nextjs jest otwarty na świat i tylko on łączy się w sieci wewnętrzej z api. Do samego api bezpośrednio nie wjedziesz ( w ostatnim projecie tak zrobiłem, bo devOps nie chciał udostepniać api an świat, tylko dostępne w sieci wewnetrzenej. Wieć wszystkie zapytania z zewnątrz szły przez next, gdzie robiona była wstepna walidacja i było odrzucane zapytanie aby api mogło sie nudzić :) )

- Pomyślałbym nad helperami / wraperami aby suprawnić sobie pisanie ( ale to jest kwestia do przemyślnia, bo czasami efekt będzie odwrotny, a modyfikacje kodu trudniejsze ...)

## Zewnętrzny Broker Zdarzeń

Zastąpiłbym `EventBus` klientem **Kafką**

## Może dodałbym wzorzeć OutBox

## Uwierzytelnianie i Autoryzacja

Pełna autoryzacja - `NestJS Guards`,`Passport.js`.

## Testy

Dodałbym testy

- **testy jednostkowe** dla handlerów CQRS ,
- **testy e2e** dla kluczowych przepływów

## Caching

Wdrożyłbym warstwę **cache** (np. Redis) dla zapytań o listy zamówień, z unieważnianiem cache’a po zdarzeniach `OrderCreated` lub `OrderStatusChanged`.
