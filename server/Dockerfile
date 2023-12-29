# Use an official Python 3.8 image
FROM python:3.8.10-slim

# Set up your container as before
WORKDIR /app
COPY . /app
RUN  pip install --no-cache-dir -r requirements.txt
RUN prisma generate
EXPOSE 80
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

