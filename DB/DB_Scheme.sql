create database textra_db;
use textra_db;

create table users (
PersonalID varchar(10) not null,
LastName varchar(255) not null,
FirstName varchar(255) not null,
UserType int not null,
Email varchar(255) not null,
Pass varchar(255) not null,
primary key (PersonalID)
);

create table questions
(
Q_id bigint unsigned not null auto_increment,
Q_qeustion varchar(500) not null,
isMultipuleAns boolean not null,
Q_mediaType varchar(25) not null,
Q_media varchar(10000) not null,
Q_correctFB varchar(500) not null,
Q_notCorrectFB varchar(500) not null,
Q_skill varchar(255) not null,
Q_difficulty varchar(255)not null,
Q_proffession varchar(255) not null,
Q_approved boolean not null,
Q_disabled boolean not null,
Q_owner varchar(10) not null,
primary key (Q_id)
);

create table answers
(
A_id bigint unsigned not null auto_increment,
Q_id bigint unsigned not null,
answer varchar(255) not null,
isCorrect boolean not null,
primary key (A_id, Q_id)
);

create table tasks
(
T_id bigint unsigned not null auto_increment,
T_title varchar(100) not null,
T_description varchar(500) not null,
T_owner varchar(10) not null,
T_approved boolean not null,
foreign key (T_owner) references users(PersonalID),
primary key (T_id)
);

create table tasks_joined_with_questions(
T_id bigint unsigned not null,
Q_id bigint unsigned not null,
foreign key (T_id) references tasks(T_id),
foreign key (Q_id) references questions(Q_id),
primary key (T_id, Q_id)
);

create table cities_and_schools(
School varchar(255) not null,
City varchar(255) not null,
primary key (School, City)
);

create table groups(
GroupId bigint unsigned not null auto_increment,
GroupName varchar(100) not null,
School varchar(255) not null,
City varchar(255) not null,
teacherID varchar(10) not null,
isTeacherGroup boolean not null,
IsMasterGroup boolean not null,
GroupeCode varchar(20),
GroupUserType int not null,/* user types- student = 0 ; teacher = 1 ; superUser = 2 */
isApproved boolean not null,
/*foreign key (teacherID) references users(PersonalID),*/
primary key (GroupId)
);

create table students_per_group
(
StudentId varchar(10) not null,
GroupId bigint unsigned not null,
foreign key (StudentId) references users(PersonalID),
foreign key (GroupId) references groups(GroupId),
primary key (StudentId, GroupId)
);

create table instances_of_answers
(
instanceTime timestamp not null,
studentId varchar(10) not null,
T_id bigint unsigned not null,
Q_id bigint unsigned not null,
A_id bigint unsigned not null,
foreign key (T_id) references tasks(T_id),
foreign key (studentId) references users(PersonalID),
foreign key (Q_id) references questions(Q_id),
foreign key (A_id) references answers(A_id),
primary key (A_id,Q_id,T_id,studentId)
);

create table tasks_and_question_for_student_instances
(
studentId varchar(10) not null,
T_id bigint unsigned not null,
Q_id bigint unsigned not null,
foreign key (T_id) references tasks(T_id),
foreign key (studentId) references users(PersonalID),
foreign key (Q_id) references questions(Q_id),
primary key (Q_id,T_id,studentId)
);