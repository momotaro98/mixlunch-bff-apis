docker-run:
	docker-compose down
	docker-compose build
	docker-compose up
docker-stop:
	docker-compose down
