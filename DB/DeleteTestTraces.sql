DELETE FROM `textra_db`.`students_per_group` WHERE `StudentId`='12121211' and`GroupId`='123456';
DELETE FROM `textra_db`.`users` WHERE `PersonalID`='12121211';
DELETE FROM `textra_db`.`instances_of_answers` WHERE `A_id`='1' and`Q_id`='1' and`T_id`='1' and`studentId`='2';

DELETE FROM `textra_db`.`tasks_and_question_for_student_instances` WHERE `studentId`='12121211';
DELETE FROM `textra_db`.`tasks_and_question_for_student_instances` WHERE `studentId`='12121211';

DELETE FROM `textra_db`.`tasks_and_question_for_student_instances` WHERE `T_id`='3';


-- DELETE FROM `textra_db`.`tasks_and_question_for_student_instances` WHERE `Q_qeustion` = ;