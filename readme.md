# Image Search with Text to Image or Image to Image

## Overview

This is a simple image search application that allows users to search for images using a Python backend with FastApi, DeepSearchImage and a ReactJS frontend. The backend utilizes a Python framework for image processing and retrieval, while the frontend provides a user-friendly interface for searching and displaying results.

## Features

- Image search functionality
- Responsive user interface
- Integration with a Python backend for image processing
- Download
- Share on WhatsApp

## Prerequisites

Make sure you have the following installed on your machine:

- Python (version X.X.X)
- Node.js (version X.X.X)
- npm (version X.X.X)

## Getting Started

### Backend (Python)

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend server:

   ```bash
   uvicorn server:app --reload
   ```

   The backend will run on `http://localhost:8000`.

### Frontend (ReactJS)

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install the required npm packages:

   ```bash
   npm install
   ```

3. Run the frontend development server:

   ```bash
   npm dev
   ```

   The frontend will be accessible at `http://localhost:3000`.

## Usage

1. Open your web browser and go to `http://localhost:3000`.
2. Use the search bar to enter keywords for image search.
3. View the search results and click on images for more details.

## Contributing

If you would like to contribute to the project, please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the [MIT License](LICENSE).
