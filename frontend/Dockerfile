# Use official Node.js image as a base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install all dependencies (including development dependencies for tests)
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the React app (default port is 3000)
EXPOSE 3000

# Set the default command to run the React app
CMD ["npm", "start"]


