create table users
(
    id               bigint auto_increment comment '사용자 ID'
        primary key,
    email            varchar(128)                         not null comment '사용자 email',
    password         varchar(128)                         not null comment '사용자 Password',
    name             varchar(128)                         not null comment '사용자 이름',
    phone_num        varchar(128)                         not null comment '사용자 전화번호',
    type             varchar(32)                          not null comment '사용자 유형 [Admin, User]',
    enabled          char     default '1'                 not null comment '사용가능 여부 [Y|N]',
    created_datetime datetime default current_timestamp() not null comment '데이터 생성일시',
    updated_datetime datetime default current_timestamp() not null comment '데이터 변경일시',
    constraint uq_information
        unique (email, phone_num)
)
    comment '사용자 정보' collate = utf8mb4_unicode_ci;

create table rooms
(
    id               bigint auto_increment comment 'room ID'
        primary key,
    title            varchar(128)                             not null comment 'room title',
    publisher_id     bigint                                   not null comment 'room publisher',
    description      varchar(256)                             null comment 'room 상세정보',
    password         varchar(128)                             null comment 'room 비밀번호',
    maximum          bigint                                   not null comment 'room 최대 인원수',
    state            varchar(128) default 'wait'              not null comment 'room 상태 [wait, progress, complete, failed]',
    stream_url       varchar(128)                             null comment 'room stream_url',
    start_time       varchar(128)                             null comment 'room 시작 예정 시간',
    link             varchar(256)                             null comment 'room 참고 링크',
    created_datetime datetime     default current_timestamp() not null comment 'room 생성일시',
    updated_datetime datetime     default current_timestamp() not null comment 'room 변경일시',
    constraint stream_url
        unique (stream_url),
    constraint fk_rooms_publisher_id
        foreign key (publisher_id) references users (id)
)
    comment 'room 정보' collate = utf8mb4_unicode_ci;

create table room_histories
(
    id               bigint auto_increment comment 'room histories ID'
        primary key,
    room_id          bigint                                   not null comment 'room ID',
    state            varchar(128) default 'wait'              not null comment 'room 상태 [wait, progress, complete, failed]',
    created_datetime datetime     default current_timestamp() not null comment 'room 각 state 생성일시',
    constraint fk_room_histories_room_id
        foreign key (room_id) references rooms (id)
)
    comment 'room histories 정보' collate = utf8mb4_unicode_ci;

create table room_user_histories
(
    id               bigint auto_increment comment 'room histories ID'
        primary key,
    room_id          bigint                                   not null comment 'room ID',
    player_id        bigint                                   not null comment '사용자 ID',
    state            varchar(128) default 'wait'              not null comment 'room 상태 [wait, progress, complete, failed]',
    created_datetime datetime     default current_timestamp() not null comment 'room 참여자 각 state 생성일시',
    constraint fk_room_user_histories_player_id
        foreign key (player_id) references users (id),
    constraint fk_room_user_histories_room_id
        foreign key (room_id) references rooms (id)
)
    comment 'room 사용자 histories 정보' collate = utf8mb4_unicode_ci;

create table room_users
(
    id               bigint auto_increment comment 'room 참여자 ID'
        primary key,
    room_id          bigint                                   not null comment 'room ID',
    publisher_id     bigint                                   not null comment 'room 생성자 ID',
    player_id        bigint                                   not null comment 'room 참여자 ID',
    state            varchar(128) default 'wait'              not null comment 'user 상태 [wait, progress, complete, failed]',
    created_datetime datetime     default current_timestamp() not null comment 'room 참여자 생성일시',
    updated_datetime datetime     default current_timestamp() not null comment 'room 참여자 변경일시',
    constraint fk_room_users_player_id
        foreign key (player_id) references users (id),
    constraint fk_room_users_publisher_id
        foreign key (publisher_id) references rooms (publisher_id),
    constraint fk_room_users_room_id
        foreign key (room_id) references rooms (id)
)
    comment 'room 참여자 정보' collate = utf8mb4_unicode_ci;

