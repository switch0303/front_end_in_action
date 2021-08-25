## 1. 启动docker服务
```
docker-compose up
```

## 2.待所有docker服务启动成功后，初始化mongodb
```
yarn mongo-init
```

## 3.启动node服务
```
yarn install
yarn start
```