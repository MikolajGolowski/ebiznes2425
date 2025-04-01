FROM ubuntu:24.04
ENV TZ=Europe/Warsaw

RUN apt-get update && \
    apt-get install -y software-properties-common

RUN add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update

RUN apt-get install -y python3.10 python3.10-dev python3.10-venv

RUN apt-get install -y \
    python3.10 \
    openjdk-8-jdk \
    kotlin \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

ENV GRADLE_VERSION=8.6
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp \
    && unzip /tmp/gradle-${GRADLE_VERSION}-bin.zip -d /opt \
    && rm /tmp/gradle-${GRADLE_VERSION}-bin.zip

ENV GRADLE_HOME=/opt/gradle-${GRADLE_VERSION}
ENV PATH=${PATH}:${GRADLE_HOME}/bin

WORKDIR /app

COPY build.gradle .
COPY settings.gradle .
COPY src ./src

RUN gradle build --no-daemon

CMD /bin/bash && python3.10 --version && gradle run --no-daemon