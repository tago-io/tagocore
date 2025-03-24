FROM node:22-bookworm-slim

# Set the working directory
WORKDIR /tagocore

# Copy files to the working directory
COPY . .

# Set environment variables
ENV JUST_VERSION=1.36.0

# RUN node just_bin.mjs ${JUST_VERSION} ${BUILD_PLATFORM} && exit 1;

# Install distro libs, download and install 'just', and clean up in a single RUN statement
RUN apt update && \
    apt install -y curl netcat-openbsd && \
    apt install -y python3 make g++ build-essential && \
    rm -rf /var/lib/apt/lists/* && \
    export JUST_FILENAME=$(node just_bin.mjs ${JUST_VERSION}) && \
    curl -L -o just.tar.gz https://github.com/casey/just/releases/download/${JUST_VERSION}/$JUST_FILENAME && \
    tar -xzf just.tar.gz && \
    mv just /usr/local/bin/just && \
    chmod +x /usr/local/bin/just && \
    rm -rf just.tar.gz;

# Install dependencies

RUN just install;

# Build the console
RUN just build-console;

# Build the integration
RUN just build-integration;

# Expose the necessary port
EXPOSE 8888

# Add a health check using nc to check if the port is open
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD nc -z localhost 8888 || exit 1

# Set the default command
CMD ["just", "server"]
