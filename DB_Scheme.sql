CREATE DATABASE textra_db;
Use textra_db;

CREATE TABLE users (
PersonalID varchar(10) not null,
LastName varchar(255) not null,
FirstName varchar(255) not null,
School varchar(255) not null,
City varchar(255) not null,
UserType INT not null,
Email varchar(255) not null,
Pass varchar(255) not null,
primary key (PersonalID)
);

CREATE TABLE questions
(
Q_id bigint unsigned not null,
Q_qeustion varchar(500) not null,
isMultipuleAns boolean not null,
Q_mediaType int not null,
Q_media varchar(255) not null,
Q_correctFB varchar(500) not null,
Q_notCorrectFB varchar(500) not null,
Q_skill varchar(255) not null,
Q_difficulty varchar(255)not null,
Q_proffession varchar(255) not null,
Q_approved boolean not null,
Q_disabled boolean not null,
primary key (Q_id)
);

CREATE TABLE answers
(
A_id bigint unsigned not null,
Q_id bigint unsigned not null,
answer varchar(255) not null,
isCorrect boolean not null,
primary key (A_id)
);

CREATE TABLE Tasks
(
T_id bigint unsigned not null,
T_title varchar(100) not null,
T_description varchar(500) not null,
primary key (T_id)
);

CREATE TABLE groups
(
GroupId bigint unsigned not null,
GroupName varchar(100) not null,
teacherID varchar(10) not null,
IsMasterGroup boolean not null,
GroupeCode varchar(20),
primary key (GroupId),
foreign key (teacherID ) references users(PersonalID)
);

CREATE TABLE students_per_group
(
StudentId varchar(10) not null,
foreign key (StudentId) references users(PersonalID),
GroupId bigint unsigned not null,
foreign key (GroupId) references users(GroupId),
primary key (GroupId, StudentId)
);

CREATE TABLE mother_of_all_tables
(
instanceTime timestamp not null,
studentId bigint not null,
foreign key (StudentId) references users(PersonalID),
taskId bigint not null,
foreign key (taskId) references tasks(T_id),
Q_id bigint not null,
foreign key (Q_id) references questions(Q_id),
A_id bigint not null,
foreign key (A_id) references answers(A_id),
primary key (instanceTime)
);