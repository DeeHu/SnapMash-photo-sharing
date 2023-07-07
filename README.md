# SnapMash-photo-sharing
## Project Setup

Make sure you download Docker to your laptop

1. Clone the repository
2. Navigate to the project directory:
3. Build the Docker images:
Run CLI `docker-compose build`
4. Start the services:
Run CLI `docker-compose up`

The React application will be accessible at http://localhost:3000, and the Flask application at http://localhost:5001.


## To run an interactive PostgreSQL terminal (psql) inside the running Docker container
Example: `docker exec -it 75bbe49ad4a4 psql -U postgres`

Explaination: 
* `docker exec -it`: This Docker command is used to run a command in a running Docker container. The `-it` option provides an interactive terminal to the container.

* `75bbe49ad4a4`: This is the ID of the Docker container where you want to run the command. This ID is unique to each container.

* `psql -U postgres`: This is the command you are running inside the Docker container. `psql` is the terminal-based front-end to PostgreSQL (it's like the shell to PostgreSQL). `-U postgres` specifies that you want to connect to the PostgreSQL server as the "postgres" user, which is a common superuser name for PostgreSQL.


