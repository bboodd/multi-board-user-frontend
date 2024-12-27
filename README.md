# 게시판 프로젝트 - 프론트

게시판 프로젝트의 프론트 부분 입니다. 백엔드로 API 요청을 하고 데이터를 렌더링합니다.

<br>

---

## 📌 1. 사용 기술 스택

### Main
- HTML
- CSS
- JavaScript
- Vue.js
- Vercel

### Library
- Vuetify
- Pinia
- Axios
- vee-validate
- Lodash

---
## 📌 2. 프로젝트 주요 기능

회원가입
- vee-validate을 이용한 validation을 통해 사용자에게 적절한 정보를 입력하도록 유도
로그인, 로그아웃
- 로그인 성공시 localstorage, pinia에 jwt 저장 ➔ 새로고침해도 로그인 상태 유지
- 로그아웃시 저장되어있는 jwt 정보 삭제
게시물 CRUD
- 게시물 등록, 삭제, 수정 (로그인한 사용자만 가능)
- 게시물 수정의 경우 사용자가 이전에 작성한 게시물의 상태를 그대로 불러와서 보여줌
- 게시판 페이지에서 모든 사용자가 작성한 게시물을 확인할 수 있고 내 게시물에서만 수정/삭제 가능
- 게시판과 내 게시물 페이지는 모두 pagination 기능이 포함되어 있어서 렌더링 시간과 서버의 response 대기 시간을 줄임
댓글 기능
- 게시물 상세보기 페이지에서 댓글 등록 및 목록 보기
- 내가 쓴 댓글만 삭제 가능
---
## 3. 📌 화면

테스트 ID: admin

테스트 PW: admin

✔ 로그인/회원가입

![user 로그인:회원가입](https://github.com/user-attachments/assets/a5734895-832a-423b-a368-1767cadee512)



✔ 대시보드

![user 대시보드](https://github.com/user-attachments/assets/1b46c76d-b454-4fa0-a3ce-c2d63d564965)


✔ 게시판 메인

![user 메인](https://github.com/user-attachments/assets/10439bc3-7e45-4ef9-b8c7-afa64e3ff825)


✔ 게시글 상세보기(댓글)

![user 상세(댓글)](https://github.com/user-attachments/assets/7f43eb1a-3284-4ffd-852b-95ad635a66df)


✔ 게시글 등록/수정

![user 글등록:수정](https://github.com/user-attachments/assets/f73c0680-bbe5-4be9-a6ed-3868dd0b8a02)


---
## 돌아보며

- 맨날 백엔드 SSR만 해오다 처음 해보는 Vue.js 프로젝트 였고 좋은 경험이 된 것 같다.
- 다음에는 React, TypeScript를 사용해서 프로젝트를 진행해보고 싶다.

---
## BE 프로젝트
링크: https://github.com/bboodd/multi-board-backend