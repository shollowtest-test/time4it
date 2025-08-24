# time4it

W plikach README.md znajdują się opisy dla każdej z aplikacji.

Typowane w aplikacji frontowej było robione na szybko :/ jako kompromis

Lokalnie używałem pnpm.

To nie jest wersja produkcyjna.

Całość zajęła mi około 6 godzin, głównie dlatego, że zdecydowałem się na Ant Design (AntD), który nie do końca współpracuje z Reactem 19. Dodatkowo straciłem około 30 minut na pobieranie paczek do projektu Next.js (problemy z połączeniem internetowym).

Pliki .env dodałem do repozytorium – zawierają tylko podstawowe zmienne potrzebne do uruchomienia projektu (bez żadnych wrażliwych danych).


na dokerze jest minio i mongoDB:

- Docker normlanie starujemy 

docker-compose -f infra/docker-compose.yml up -d

Po uruchomieniu kontenerów, należy ręcznie skonfigurować MinIO:

    Otwórz konsolę MinIO w przeglądarce: http://localhost:9001.

    Zaloguj się używając domyślnych danych: admin12345 / admin12345.

    Utwórz nowy bucket o nazwie orders-bucket.
