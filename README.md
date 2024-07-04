# Semi-A

## Usage

1. Clone this repository

```sh
git clone https://github.com/ogatakatsuya/Semi-A.git
```

2. Navigate to the Project Directory

```sh
cd Semi-A
```

3. Build and Boot

```sh
docker compose up --build
```

4. Access the Application

```sh
http://localhost:3000
```

5. Stop the Application

```sh
docker compose down
```

## パッケージを追加するとき

以下のいずれかで対応

1. コンテナ内で直接インストール

```sh
docker container exec -it svelte_container sh
npm install
```

2. volumeを削除して再度ビルド

```sh
docker volume ls
```

出てきたvolumeを削除して再度ビルドする．多分，semi-a_node_modulesかな？

```sh
docker volume rm {your volume name}
docker compose up --build
```
