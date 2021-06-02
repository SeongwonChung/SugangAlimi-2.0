## clone 받은 후 가상환경/Python packages setting

> 0. python version recommendation: 3.7.9

1. virtualenv \~/kingsugang (\~/kingsugang 위치에 가상환경을 생성, python version 지정 시 위 링크 참조)
2. source ~/kingsugang/Scripts/activate (mac은 source ~/kingsugang/bin/activate)
3. cd SugangProject (requirements.txt 있는 위치)
4. pip install -r requirements.txt

- 이후에 다시 작업시 가상환경 activate 위해 2. 실행

## project 모듈 설명

1. ./SugangProject: 장고 프로젝트 폴더
2. ./SugangProject/ClassStatus: 수강신청 사이트 로그인, 마감현황 가져오는 기능위한 app
   - ClassStatus/utils: 로그인, 마감현황 가져오기, 마감현황 가져오기(multiprocessing) 모듈
   - ClassStatus/models.py: Course(수업정보), Wish(즐찾)table 포함.
   - ClassStatus/views.py:
     - alarmCheck: 사용자 알람활성화 여부 check
     - wish: 즐겨찾기 추가/삭제
     - wishCheck: 즐겨찾기 활성화 여부 check
     - wishlist: 현재 로그인한 유저가 즐겨찾기한 모든 과목, 마감현황 조회
     - search: 과목검색 input 받아서 query결과 반환
     - status: 한 과목에 대한 마감현황 반환
3. ./SugangProject/User: 사용자 관련 처리기능 위한 app
   - User/utils:
     - email.py: 사용자에게 이메일 전송기능
   - User/models.py: Profile table 포함: 유저 정보, token, 알림활성화 여부
   - User/views.py:
     - signup: 회원가입 및 새로운 user생성
     - login: 로그인
     - logout: 로그아웃
     - activate: user 활성화
     - withdraw: user 삭제(회원탈퇴)
     - mypage: mypage에 필요한 정보 조회, 반환
   - User/my_settings.py: jwt secret key, algorithm 정보
4. ./SugangProject/MailNotify: 메일알림 관련 기능 담당 app
   - MailNotify/management: mailnotify 커스텀 커맨드 선언부
   - MailNotify/models.py: Registration table(과목마감현황)
   - MailNotify/utils: 메일알림 관련 모듈
     - check_registrations.py: 현재시각 수강신청 학년 확인, db와 마감현황 비교 및 update
     - course_info_for_test.py: 테스트 dummy object
     - login.py: 수신사이트 로그인 모듈
     - mailer.py: 사용자에게 메일 전송 모듈
     - parser.py: 크롤링한 마감현황 텍스트 data parsing
     - registrations.py: 과목의 마감현황 크롤링 모듈(mp)
     - time_to_mail.py: 메일전송 사용시간인지 check
     - utility.py: 메일알림 위한 핵심 모듈 모듬 - 과목 query, 알림대상과목 거르기, 크롤링, 사용자 정보 query, 메일전송.
     - while_auto.py: utility의 mailnotify를 while문으로 로컬에서 반복해서 돌려주는 모듈.
5. ./SugangProject/csv_to_db.py: 과목data db에 넣어주는 모듈
6. ./ebextensions: elasticbeanstalk 배포 설정파일
7. ./elasticbeanstalk: elasticbeanstalk 설정파일
