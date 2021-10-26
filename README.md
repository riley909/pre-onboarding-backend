# 프로젝트 소개

게시판 CRUD API를 구현한 프로젝트 입니다.
회원가입과 로그인이 가능하고, JWT를 사용해 인증 기능을 구현했습니다.

전체 글 목록 조회시 모든 글의 목록을 조회하거나, 페이지네이션 기능을 이용해
원하는 개수만큼 글을 묶어 페이지별로 조회할 수 있습니다.
전체 글 목록 조회는 모든 유저의 글을 볼 수 있지만,
게시글의 수정과 삭제는 작성한 유저 본인의 것만 가능합니다.

게시글 삭제의 경우 soft delete와 hard delete 두 가지로 구현했습니다.
기록을 복구하고 싶을 때 유용합니다.
soft delete는 글의 상태를 'OPEN'과 'CLOSE'로 나타내는 status 항목을 두어
status가 'CLOSE'로 바뀌면 더 이상 사용하지 않는 글로 간주합니다.
hard delete는 물리적으로 완전 삭제하는 것으로, 글의 상태가 'CLOSE' 처리가 되어있을 경우에만 가능합니다.

# 프로젝트 사용법

> 의존성 패키지 설치

```
npm install
```

> 테스트 서버 실행

```
npm run start:dev
```

데이터베이스와 설정 파일은 프로젝트 내 첨부된 아래 파일들을 이용합니다.

- posts.db
- .env.stage.dev
- ormconfig.json

# API 문서

## 회원 가입

**URL**

```
POST http://localhost:3000/auth/signup
```

**Parameter**

| Name     | Type   | Description | Required |
| -------- | ------ | ----------- | :------: |
| email    | String | 이메일      |    O     |
| password | String | 비밀번호    |    O     |

> Request: 실행 예시

```
curl -X POST "http://localhost:3000/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{"email":"email@gmail.com", "password":"password"}'
```

> Response

```
200 OK

회원 가입이 완료되었습니다.
```

```
409 Conflict

{
  "statusCode":409,
  "message":"이미 가입된 이메일 입니다",
  "error":"Conflict"
}
```

## 로그인

**URL**

```
POST http://localhost:3000/auth/signin
```

**Parameter**

| Name     | Type   | Description | Required |
| -------- | ------ | ----------- | :------: |
| email    | String | 이메일      |    O     |
| password | String | 비밀번호    |    O     |

> Request: 실행 예시

```
curl -X POST "http://localhost:3000/auth/signin" \
    -H "Content-Type: application/json" \
    -d '{"email":"email@gmail.com", "password":"password"}'
```

> Response

```
200 OK

{
  "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxlbW9uMDAxQGdtYWlsLmNvbSIsImlhdCI6MTYzNTIxNDc3OCwiZXhwIjoxNjM1MzAxMTc4fQ.96BrzmOo3BTN7ySLmeP8F8LmaPo2bRCswEjxeqcBrQ0"
}
```

```
400 Bad Request

{
  "statusCode":400,
  "message":["password must be longer than or equal to 8 characters"],
  "error":"Bad Request"
}
```

```
401 Unauthorized

{
    "statusCode": 401,
    "message": "로그인 정보를 다시 확인해 주세요.",
    "error": "Unauthorized"
}
```

## 게시글 목록 조회하기

- 게시글 목록을 받아 옵니다.

**URL**

```
GET http://localhost:3000/posts
```

**Parameter**

| Name | Type   | Description               | Required |
| ---- | ------ | ------------------------- | :------: |
| take | Number | 페이지당 표시할 게시글 수 |    X     |
| page | Number | 조회할 페이지 번호        |    X     |

> Request: 실행 예시

```
전체 목록 출력

curl -X GET "http://localhost:3000/posts" \
    -H "Authorization: Bearer {ACCESS_TOKEN}"
```

```
페이지네이션 적용

curl -X GET "http://localhost:3000/posts?take=3&page=1" \
    -H "Authorization: Bearer {ACCESS_TOKEN}"
```

> Response

```
200 OK

{
  "results":
    [
      {
        "id":12,
        "title":"cheese",
        "content":"donut",
        "created":"2021-10-25",
        "status":"OPEN"
      },
      {
        "id":11,
        "title":"olive",
        "content":"donut",
        "created":"2021-10-25",
        "status":"OPEN"
      },
      {
        "id":8,
        "title":"pink",
        "content":"banana",
        "created":"2021-10-25",
        "status":"OPEN"
      },
    ],
  "pageTotal":3,"total":10
}
```

