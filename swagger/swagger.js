module.exports = {
  openapi: "3.0.1",
  info: {
    version: "0.0.1",
    title: "이력서 과제 swagger.",
    description: "example API",

    contact: {
      name: "",
      email: "",
      url: "",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "http://localhost:3018/",
      description: "Local server",
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  tags: [
    {
      name: "사용자",
    },
    {
      name: "이력서 게시",
    },
  ],
  paths: {
    "/users/sign-up": {
      post: {
        tags: ["사용자"],
        summary: "회원가입",
        description:
          "이메일, 비밀번호, 비밀번호 확인, 이름을 데이터로 넘겨서 회원가입을 요청합니다.",
        requestBody: {
          description: "요청",
          content: {
            "application/json": {
              example: {
                name: "이진동",
                email: "nada@abc.com",
                password: "123456",
                passwordConfirm: "123456",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "회원가입 완료",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          401: {
            description: "최소 6자 이상이며, 비밀번호 확인과 일치해야 합니다.",
            content: {
              "application/json": {
                example: {
                  message:
                    "최소 6자 이상이며, 비밀번호 확인과 일치해야 합니다.",
                },
              },
            },
          },
          409: {
            description: "이미 중복된 이메일이 존재합니다.",
            content: {
              "application/json": {
                example: {
                  message: "이미 중복된 이메일이 존재합니다.",
                },
              },
            },
          },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["사용자"],
        summary: "로그인",
        description: "이메일, 비밀번호로 로그인을 요청합니다.",
        requestBody: {
          description: "요청",
          content: {
            "application/json": {
              example: {
                email: "nada@abc.com",
                password: "123456",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "로그인 성공",
            content: {
              "application/json": {
                example: {
                  message: "로그인에 성공하셨습니다.",
                },
              },
            },
          },
          400: {
            description: "존재하지 않는 이메일 이거나 비밀번호가 일치하지 않음",
            content: {
              "application/json": {
                examples: {
                  example1: {
                    value: {
                      message: "존재하지 않는 이메일 입니다.",
                    },
                  },
                  example2: {
                    value: {
                      message: "비밀번호가 일치하지 않습니다.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/userInfo": {
      get: {
        tags: ["사용자"],
        summary: "사용자 정보 조회",
        description: "비밀번호를 제외한 내 정보 조회",
        parameters: [
          {
            name: "Authorization",
            in: "cookie",
            description: "서버에서 발급한 엑세스토큰",
            required: true,
            schema: {
              type: "string",
              format: "varchar(256)",
            },
          },
        ],
        responses: {
          201: {
            description: "유저정보 조회",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          404: {
            description: "유저정보가 존재하지 않습니다.",
            content: {
              "application/json": {
                example: {
                  message: "유저정보가 존재하지 않습니다.",
                },
              },
            },
          },
        },
      },
    },
    "/resumes/posts": {
      post: {
        tags: ["이력서 게시"],
        summary: "이력서 게시",
        description: " 이력서 제목, 자기소개 데이터로 생성, 로그인 필요",
        requestBody: {
          description: "요청",
          content: {
            "application/json": {
              example: {
                title: "뽑아라",
                content: "나를",
              },
            },
          },
        },
        responses: {
          201: {
            description: "이력서가 작성되었습니다.",
            content: {
              "application/json": {
                example: {
                  message: "이력서가 작성되었습니다.",
                },
              },
            },
          },
        },
      },

      get: {
        tags: ["이력서 게시"],
        summary: "이력서 조회",
        description: " 이력서 제목, 자기소개 데이터로 생성, 로그인 필요",
        parameters: [
          {
            name: "orderKey",
            in: "query",
            description: "정렬 기준 필드",
            required: false,
            schema: {
              type: "string",
              default: "createdAt",
              enum: ["createdAt", "userId"],
            },
          },
          {
            name: "orderValue",
            in: "query",
            description: "정렬 방식 (asc 또는 desc)",
            required: false,
            schema: {
              type: "string",
              default: "desc",
              enum: ["asc", "desc"],
            },
          },
        ],
        responses: {
          200: {
            description: "성공적으로 이력서 목록을 가져옴",
            content: {
              "application/json": {
                example: {
                  data: {
                    resumeId: "43354d8f-19b4-4e1f-84d4-9420c4a2d22e",
                    title: "제목이",
                    content: "날 뽑지 말아주세요.",
                    status: "APPLY",
                    user: {
                      name: "이진동2",
                    },
                    createdAt: "2024-02-01T07:36:23.554Z",
                    updatedAt: "2024-02-01T14:12:24.599Z",
                  },
                },
              },
            },
          },
          400: {
            description: "이력서 Id는 필수값입니다.",
            content: {
              "application/json": {
                example: {
                  message: "이력서 Id는 필수값입니다.",
                },
              },
            },
          },
          404: {
            description: "이력서 정보가 존재하지 않습니다.",
            content: {
              "application/json": {
                example: {
                  message: "이력서 정보가 존재하지 않습니다.",
                },
              },
            },
          },
        },
      },
    },
    "/resumes/posts/{resumeId}": {
      get: {
        tags: ["이력서 게시"],
        summary: "이력서 상세 정보 조회",
        description: "이력서 상세 정보를 조회합니다.",
        parameters: [
          {
            name: "resumeId",
            in: "path",
            description: "이력서 ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "성공적으로 이력서 정보를 가져옴",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Resume",
                },
                example: {
                  data: {
                    resumeId: "43354d8f-19b4-4e1f-84d4-9420c4a2d22e",
                    title: "제목이",
                    content: "날 뽑지 말아주세요.",
                    status: "APPLY",
                    user: {
                      name: "이진동2",
                    },
                    createdAt: "2024-02-01T07:36:23.554Z",
                    updatedAt: "2024-02-01T14:12:24.599Z",
                  },
                },
              },
            },
          },
          404: {
            description: "이력서를 찾을 수 없음",
            content: {
              "application/json": {
                example: {
                  message: "이력서를 찾을 수 없습니다.",
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["이력서 게시"],
        summary: "이력서 수정",
        description: "이력서를 수정합니다.",
        parameters: [
          {
            name: "resumeId",
            in: "path",
            description: "이력서 ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                title: "제목을",
                content: "수정하겠습니다.",
              },
            },
          },
        },
        responses: {
          201: {
            description: "이력서 수정 성공",
            content: {
              "application/json": {
                example: {
                  message: "이력서를 수정했습니다.",
                },
              },
            },
          },
          404: {
            description: "이력서 조회 실패",
            content: {
              "application/json": {
                example: {
                  message: "이력서 조회에 실패하였습니다.",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["이력서 게시"],
        summary: "이력서 삭제",
        description: "이력서를 삭제합니다.",
        parameters: [
          {
            name: "resumeId",
            in: "path",
            description: "이력서 ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          201: {
            description: "이력서 삭제 성공",
            content: {
              "application/json": {
                example: {
                  message: "이력서를 삭제했습니다.",
                },
              },
            },
          },
          404: {
            description: "이력서 조회 실패",
            content: {
              "application/json": {
                example: {
                  message: "이력서 조회에 실패하였습니다.",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Users: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "유저 고유 아이디",
            example: "a8d7dd87-5d07-418b-b929-fd68a3fe75fe",
          },
          name: {
            type: "string",
            description: "사용자 이름",
            example: "이진동",
          },
          email: {
            type: "string",
            description: "이메일",
            example: "nada@abc.com",
          },
          createdAt: {
            type: "datetime",
            description: "생성 날짜",
            example: "2024-02-01T12:09:18.072Z",
          },
          updatedAt: {
            type: "datetime",
            description: "수정 날짜",
            example: "2024-02-01T12:09:18.072Z",
          },
        },
      },
      Resume: {
        type: "object",
        properties: {
          resumeId: {
            type: "string",
            description: "이력서 ID",
            example: "43354d8f-19b4-4e1f-84d4-9420c4a2d22e",
          },
          userId: {
            $ref: "#/components/schemas/Users/properties/userId",
          },
          title: {
            type: "string",
            description: "이력서 제목",
            example: "이 회사의 지원하는 3가지 이유",
          },
          content: {
            type: "string",
            description: "이력서 내용",
            example: "...",
          },
          status: {
            type: "enum[APPLY, DROP, PASS, INTERVEW1, INTERVIEW2, FINAL_PASS",
            description: "이력서 상태",
            default: "APPLY",
          },
          createdAt: {
            type: "datetime",
            description: "작성 날짜",
            example: "2024-02-01T12:09:18.072Z",
          },
          updatedAt: {
            type: "datetime",
            description: "수정 날짜",
            example: "2024-02-01T12:09:18.072Z",
          },
        },
      },
    },
  },
};
