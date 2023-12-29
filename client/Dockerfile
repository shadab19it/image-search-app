# Use the node:18.16.0 image as the build stage
FROM node:18.17.0 AS web-build

# Set the working directory inside the container
WORKDIR /app

 

# Copy all the files from the host machine to the container
COPY . .

 

# Install dependencies
RUN npm install

 

# Build the application
RUN npm run build

 

# Use the nginx:1.25.0 image as the final stage
FROM nginx:1.25.0

 

# Create a directory for the application in the nginx container
RUN mkdir -p /var/www/meltingflower/

 

# Copy the build output from the web-build stage to the nginx container
COPY --from=web-build /app/ /var/www/meltingflower/

 

# Remove the default nginx configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

 

# Copy your custom nginx configuration (alazka.conf) to the container
COPY meltingflower.conf /etc/nginx/conf.d/meltingflower.conf