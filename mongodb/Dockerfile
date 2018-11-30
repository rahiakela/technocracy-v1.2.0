FROM mongo
COPY tech.gz /tech.gz
RUN mongorestore --host 127.0.0.1 --port 27017 tech.gz
