# Next.js + TypeScript + Tailwind CSS + Docker

## 起動

```bash
docker compose up --build
```

ブラウザで以下を開いてください。

```text
http://localhost:3000
```

## 停止

```bash
docker compose down
```

## 補足

- ホストのソース変更はコンテナにマウントされ、Next.js の開発サーバーが再読み込みします。
- `CHOKIDAR_USEPOLLING=true` と `WATCHPACK_POLLING=true` で Docker Desktop/WSL でのファイル検知を安定化します。
