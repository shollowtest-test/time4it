# time4ita

- W plikach Readme.md są opisy do każdej z apek
- Docker normlanie starujemy 
- Lokalnie używałem pnpm-a
- To nie jest wersja produkcujna.
- w sumie zeszło mi ok 6h ze tego względu że wziołem antUI a on nie zabardzo chciał wspoplracować z reactem 19 i 30 min spraciłem na pobieranie paczek do projektu nextjs (jakies problemy z netem)
- envy wgrywam na repo (podstawowe to co było potrzebne, nic więcej)

na dokerze jest minio i mongo:

docker-compose -f infra/docker-compose.yml up -d

Po uruchomieniu kontenerów, należy ręcznie skonfigurować MinIO:

    Otwórz konsolę MinIO w przeglądarce: http://localhost:9001.

    Zaloguj się używając domyślnych danych: admin12345 / admin12345.

    Utwórz nowy bucket o nazwie orders-bucket.
