VERSION=1.0.1
IMAGE=hub.docker.com/hangzhou/news-app:$VERSION
docker build -t $IMAGE .
# docker push $IMAGE