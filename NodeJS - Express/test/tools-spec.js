var request = require("supertest");
/*var expect = */
require('chai').expect;
/*var should = */
require('chai').should();
var rewire = require('rewire');
var app = rewire('../server_testing');

var sinon = require("sinon");

describe("Testing Textrategia API", function () {


    it("Loads home page", function (done) {
        request(app).get("/").expect(200).end(done);
    });

    describe("Testing Login", function () {
        it('Test login Request - correct deatils', function (done) {
            request(app).post("/login").send({"user": "shakedkr@post.bgu.ac.il", "password": "123456"})
                .expect(200)
                .end(done);
        });
        it('Test login Request - fake deatils', function (done) {
            request(app).post("/login").send({"user": "someFakeMail@post.bgu.ac.il", "password": "123456"})
                .expect(204)
                .end(done);
        });
    });

    describe("Testing adding task to group", function () {
        it('Test adding task', function (done) {
            request(app).post("/addTaskToGroup").send({"group_id": "123456", "task_id": "2"})
                .expect(200)
                .end(done);
        });
    });

    describe("Testing get Tasks", function () {
        it('Test get tasks', function (done) {
            request(app).post("/getListOfTasks").send({"user_id": '3'})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    console.log("BODY: " + JSON.stringify(res.body));
                    res.status.should.be.equal(200);
                    done();
                });
        });

        it('Test get tasks - fake deatils', function (done) {
            request(app).post("/getListOfTasks").send({"user_id": '8'})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    res.status.should.be.equal(204);
                    done();
                });
        });
    });

    describe("Testing Get question", function () {
        it('Get Question For a Task', function (done) {
            request(app).post("/getQuestion").send({"user_id": '3', "t_id": "1"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    if (res.status == 200) {
                        res.status.should.be.equal(200);
                        questions = res.body;
                        strQ = JSON.stringify(questions["question"]);
                        console.log("{\"question\" : " + strQ + ", \"answers\": [");
                        for (i = 0; i < questions["answers"].length; i++) {
                            strQ = JSON.stringify(questions["answers"][i]);
                            if (i < questions["answers"].length - 1) {
                                console.log(strQ + ", ");
                            } else {
                                console.log(strQ + "]}");
                            }
                        }
                    }
                    else {
                        res.status.should.be.equal(204);
                    }
                });
            done();
        });

        it('Get Question For an Empty Task', function (done) {
            request(app).post("/getQuestion").send({"user_id": '10650651', "t_id": "1"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    console.log("returned status " + res.status);
                    res.status.should.be.equal(676);
                    done();
                });
        });
    });

    describe("Testing update answer", function () {
        it('Testing update answer', function (done) {
            request(app).post("/updateAnswer").send({"ans_id": "1", "quest_id": "1", "user_id": "3", "task_id": "2"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });
    });


    describe("Truncating tables", function () {
        it('Truncate table TasksAndStud', function (done) {
            request(app).post("/truncateTasksAndStudTable").send()
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });

        it('Truncate table InstancesOfAnswers', function (done) {
            request(app).post("/truncateInstancesOfAnswers").send()
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });
    });

    describe("Testing edit question", function () {
        it('Testing edit question', function (done) {
            request(app).post("/editQuestion").send({
                "id": "1",
                "question": "testQ title",
                "mediaType": "text",
                "media": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu",
                "is_multiple_ans": "0",
                "correctFB": "well done",
                "notCorrectFB": "it was not the correct answer",
                "skill": "testing skills!",
                "difficulty": "easy",
                "proffesion": "test profesion",
                "approved": "1",
                "disabled": "0",
                "answers": [
                    {"A_id": "1", "answer": "idan", "isCorrect": "1"},
                    {"A_id": "2", "answer": "idan2", "isCorrect": "0"},
                    {"A_id": "3", "answer": "idan3", "isCorrect": "0"},
                    {"A_id": "4", "answer": "idan4", "isCorrect": "0"}
                ]
            })
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });
    });

    describe("Testing add question", function () {
        it('Testing adding question', function (done) {
            request(app).post("/addQuestion").send({
                "question_title": "testQ title",
                "is_multiple_ans": "0",
                "question_media": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu",
                "question_media_type": "text",
                "quest_correct_fb": "well done",
                "quest_incorrect_fb": "it was not the correct answer",
                "quest_skill": "testing skills!",
                "quest_difficulty": "easy",
                "quest_proffesion": "test profesion",
                "quest_is_approved": "1",
                "who_created": "1",
                "quest_disabled": "0",
                "answer1": "a",
                "answer2": "b",
                "answer3": "c",
                "answer4": "d",
                "correctAnswerIndex": "1,3"
            })
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });

        it('Testing FAIL adding question - missing  a \' not nullable \' param', function (done) {
            request(app).post("/addQuestion").send({
                "is_multiple_ans": "0",
                "question_media": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu",
                "question_media_type": "text",
                "quest_correct_FB": "well done",
                "quest_incorrect_FB": "it was not the correct answer",
                "quest_skill": "testing skills!",
                "quest_difficulty": "easy",
                "quest_proffesion": "test proffesion",
                "quest_is_approved": "1",
                "quest_disabled": "0",
                "answer1": "a",
                "answer2": "b",
                "answer3": "c",
                "answer4": "d"
            })
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(400);
                    }
                    done();
                });
        });
    });


    describe("Testing approve question", function () {
        it('Testing approve OK', function (done) {
            request(app).post("/questionApproveOrNot").send({"q_id": "1", "is_approved": "1"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });

        it('Testing approve FAIL', function (done) {
            request(app).post("/questionApproveOrNot").send({"q_id": "1000000000000000009", "is_approved": "1"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(204);
                    }
                    done();
                });
        });
    });


    describe("Testing disable question", function () {
        it('Testing disable OK', function (done) {
            request(app).post("/disableQuestion").send({"q_id": "1", "disable_status": "1"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });

        it('Testing approve FAIL', function (done) {
            request(app).post("/disableQuestion").send({"q_id": "1000000000000000009", "disable_status": "1"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(204);
                    }
                    done();
                });
        });
    });


    describe("Testing groups", function () {
        it('Testing insert students(plural)', function (done) {
            request(app).post("/removeTestUsersFromGroup").send()
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });
        it('Testing insert students(plural)', function (done) {
            request(app).post("/addUsersToGroup").send({"users": [1, 3], "group_id": "1234567"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });

        it('Testing insert students(empty)', function (done) {
            request(app).post("/addUsersToGroup").send({"users": [], "group_id": "1213"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(204);
                    }
                    done();
                });
        });

        it('Testing creation of group', function (done) {
            request(app).post("/createGroup").send({
                "group_name": "tests 2",
                "school": "BGU",
                "city": "B7",
                "is_teacher_group": "0",
                "group_user_type": "0",
                "teacher_id": "4",
                "is_master": "0",
                "is_approved": "1"
            })
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });
    });


    describe("Testing Register User", function () {
        it('Test login Request - correct deatils', function (done) {
            request(app).post("/registerUser").send({
                "personal_id": "12121211",
                "group_code": "0123",
                "last_name": "Gudes",
                "first_name": "Ehud",
                "user_type": "0",
                "email": "ehud@post.bgu.ac.il",
                "password": "123456"
            })
                .expect(200)
                .end(done);
        });

        it('Test login Request - correct deatils', function (done) {
            request(app).post("/removeRegisterUser").send()
                .expect(200)
                .end(done);
        });
    });


    describe("Testing group of user", function () {
        it('Test group of user', function (done) {
            request(app).post("/addTestTaskQuestions").send()
                .end(function (err, res) {
                    if (err)
                        throw err;
                    done();
                });
        });
        it('Test group of user', function (done) {
            request(app).post("/getGroupByUser").send({"teacher_id": "1"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    console.log("BODY: " + JSON.stringify(res.body));
                    done();
                });
        });
        it('Test group of user - empty group', function (done) {
            request(app).post("/getGroupByUser").send({"teacher_id": "19"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    console.log("BODY: " + JSON.stringify(res.body));
                    done();
                });
        });
    });


    describe("Testing adding Task", function () {
        it('Test create task - correct deatils', function (done) {
            request(app).post("/createTask").send({
                "t_title": "TiTlE-TeSt", "t_description": "desc_desc_desc", "t_owner": 1,
                "t_approved": 1, "questions": [1, 3, 4, 15, 8, 7]
            })
                .expect(200)
                .end(done)
        });
    });


    describe("Testing If Group Code Exists", function () {
        it('Test If Group Code Exists - correct deatils', function (done) {
            request(app).post("/checkIfGroupCodeExists").send({
                "group_code": "teach"
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });


    describe("Testing get Student List From Group Id", function () {
        it('Test get Student List From Group Id - correct deatils', function (done) {
            request(app).post("/getStudentListFromGroupId").send({
                "group_id": "123456"
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });


    describe("Testing get Groups By School", function () {
        it('Test get Groups By School - correct deatils', function (done) {
            request(app).post("/getGroupsBySchool").send({
                "school": "מבועות"
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });


    describe("Testing get Valid Questions", function () {
        it('Test get Valid Questions - correct deatils', function (done) {
            request(app).post("/getValidQuestions").send({
                "is_app": "1",
                "is_disabled": "0"
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });


    describe("Testing get Groups By Teacher And City", function () {
        it('Test get Groups By Teacher And City - correct deatils', function (done) {
            request(app).post("/getGroupsByTeacherAndCity").send({
                "teacher_id": "1",
                "city": "אשדוד"
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });


    describe("Testing get Groups By Teacher And City", function () {
        it('Test get Groups By Teacher And City - correct deatils', function (done) {
            request(app).post("/generateRandTask").send({
                "media_types": "",
                "student_id": "4",
                "skills": ""/* "הסקת מסקנות"*/,
                "rand_num": "12",
                "difficulties": ""/* "קלה"*/
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });


    describe("Testing get Groups By Teacher And City", function () {
        it('Test get Teachers By School And City - correct deatils', function (done) {
            request(app).post("/getAllTeachersBySchoolAndCity").send({
                "school": "מבועות",
                "city": "אשדוד"
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });

    describe("Testing get Teachers By School And City", function () {
        it('Test get Teachers By School And City - correct deatils', function (done) {
            request(app).post("/getTeachersGroupByCityAndSchool").send({
                "school": "מענית",
                "city": "באר שבע"
            })
                .expect(200)
                .end(function (err, res) {
                    console.log("response: " + JSON.stringify(res.body));
                    done();
                });
        });
    });
});
