drop database textra_db;

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
Q_reported_Offensive int not null,
Q_reported_Question int not null,
Q_reported_Answer int not null,
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
Second_Chance boolean not null,
foreign key (T_id) references tasks(T_id),
foreign key (studentId) references users(PersonalID),
foreign key (Q_id) references questions(Q_id),
foreign key (A_id) references answers(A_id),
primary key (instanceTime, A_id,Q_id,T_id,studentId,Second_Chance)
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

INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('האזן לשיחה המוקלטת. לשם מה החליטו במפעל הפיס להקליט שיחות של אנשים עם אראלה?', '0','page','http://rr-d.vidnt.com/vod/aod/pas/240/26?path=&files[]=9-3-16.mp3&autoplay=true','שיחה כזאת מעבר להזדהות וההתרגשות אכן גורמת לאנשים לחוש שזכייה היא דבר אפשרי.','נסו לחשוב אם יש מטרה אחת בולטת שהאחרות עשויות לשרת אותה.','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('לפניך סרטון קצר. צפה בו וענה על השאלה - מהי מטרתו המרכזית של יוצר הסרטון? ', '0','youtube','crs0TiiYE4I',' הצלחת לזהות שמדובר בטקסט פרסומי שמטרתו להניע את הצופים לרכוש ממוצרי RC קולה. פרטי משרד הפרסום שהופיעו בראשית הסרטון מסייעים להבנה שמדובר בפרסומת, ומכאן צריך רק לבדוק מה מנסים למכור לנו...','הסרטון הציג אמנם את תשובתך אך לא זו הייתה מטרתו המרכזית. כדאי לחשוב: מי יצר את הסרטון? מהי הכותרת שלו? מה עשויה להיות מטרתו אם כך?','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('לפניך סרטון קצר. צפה בו. מה הקשר בין הפרסומת לבין המוצר שאותו היא מנסה למכור? ', '0','youtube','rR3BlwTOvMQ','יופי של תשובה! איתרת נכון את המסר הסמוי הקיים בפרסומת - הקישור בין סיסמת הפרסום לפרסומת עצמה.','לא ממש. אמנם תינוקות הם חמודים והסרטון משעשע אבל כשמפרסם בוחר בתוכן מסוים - יש לכך קשר למטרתו. כדאי לחשוב מה מפרסמים כאן ומה המסר המועבר.','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('לפניך פרסומת - מה היא המטרה העיקרית של יוצרי הפרסומת?', '0','img','img/selfie.jpg','מצוין! זיהית שהמטרה בפרסומת היא לעודד רכישת מוצרים כחול לבן. הגיוני כשחושבים על כך שהיוצרים הם משרד הכלכלה,"מיוצר בישראל" והתאחדות התעשיינים בישראל...','אמנם התשובה שציינת היא מטרה של יוצרי הפרסומת אך זו אינה מטרתם המרכזית.  כדאי לשים לב מי הם היוצרים של הפרסומת...','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('לפניך קטע קצר הלקוח מאתר מפעל הפיס, קרא אותו ונסה לחשוב מדוע מופיע קטע כזה באתר מפעל הפיס?', '0','img','img/win.jpg','מפעל הפיס מנסה להבהיר שסיכויי הזכייה אינם גבוהים כדי להימנע מטענות עתידיות. ','מפעל הפיס הוא שפרסם את הדברים באתר, ולכן מן הסתם הם נועדו לשרת מטרה שלו. מה יכולה להיות מטרה זו?','זיהוי מטרה מרכזית','בינונית','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('לפניך כרזה שהתפרסמה בנקודות המכירה של מפעל הפיס. מה מטרתה?', '0','img','img/good.jpg','אכן. אם לא הרווחת - לפחות תדע שהפסדת כסף למטרות טובות.','מפעל הפיס אמנם תורם ומעורב אך מהי מטרתו באמירות אלו?','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('מהי מטרתו המרכזית של כותב הקטע? ', '0','img','img/crime.jpg','הכותב אכן פונה אל המדינה ודורש ממנה להפעיל צעדים חוקיים כדי להילחם בארגוני הפשיעה. ','כותב הקטע אכן מתייחס לתשובה שציינת, אך לא זו מטרת הטקסט שלו.  מומלץ לבחון שוב למי פונה הכותב בדבריו. ','זיהוי מטרה מרכזית','בינונית','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('לשם מה הביא הכותב ציטוטים אלה?', '0','text','לפניך קטע מתוך מאמר העוסק בוויקיפדיה שכותרתו "ערכים עם ערך מפוקפק": 
עורכי ויקיפדיה מצהירים בעצמם שהמידע המובא בה אינו בהכרח נכון: "דע שמידע המובא בוויקיפדיה עלול להיות לא מדויק, מטעה, מסוכן או בלתי חוקי", וכן "חובה לבדוק ולאמת כל פרט מידע המובא דיה".','הכותרת מעידה על כוונתו של הכותב - הוא מפקפק בוויקיפדיה, והציטוטים מופיעים כדי לשרת את מטרתו.','נסה לחשוב על הקשר בין הכותרת לבין מטרתו של הכותב.','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('מה מטרת ההודעה?', '0','text','הודעה בסופרמרקט
אזהרה: אלרגיה לבוטנים עוגיות קרם לימון
תאריך האזהרה: 4 בפברואר
שם היצרן: מזון מובחר בע"מ
מידע על המוצר: עוגיות קרם לימון 125ג\' (לשימוש עד ה-18 ביולי ולשימוש עד ה-1 ביולי)
פרטים: חלק מהעוגיות בקבוצות הייצור האלה עשויות להכיל חתיכות של בוטנים, שאינם מופיעים ברשימת המרכיבים. על אנשים הסובלים מאלרגיה לבוטנים להימנע מלאכול את העוגיות האלה. 
הנחיה לצרכן: אם קנית את העוגיות האלה תוכל להחזיר את המוצר לנקודת המכירה ולקבל תמורתו החזר כספי מלא. או להתקשר למספר 1-800-034-241 לקבלת מידע נוסף.','המילה אזהרה מופיעה במפורש בתוכן ההודעה. לשם כך היא נוצרה.','אמנם מדובר בהודעה לצרכן המתפרסמת בסופרמרקט אך זו אינה פרסומת או הסבר כללי. נסו להיעזר בתוכן ההודעה כדי להבין את מטרתה.','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('מהי מטרת הסעיף פרטים?', '0','text','הודעה בסופרמרקט
אזהרה: אלרגיה לבוטנים עוגיות קרם לימון
תאריך האזהרה: 4 בפברואר
שם היצרן: מזון מובחר בע"מ
מידע על המוצר: עוגיות קרם לימון 125ג\' (לשימוש עד ה-18 ביולי ולשימוש עד ה-1 ביולי)
פרטים: חלק מהעוגיות בקבוצות הייצור האלה עשויות להכיל חתיכות של בוטנים, שאינם מופיעים ברשימת המרכיבים. על אנשים הסובלים מאלרגיה לבוטנים להימנע מלאכול את העוגיות האלה. 
הנחיה לצרכן: אם קנית את העוגיות האלה תוכל להחזיר את המוצר לנקודת המכירה ולקבל תמורתו החזר כספי מלא. או להתקשר למספר 1-800-034-241 לקבלת מידע נוסף.','הפרטים נועדו לפרט את הנאמר לפמי כן - במקרה שלנו תוכן האזהרה, ולכן הם נותנים מידע על הרכיבים הבעייתיים בעוגיות.','פרטים נועדו לפרט את הנאמר קדום להם. נסו לחזור אחורה ולאתר את מה מפרטים הפרטים. ','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('מדוע ההודעה כוללת את המילים "לשימוש עד"?', '0','text','הודעה בסופרמרקט
אזהרה: אלרגיה לבוטנים עוגיות קרם לימון
תאריך האזהרה: 4 בפברואר
שם היצרן: מזון מובחר בע"מ
מידע על המוצר: עוגיות קרם לימון 125ג\' (לשימוש עד ה-18 ביולי ולשימוש עד ה-1 ביולי)
פרטים: חלק מהעוגיות בקבוצות הייצור האלה עשויות להכיל חתיכות של בוטנים, שאינם מופיעים ברשימת המרכיבים. על אנשים הסובלים מאלרגיה לבוטנים להימנע מלאכול את העוגיות האלה. 
הנחיה לצרכן: אם קנית את העוגיות האלה תוכל להחזיר את המוצר לנקודת המכירה ולקבל תמורתו החזר כספי מלא. או להתקשר למספר 1-800-034-241 לקבלת מידע נוסף.','על המדף בסופר קיימות מן הסתם לא מעט עוגיות, ולכן יש חשיבות לזיהוי הנכון כדי שהצרכן יוכל להיזהר - זו הרי מטרת ההודעה.','לפרט שציינת יש חשיבות אך לא בהקשר של ההודעה הזאת.נסה להיעזרבמטרת ההודעה כדי לחשוב מהי חשיבות התאריך שצוין. ','זיהוי מטרה מרכזית','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`,  `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`, `Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('משהו קרה לאדם שבסיפור בלילה הקודם. מה קרה?', '0','text','האופנוע
האם אי פעם התעוררת בתחושה שמשהו לא בסדר?
זה היה מין יום כזה בשבילי.
התיישבתי במיטה.
מעט אחר כך הזזתי את הווילונות.
היה מזג אוויר נורא – ירד גשם שוטף.
ואז הבטתי למטה לחצר.
כן! שם הוא עמד – האופנוע.
הוא היה הרוס בדיוק כפי שהיה אתמול בלילה.
והרגל שלי התחילה לכאוב.','אם נתבונן ברמזים בטקסט - תחושה של משהו לא בסדר, האופנוע ההרוס, הרגל הכואבת - ונחבר הכל יחד נגיע לכך שאכן האדם עבר תאונת אופנוע.','קרא בתשומת לב את הסיפור הקצר ונסה להבחין אילו רמזים נשתלים בתוכו.','הסקת מסקנות','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('"זה היה מין יום כזה בשבילי." - איזה מין יום זה היה?', '0','text','האופנוע
האם אי פעם התעוררת בתחושה שמשהו לא בסדר?
זה היה מין יום כזה בשבילי.
התיישבתי במיטה.
מעט אחר כך הזזתי את הווילונות.
היה מזג אוויר נורא – ירד גשם שוטף.
ואז הבטתי למטה לחצר.
כן! שם הוא עמד – האופנוע.
הוא היה הרוס בדיוק כפי שהיה אתמול בלילה.
והרגל שלי התחילה לכאוב.','אוצר המילים המשמש את הכותב מצביע על האפיון - לא בסדר, נורא, הרוס, לכאוב - כל אלה מצביעים על יום רע. ','נסו להתבונן באוצר המילים המשמש את הכותב לתיאור היום ותחושותיו כדי להבין איזה מין יום זה היה בשבילו. ','הסקת מסקנות','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`, `Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('מדוע המחבר מתחיל את הסיפור בשאלה?', '0','text','האופנוע
האם אי פעם התעוררת בתחושה שמשהו לא בסדר?
זה היה מין יום כזה בשבילי.
התיישבתי במיטה.
מעט אחר כך הזזתי את הווילונות.
היה מזג אוויר נורא – ירד גשם שוטף.
ואז הבטתי למטה לחצר.
כן! שם הוא עמד – האופנוע.
הוא היה הרוס בדיוק כפי שהיה אתמול בלילה.
והרגל שלי התחילה לכאוב.','שאלה המופנית לקוראים יוצרת עניין ורצון להמשיך ולקרוא הלאה.','המטרה של הכותב קשורה למתרחש אצל הקורא. מה קורה לקורא שנתקל בשאלה בתחילת טקסט? איך הדבר משפיע עליו?','הסקת מסקנות','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('בשורה 7 כתוב: "כן!" - מדוע האדם שבסיפור אומר זאת?', '0','text','האופנוע
האם אי פעם התעוררת בתחושה שמשהו לא בסדר?
זה היה מין יום כזה בשבילי.
התיישבתי במיטה.
מעט אחר כך הזזתי את הווילונות.
היה מזג אוויר נורא – ירד גשם שוטף.
ואז הבטתי למטה לחצר.
כן! שם הוא עמד – האופנוע.
הוא היה הרוס בדיוק כפי שהיה אתמול בלילה.
והרגל שלי התחילה לכאוב.','"כן!" היא תשובה לשאלה המופיעה בראש הטקסט. ','חזרו שוב אל השאלה בראש הטקסט, ונסו להיעזר בה כדי להבין מדוע האדם אומר "כן!".','הסקת מסקנות','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('במה עוסק המאמר?', '0','text','צחצוח שיניים
האם השיניים שלנו נעשות נקיות יותר ויותר ככל שאנחנו מצחצחים אותן חזק יותר ובמשך זמן רב יותר?
חוקרים בריטיים טוענים שלא. הם אפילו ניסו אפשרויות רבות ושנות ולבסוף מצאו את הדרך המושלמת לצחצוח השיניים. צחצוח של שתי דקות, בלי לצחצח חזק מדי, מביא לתוצאה הטובה ביותר. אם מצחצחים חזק, הורסים את ציפוי השן ואת החניכיים בלי להסיר שאריות אוכל או רובד פלאק.  
בנטה הנסן, מומחית לצחצוח שיניים, אומרת שזה רעיון טוב להחזיק את מברשת השיניים בצורה שבה אוחזים בעט. "התחילו בפינה אחת וצחצחו לאורך כל השורה", היא אומרת, "אל תשכחו את הלשון! היא יכולה להכיל המון חיידקים שעלולים לגרום לריח רע מהפה."
(מאמר מכתב עת נורבגי)','פעמים רבות הרעיון המרכזי נרמז כבר בכותרת ובפתיח, וזהו אכן הרעיון המרכזי.','מומלץ להתבונן על הכותרת ועל פסקת הפתיחה - הדבר עשוי להקל על זיהוי רעיון מרכזי.','רעיון מרכזי','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('מה ממליצים החוקרים הבריטיים?', '0','text','צחצוח שיניים
האם השיניים שלנו נעשות נקיות יותר ויותר ככל שאנחנו מצחצחים אותן חזק יותר ובמשך זמן רב יותר?
חוקרים בריטיים טוענים שלא. הם אפילו ניסו אפשרויות רבות ושנות ולבסוף מצאו את הדרך המושלמת לצחצוח השיניים. צחצוח של שתי דקות, בלי לצחצח חזק מדי, מביא לתוצאה הטובה ביותר. אם מצחצחים חזק, הורסים את ציפוי השן ואת החניכיים בלי להסיר שאריות אוכל או רובד פלאק.  
בנטה הנסן, מומחית לצחצוח שיניים, אומרת שזה רעיון טוב להחזיק את מברשת השיניים בצורה שבה אוחזים בעט. "התחילו בפינה אחת וצחצחו לאורך כל השורה", היא אומרת, "אל תשכחו את הלשון! היא יכולה להכיל המון חיידקים שעלולים לגרום לריח רע מהפה."
(מאמר מכתב עת נורבגי)','המידע מצוי במפורש בטקסט, צריך רק לזהות היכן, ועשית זאת מצוין.','כדאי להיעזר במילות מפתח המופיעות בשאלה כדי לזהות את התשובה בטקסט.','איתור מידע','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`, `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('מדוע מוזכר עט בטקסט?', '0','text','צחצוח שיניים
האם השיניים שלנו נעשות נקיות יותר ויותר ככל שאנחנו מצחצחים אותן חזק יותר ובמשך זמן רב יותר?
חוקרים בריטיים טוענים שלא. הם אפילו ניסו אפשרויות רבות ושנות ולבסוף מצאו את הדרך המושלמת לצחצוח השיניים. צחצוח של שתי דקות, בלי לצחצח חזק מדי, מביא לתוצאה הטובה ביותר. אם מצחצחים חזק, הורסים את ציפוי השן ואת החניכיים בלי להסיר שאריות אוכל או רובד פלאק.  
בנטה הנסן, מומחית לצחצוח שיניים, אומרת שזה רעיון טוב להחזיק את מברשת השיניים בצורה שבה אוחזים בעט. "התחילו בפינה אחת וצחצחו לאורך כל השורה", היא אומרת, "אל תשכחו את הלשון! היא יכולה להכיל המון חיידקים שעלולים לגרום לריח רע מהפה."
(מאמר מכתב עת נורבגי)','קריאה של רצף המשפט/ הפסקה מועילה להסיק את המסקנה המתבקשת - החוקרת מזכירה את העט כדי להמליץ כיצד להחזיק את מברשת השיניים.','נסו לקרוא את כל רצף המשפט/ הפסקה כדי להסיק את המסקנה הנכונה. ','הסקת מסקנות','קלה','הבעה','0','0','0','1','0','1');
INSERT INTO `textra_db`.`questions` (`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, `Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, `Q_proffession`,  `Q_reported_Offensive`, `Q_reported_Question`, `Q_reported_Answer`,`Q_approved`, `Q_disabled`, `Q_owner`) VALUES ('משהו קרה לאדם שבסיפור בלילה הקודם. מה קרה?', '0','text',
'האופנוע האם אי פעם התעוררת בתחושה שמשהו לא בסדר? זה היה מין יום כזה בשבילי. התיישבתי במיטה. מעט אחר כך הזזתי את הווילונות. היה מזג אוויר נורא – ירד גשם שוטף. ואז הבטתי למטה לחצר. כן! שם הוא עמד – האופנוע. הוא היה הרוס בדיוק כפי שהיה אתמול בלילה. והרגל שלי התחילה לכאוב.','אם נתבונן ברמזים בטקסט - תחושה של משהו לא בסדר, האופנוע ההרוס, הרגל הכואבת - ונחבר הכל יחד נגיע לכך שאכן האדם עבר תאונת אופנוע.','קרא בתשומת לב את הסיפור הקצר ונסה להבחין אילו רמזים נשתלים בתוכו.',
'רב','קלה','הבעה','0','0','0','1','0','1');

INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לשכנע אנשים שהזכייה בפיס אפשרית','1','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לגרום לאנשים להתרגש','1','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי שאנשים ירגישו הזדהות עם הזוכים','1','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי שאנשים יחשבו כיצד הם היו מגיבים לשיחה','1','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לשכנע את הצופה לרכוש RC קולה','2','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להדגים מה מוכן ילד לעשות כדי להרשים את חברתו','2','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להראות את מידת היצירתיות של ילדים','2','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להעביר מסר ללא מילים','2','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('יש קשר. הפרסומת טוענת ששתיית מים תהפוך אותך צעיר, ומדגימה זאת.','3','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('אין קשר. הפרסומת מצחיקה, ולכן גורמת לאנשים לצפות בה.','3','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('יש קשר. תינוקות הם קהל היעד העיקרי לצריכת מים מינרליים, ולכן מופיעים בפרסומת.','3','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('אין קשר. תינוקות הם חמודים ומושכים תשומת לב, ולכן משלבים אותם בפרסומות.','3','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לעודד אנשים לרכוש תוצרת כחול לבן','4','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לגרום לאנשים להצטלם עם מוצרי כחול לבן','4','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לשכנע אנשים להשתתף בתחרות סלפי כחול לבן','4','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לגרום לאנשים להעלות תמונות סלפי לאתר התאחדות הסטודנטים','4','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לשכנע אנשים שסיכויי הזכייה נמוכים','5','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי להציג את סיכויי הזכייה','5','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי להציע דרכים לשפר את סיכויי הזכייה','5','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי למנוע מאנשים להתלונן על כך שאינם זוכים','5','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לשכנע את רוכשי הכרטיסים שכספם יילך למטרות טובות.','6','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להציג את ההישגים של מפעל הפיס.','6','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להראות עד כמה מפעל הפיס פעיל ומשפיע בתחומי החיים השונים.','6','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לשכנע בחשיבות התרומה לקהילה.','6','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לשכנע את המדינה שיש להתייחס לארגוני הפשע כאל ארגוני טרור ולפעול בהתאם','7','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להציג את העלייה בפעילותם של ארגוני פשע בישראל','7','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להסביר כיצד ארגוני הפשע מסכנים את יציבותה של הדמוקרטיה','7','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לגרום למערכת המשפט להחמיר בעונשם של עבריינים מארגוני הפשע','7','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לחזק את טענתו בדבר חוסר האמינות של ויקיפדיה.','8','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לשכנע אנשים להפסיק להשתמש בוויקיפדיה.','8','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי להוכיח שוויקיפדיה מונעת משיקולים כלכליים.','8','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לעודד את המעוניינים לכתוב ערכים בוויקיפדיה.','8','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להזהיר אנשים מפני העוגיות','9','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לפרסם עוגיות קרם לימון','9','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לספר לאנשים מתי הוכנו העוגיות','9','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להסביר איפה אפשר לקנות עוגיות קרם לימון','9','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('להסביר מה לא בסדר בעוגיות','10','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לפרסם סוגים שונים של עוגיות','10','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לתאר מבצע המוצע לקונים את העוגיות','10','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לפרט את המרכיבים של העוגיות','10','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לזהות את קבוצת הייצור','11','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי שידעו מתי פג תוקפן','11','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי שהציבור יידע עד מתי לצרוך את העוגיות','11','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי שהציבור יידע עד מתי ההודעה רלוונטית','11','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('אותו אדם עבר תאונת אופנוע.','12','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('מזג האוויר הסוער פגע באופנוע.','12','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('מזג האוויר הסוער מנע מאותו אדם לצאת החוצה.','12','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('אותו אדם קנה אופנוע חדש.','12','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('יום רע','13','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('יום מרגש','13','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('יום משעמם','13','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('יום טוב','13','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לעניין את הקורא בסיפור.','14','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כי קשה לענות על השאלה.','14','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי להזכיר לקורא שחוויה כזאת היא נדירה.','14','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כי המחבר רוצה לדעת את התשובה.','14','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('האדם נזכר למה משהו נראה לו לא בסדר.','15','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('האדם השיג משהו שקשה להשיגו.','15','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('האדם מבין עכשיו שהיום לא יהיה גרוע כל כך.','15','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('האדם שמח לראות שוב את האופנוע.','15','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('הדרך הטובה ביותר לצחצח שיניים','16','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('מברשת השיניים הטובה ביותר לשימוש.','16','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('החשיבות של שיניים בריאות.','16','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('הדרך שבה אנשים שונים מצחצחים שיניים.','16','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לא לצחצח שיניים חזק מדי.','17','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לצחצח שיניים לעתים קרובות ככל האפשר.','17','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לא לנסות לצחצח את הלשון.','17','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('לצחצח את הלשון לעתים קרובות יותר מאשר את השיניים.','17','0')
;INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי לעזור לנו להבין איך להחזיק מברשת שיניים.','18','1');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כי מתחילים בפינה אחת עם עט וגם עם מברשת שיניים.','18','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כדי להראות שאפשר לצחצח שיניים בדרכים רבות ומגוונות.','18','0');
INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES ('כי צריך להתייחס לצחצוח שיניים ברצינות כמו לכתיבה.','18','0')
;

/*------------------ users -----------------*/
insert into users
values (1,"דמרי","עידן",1	,"idandamri@gmail.com","123456");
insert into users
values (2,"קריגל","שקד",0,"shakedkr@post.bgu.ac.il","123456");
insert into users
values (3,"גנים","הדס",0,"hadasganim@gmail.com","123456");
insert into users
values (4,"שטורם","ארנון",1,"sturm@bgu.ac.il","123456");
insert into users
values (5,"מנהל המערכת","מנהל מערכת על",2,"admin@gmail.com","123456");
insert into users
values (6,"יוצר מטלות עצמאיות","משתמש ייחודי",2,"rand@tasker.com","123456");
insert into users
values (7,"אורנה","מטח",1,"Orna@teacher.com","123456");
insert into users
values (8,"מוריה","מטח",1,"Morya@teacher.com","123456");
/*------------------------------------------*/

/*-------------- tasks ---------------------*/
insert into tasks
values(null,"מטלת ניסוי","מטלת ניסוי לבסיס הנתונים", 1, 1);

insert into tasks
values(null,"מטלת ניסוי 2","מטלת ניסוי לבסיס הנתונים", 4, 1);

/*------------------------------------------*/

/*--------------- groups -------------------*/
insert into groups
values(123456,"טקסטרטגיה","מבועות", "אשדוד", 4, 0, 1,"0123", 1, 1);

insert into groups
values(1234567,"שיעור פרטי","מבועות","אשדוד", 1, 0, 1, "0123456", 1, 1);

insert into groups
values(1234321,"כיתת ניסוי 1","בית ספר אשכולות","אשדוד", 8, 0, 1, "School-Orna", 1, 1);

insert into groups
values(1235321,"כיתת ניסוי 2","בית ספר אשכולות","אשדוד", 11, 0, 1, "School-Morya", 1, 1);

insert into groups
values(1, "קבוצת מורים", "מענית", "באר שבע", 5, 1,1,"teach",1,1);
/*------------------------------------------*/

/*----------- students_per_group -----------*/
insert into students_per_group
values(2,123456);

insert into students_per_group
values(3,123456);

insert into students_per_group
values(2,1234567);
/*------------------------------------------*/

/*----------- teachers_per_group -----------*/
insert into students_per_group
values(4,1);

insert into students_per_group
values(8,1);

insert into students_per_group
values(11,1);
/*------------------------------------------*/

/*----------- textra_db.tasks_joined_with_questions ---------*/

insert into tasks_joined_with_questions
values (1,1);

insert into tasks_joined_with_questions
values (1,2);

insert into tasks_joined_with_questions
values (1,3);

insert into tasks_joined_with_questions
values (1,4);

/*task2*/
insert into tasks_joined_with_questions
values (2,1);

insert into tasks_joined_with_questions
values (2,2);

insert into tasks_joined_with_questions
values (2,3);

insert into tasks_joined_with_questions
values (2,4);

/************ cities and schools **************/
INSERT INTO `textra_db`.`cities_and_schools` (`School`, `City`) VALUES ('מבועות','אשדוד');
INSERT INTO `textra_db`.`cities_and_schools` (`School`, `City`) VALUES ('בית ספר אשכולות','אשדןד');
INSERT INTO `textra_db`.`cities_and_schools` (`School`, `City`) VALUES ('מענית','באר שבע');
INSERT INTO `textra_db`.`cities_and_schools` (`School`, `City`) VALUES ('אשכולות','אשדוד');
/**********************************************/