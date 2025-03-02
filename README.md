# AniDis - Anime Discussion Platform

## About

AniDis is a MERN stack platform designed for anime enthusiasts to connect and engage in community-driven discussions.

Users can pin their favorite anime, follow daily episode updates, and explore trending anime. The platform features dedicated threads for each anime, where users can share their thoughts and opinions on individual shows, creating a vibrant, interactive anime community.

## Setup development environment

Please ensure you have `Node >= 22.11` installed

1. Navigate to both directories and run `npm install` to install all necessary dependencies

    > Remember to create your `.env` file for the app based on the provided `.env.example`

2. Navigate to `./frontend` and run

    ```bash
    npm run dev
    ```

3. Navigate to `./backend` and run

    ```bash
    npm run dev
    ```

4. Open the backend at `http://localhost:PORT` with `PORT` being what you put in your `.env` file

5. Open the app at `http://localhost:5173`

## Instruction for Production

1. Build the Docker image by

    ```bash
    docker build -t anime-discuss .
    ```

2. Run the Docker container

    ```bash
    docker run -p 5000:5000 --env-file .env anime-discuss
    ```

3. Open the app at `http://localhost:5000`

    > Assuming you put `PORT=5000` in your `.env`
