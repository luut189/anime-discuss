# AniDis - Anime Discussion Platform

## About

AniDis is a MERN stack-based platform where anime fans can engage in threaded discussions about their favorite series.

It offers daily updates on the latest episodes, highlights trending anime, and provides dedicated threads for specific shows, allowing users to discuss, share opinions, and stay connected to the anime community.

## Setup development environment

Please ensure you have `Node` installed

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

4. Open the app at `http://localhost:5173`

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
