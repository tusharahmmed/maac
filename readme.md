# MAAC Blog

### Technology Stack:

- Used TypeScript as the programming language.
- Used Express.js as the web framework.
- Used prisma as the Object Relational Mapping (ORM) and DBMS for postgresql .
- Used Zod as for the schema validation
- Used JSON Web Token for authentication & authorization

### Live Link | Base Url: https://maac.vercel.app//

### Download Postman Collection : https://shorturl.at/G0S97

### Application Routes:

## API Routes

### AUTH:

- api/v1/auth/signin (POST)
  Request body:

```json
{
  "email": "example@gmail.com",
  "password": "password@@"
}
```

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User signin successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkYWE3YjFhLTcxYjMtNDhjNi04MzE4LTNkZjc4NjQ2YmFmZiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTcwNTY2MzkzMSwiZXhwIjoxNzA1NzUwMzMxfQ.CMFYLiFuH39Ff_QeNCGhCGZ8xfrBhi3YS3ZpXAEP2S4"
  }
}
```

- api/v1/auth/signup (POST)

```json
{
  "name": "naem",
  "email": "name@gmail.com",
  "password": "passwod"
}
```

Response Sample Pattern:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGUzMzMwM2FhNDI1OTZlODVlZTk5NjIiLCJlbWFpbCI6InR1c2hhcmVlQGdtYWlsLmNvbSIsImlhdCI6MTY5MjYxMTMzMSwiZXhwIjoxNjkyNjk3NzMxfQ.SgbnKgJygB4x6-r_sc6br506a27FQSPY6br6XAXheaM",

}
```

- api/v1/auth/refresh-token (POST)

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Successfully generate refresh token",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkYWE3YjFhLTcxYjMtNDhjNi04MzE4LTNkZjc4NjQ2YmFmZiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTcwNTY2NDAyNSwiZXhwIjoxNzA1NzUwNDI1fQ.SjzcK5HTHq0MTDTV7pbs-EVTbXkrB3Z7xeIJkd4mWio"
  }
}
```

### TAG:

- api/v1/tags//create-new (POST)

Request body:

```json
{
  "name": "Tag 1",
  "description": "Tag Des 1"
}
```

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "tag created successfully",
  "data": {
    "id": "d0d65f7c-be12-439b-a025-044dbf745e8d",
    "name": "Tag 1",
    "description": "Tag Des 1",
    "createdAt": "2024-11-05T13:47:28.708Z",
    "updatedAt": "2024-11-05T13:47:28.708Z"
  }
}
```

- api/v1/tags (GET)
- api/v1/tags/:id (Single GET)
- api/v1/tags/:id (PATCH)
- api/v1/tags/:id (DELETE)

##### Sample Data: (tag)

```json
{
  "id": "d0d65f7c-be12-439b-a025-044dbf745e8d",
  "name": "Tag 1",
  "description": "Tag Des 1",
  "createdAt": "2024-11-05T13:47:28.708Z",
  "updatedAt": "2024-11-05T13:47:28.708Z"
}
```

#### Pagination and Filtering routes of tags

- api/v1/tags?pag=1&limit=10
- api/v1/tags?sortBy=createdAt&sortOrder=asc
- api/v1/tags?searchTerm=Cha #which will applly for email and name filed

### BLOG:

- api/v1/blogs/create-new (POST)

Request body:

```json
{
  "name": "Blog post 1",
  "description": "post 1 description",
  "tags": [
    "5869b5d1-60c7-4b7b-96c6-0283c9a6a8cb",
    "d0d65f7c-be12-439b-a025-044dbf745e8d"
  ]
}
```

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "7cfedaee-2de1-4451-98a5-f0db45e9e8fc",
    "name": "Blog post 4",
    "description": "post 1 description",
    "slug": "blog-post-4",
    "status": true,
    "author_id": "b132d7ee-70b3-4eba-84bd-f58da8c6213c",
    "createdAt": "2024-11-06T06:02:31.693Z",
    "updatedAt": "2024-11-06T06:02:31.693Z",
    "tags": [
      {
        "tag": {
          "id": "5869b5d1-60c7-4b7b-96c6-0283c9a6a8cb",
          "name": "Tag 2"
        }
      },
      {
        "tag": {
          "id": "d0d65f7c-be12-439b-a025-044dbf745e8d",
          "name": "Tag 1"
        }
      }
    ]
  }
}
```

- api/v1/blogs (GET)

#### Pagination and Filtering routes of blog

- api/v1/blogs?pag=1&limit=10
- api/v1/blogs?sortBy=createdAt&sortOrder=asc
- api/v1/blogs?searchTerm=Cha #which will applly for email and name filed

- api/v1/blogs/:id (Single GET)
- api/v1/blogs/:id (PATCH)
  Request body:

```json
{
  "name": "Blog post 2 update",
  "description": "post 2 description update",
  "tags": ["new_tag_id", "new_tag_id"]
}
```

- api/v1/blogs/:id (DELETE)

### COMMENT:

- api/v1/comments/create-new (POST)

Request body:

```json
{
  "message": "comment message",
  "blog_id": "c3c62b06-850a-4fc0-ac1a-22c3a6e0c507"
}
```

Response Sample Pattern:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": "85d9f05e-e7c0-4db0-b972-9d4693cf4a7d",
    "message": "Second comment",
    "blog_id": "c3c62b06-850a-4fc0-ac1a-22c3a6e0c507",
    "user_id": "9dc1e042-ce3e-458f-b5cd-116f99ffb4c0",
    "createdAt": "2024-11-06T06:10:34.344Z",
    "updatedAt": "2024-11-06T06:10:34.344Z"
  }
}
```

- api/v1/comments/blog/:blog_id (GET)

- api/v1/comments/:id (PATCH)
  Request body:

```json
{
  "name": "Blog post 2 update",
  "description": "post 2 description update",
  "tags": ["new_tag_id", "new_tag_id"]
}
```

- api/v1/comments/:id (DELETE)

#### Pagination routes of comment

- api/v1/comments/blog/:blog_id?pag=1&limit=10
- api/v1/comments/blog/:blog_id?sortBy=createdAt&sortOrder=asc

> [!NOTE]  
> You need to hit all the POST and PATCH routes with an authorization token

Request header:

```json
{
  "authorization": "accessToken"
}
```
