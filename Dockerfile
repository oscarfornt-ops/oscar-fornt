FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --prefer-offline --no-audit

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port for the API
EXPOSE 3000

# Run development server by default
CMD ["npm", "run", "dev"]
