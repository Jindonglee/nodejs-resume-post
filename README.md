erd 주소 =  https://www.erdcloud.com/d/L6dnXXyFe74sYug84

api 명세서 = https://occipital-shad-472.notion.site/7f566a207767400ba994506e60a16940?v=f4e37468b16d413caaf078794bcfc82c

1. **암호화 방식**
    - 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
      -> 단방향이란 암호화만 가능한 것이고 양방향 암호화란 복호화도 가능한 것을 의미한다.
         따라서 Hash는 양방향 암호화다.
      
    - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
       -> 개인정보 노출의 위험성을 줄일 수 있다.

2. **인증 방식**
    - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
      -> 엑세스 토큰은 사용자의 인증정보가 모두 들어있기 때문에 개인정보 유출의 위험성이 있다.
      
    - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
      -> 엑세스 토큰의 유효시간을 줄여 위험성을 낮춘다.
3. **인증과 인가**
    - 인증과 인가가 무엇인지 각각 설명해 주세요.
      -> 인증은 사용자가 인증된 신분이 있는지 검증하는 것이고 인가는 리소스에 접근할 수 있는 권한의 유무를 검증하는 것이다.
      
    - 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.
      -> 인증 기능이다. 엑세스토큰이 유효한지 아닌지만 구분하기 때문이다. 인가는 메소드를 쓸 때 엑세스토큰의 정보가 요청대상의 일부 정보와 일치했을 때 접근이 가능하도록 구현한 것같다.
4. **Http Status Code**
    - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
      200 : 리소스에 정상적으로 접근했을 때
      201 : 데이터를 생성하는 데 성공했을 때
      400 : 잘못된 요청일때
      401 : 인증 정보가 없을 때
      404 : 리소스를 찾을 수 없을 때
      500: 서버에서 에러가 났을 때
5. **리팩토링**
    - MySQL, Prisma로 개발했는데 MySQL을 MongoDB로 혹은 Prisma 를 TypeORM 로 변경하게 된다면 많은 코드 변경이 필요할까요? 주로 어떤 코드에서 변경이 필요한가요?
      -> prisma.schema에서 간단한 변경으로 다른 db와 호환할 수 있다고는 하는데 아직 안해봐서 모르겠다.
      
    - 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.
      -> 코드 작성은 늘 어렵다.
6. **API 명세서**
    - notion 혹은 엑셀에 작성하여 전달하는 것 보다 [swagger](https://swagger.io/) 를 통해 전달하면 장점은 무엇일까요?
      -> 보기 편하고, 잘 작성하면 이해하기 쉬울 것 같다.
