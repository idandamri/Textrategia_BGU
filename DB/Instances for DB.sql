/*------------------ users -----------------*/
insert into users
values (1,"Damri","Idan","Techni","Beer Sheva",1,"idandamri@gmail.com","123456");

insert into users
values (2,"Krigel","Shaked","Mekif H","Ashdod",2,"‫shakedkr@post.bgu.ac.il‬‏","123456");

insert into users
values (3,"Ganim","Hadas","Mevuot","Ashdod",2,"hadasganim@gmail.com‬‏","123456");

insert into users
values (4,"Sturm","Arnon","BGU","Beer Sheva",1,"sturm@bgu.ac.il‬‏","123456");
/*------------------------------------------*/


/*-------------- questions -----------------*/
insert into questions
values(
1,"לפניך פרסומת - מה היא המטרה העיקרית של יוצרי הפרסומת?", false,1,"img/selfie.jpg",
"מצוין! זיהית שהמטרה בפרסומת היא לעודד רכישת מוצרים כחול לבן. הגיוני כשחושבים על כך שהיוצרים הם משרד הכלכלה,\"מיוצר בישראל\" והתאחדות התעשיינים בישראל...",
"אמנם התשובה שציינת היא מטרה של יוצרי הפרסומת אך זו אינה מטרתם המרכזית.  כדאי לשים לב מי הם היוצרים של הפרסומת...","זיהוי מטרה מרכזית",
"קלה","הבעה",true,false
);
/*------------------------------------------*/


/*-------------- answers -------------------*/
insert into answers
values(1,1,"לעודד אנשים לרכוש תוצרת כחול לבן",true);


insert into answers
values(2,1,"לשכנע אנשים להשתתף בתחרות סלפי כחול לבן",false);


insert into answers
values(3,1,"לגרום לאנשים להצטלם עם מוצרי כחול לבן",false);


insert into answers
values(4,1,"לגרום לאנשים להעלות תמונות סלפי לאתר התאחדות הסטודנטים",false);
/*------------------------------------------*/

/*-------------- tasks ---------------------*/
insert into tasks
values(1,"מטלת ניסוי","מטלת ניסוי לבסיס הנתונים");
/*------------------------------------------*/

/*--------------- groups -------------------*/
/*insert into groups
values(floor(rand()*10000),"טקסטרטגיה", 4, true,"0123");

insert into groups
values(floor(rand()*10000),"שיעור פרטי", 1, false,"0123456");*/

insert into groups
values(123456,"טקסטרטגיה", 4, true,"0123");

insert into groups
values(1234567,"שיעור פרטי", 1, false,"0123456");
/*------------------------------------------*/

/*----------- students_per_group -----------*/
insert into students_per_group
values(1,123456);

insert into students_per_group
values(2,123456);

insert into students_per_group
values(3,123456);

insert into students_per_group
values(4,1234567);

insert into students_per_group
values(2,1234567);
/*------------------------------------------*/

/*----------- mother_of_all_tables ---------*/
insert into mother_of_all_tables
values(CURRENT_TIMESTAMP,1,1,1,1);

insert into mother_of_all_tables
values(CURRENT_TIMESTAMP,2,1,1,3);

insert into mother_of_all_tables
values(CURRENT_TIMESTAMP,2,1,1,1);
/*------------------------------------------*/