## 단일 게시글 조회하기

- 게시글 id로 단일 게시글을 조회합니다.

**URL**

```
GET http://localhost:3000/posts/:id
```

**Parameter**

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | :------: |
| id   | String | 콘텐츠 id   |    O     |

> Request: 실행 예시

```
curl -X GET "http://localhost:3000/posts/12" \
    -H "Authorization: Bearer {ACCESS_TOKEN}"
```

> Response

```
200 OK

{
  "id":12,
  "title":"cheese",
  "content":"donut",
  "created":"2021-10-25",
  "status":"OPEN"
}
```

```
404 Not Found

{
  "statusCode":404,
  "message":"게시글 ID \"12\"번이 존재하지 않습니다.",
  "error":"Not Found"
}
```

## 게시글 작성하기

**URL**

```
POST http://localhost:3000/posts
```

**Parameter**

| Name    | Type   | Description | Required |
| ------- | ------ | ----------- | :------: |
| title   | String | 게시글 제목 |    O     |
| content | String | 게시글 내용 |    O     |

> Request: 실행 예시

```
curl -X POST "http://localhost:3000/posts" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer {ACCESS_TOKEN}" \
    -d '{"title":"title", "content":"content"}'
```

> Response

```
200 OK

{
  "title":"title",
  "content":"content",
  "created":"2021-10-26",
  "status":"OPEN",
  "id":13
}
```

```
400 Bad Request
{
  "statusCode":400,
  "message":[
      "title must be a string",
      "title should not be empty",
      "content must be a string",
      "content should not be empty"
    ],
  "error":"Bad Request"
}
```

## 게시글 수정하기

- 게시글 id로 단일 게시글을 수정합니다.

**URL**

```
PATCH http://localhost:3000/posts/:id
```

**Parameter**

| Name    | Type   | Description | Required |
| ------- | ------ | ----------- | :------: |
| id      | String | 게시글 id   |    O     |
| title   | String | 게시글 제목 |    X     |
| content | String | 게시글 내용 |    X     |

> Request: 실행 예시

```
curl -X PATCH "http://localhost:3000/posts/13" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer {ACCESS_TOKEN}" \
    -d '{"title":"update!"}'
```

> Response

```
200 OK

{
  "title":"update!",
  "content":"content",
  "created":"2021-10-26",
  "status":"OPEN",
  "id":13
}
```

## 게시글 삭제하기

- 게시글 id로 단일 게시글을 삭제합니다.
- soft delete(논리 삭제): '게시글 상태 닫음'과 hard delete(물리 삭제): '게시글 완전 삭제'로 나뉩니다.

### 게시글 상태 닫기

- 게시글의 status 항목을 'OPEN'에서 'CLOSE'로 변경합니다.

**URL**

```
PATCH http://localhost:3000/posts/:id/close
```

**Parameter**

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | :------: |
| id   | String | 게시글 id   |    O     |

> Request: 실행 예시

```
curl -X PATCH "http://localhost:3000/posts/13/close" \
    -H "Authorization: Bearer {ACCESS_TOKEN}"
```

> Response

```
200 OK

{
  "id":13,
  "title":"update!",
  "content":"content",
  "created":"2021-10-26",
  "status":"CLOSE"
}
```

### 게시글 완전 삭제

- 게시글의 상태가 'CLOSE'인 글을 물리적으로 삭제합니다.

**URL**

```
DELETE http://localhost:3000/posts/:id
```

**Parameter**

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | :------: |
| id   | String | 게시글 id   |    O     |

> Request: 실행 예시

```
curl -X DELETE "http://localhost:3000/posts/13" \
    -H "Authorization: Bearer {ACCESS_TOKEN}"
```

> Response

```
200 OK

게시글 ID "${id}"번이 완전히 삭제되었습니다.
```

```
409 Conflict
{
  "statusCode":409,
  "message":"게시글 ID "${id}"번이 닫힌 상태가 아닙니다. 상태를 "CLOSE" 로 변경한 뒤 삭제해 주세요.",
  "error":"Conflict"
}
```
