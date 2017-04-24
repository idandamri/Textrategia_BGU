var request = require("supertest");
/*var expect = */
require('chai').expect;
/*var should = */
require('chai').should();
var rewire = require('rewire');
var app = rewire('../server');
// var app = rewire('../server_V2');//TODO hide above and expose this for stable V2 version
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
                .expect(401)
                .end(done);
        });
    });

    describe("Testing get Tasks", function () {
        it('Test get tasks', function (done) {
            request(app).post("/getListOfTasks").send({"user_id": '1'})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    res.status.should.be.equal(200);
                    console.log("BODY: " + JSON.stringify(res.body));
                    res.status.should.be.equal(200);
                    // JSON.stringify(res.body).should.be.equal('[{"T_id":1,"T_title":"מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים"}],"T_owner":"1","T_approved":1},{"T_id":2,"T_title":"2מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים","T_owner":"4","T_approved":1}]');
                    done();
                });
        });

        it('Test get tasks - fake deatils', function (done) {
            request(app).post("/getListOfTasks").send({"user_id": '8'})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    res.status.should.be.equal(204);
                    /*no data*/
                    done();
                });
        });
    });

    describe("Testing Get question", function () {
        it('Get Question For a Task', function (done) {
            request(app).post("/getQuestion").send({"user_id": '1', "t_id": "1"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    res.status.should.be.equal(200);
                    questions = res.body;
                    strQ = JSON.stringify(questions["question"]);
                    console.log("{\"question\" : " + strQ + ", \"answers\": [");
                    for (i = 0; i < questions["answers"].length; i++) {
                        strQ = JSON.stringify(questions["answers"][i]);
                        // console.log("Ans "+i+" - " + strQ);
                        if (i < questions["answers"].length - 1) {
                            console.log(strQ + ", ");
                        } else {
                            console.log(strQ + "]}");
                        }
                    }
                    done();
                });
            done();
        });

        /*it('Get Question For an Empty Task', function (done) {
         request(app).post("/getQuestion").send({"user_id": '1', "t_id": "1"})
         .end(function (err, res) {
         if (err)
         throw err;
         console.log("returned status " + res.status);
         res.status.should.be.equal(676);
         done();
         });
         done();
         });*/
    });

    describe("Testing update answer", function () {
        this.timeout(7000);
        it('Testing update answer', function (done) {
            request(app).post("/updateAnswer").send({"ans_id": "1", "quest_id": "1", "stud_id": "2", "task_id": "1"})
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
                "quest_profesion": "test profesion",
                "quest_is_approved": "1",
                "who_created": "1",
                "quest_disabled": "0"
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
                "quest_disabled": "0"
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
        this.timeout(7000);
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
            request(app).post("/questionApproveOrNot").send({"q_id": "134", "is_approved": "1"})
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


    describe("Testing groups", function () {
        it('Testing insert students(plural)', function (done) {
            request(app).post("/addUsersToGroup").send({"users": [1, 3], "group_id": "1234567"})
                .end(function (err) {
                    if (err) {
                        console.log("ERR: " + err);
                        throw err;
                    }
                    else {
                        // res.status.should.be.equal(200);
                    }
                    done();
                });
        });

        /* it('Testing insert students(single)', function (done) {
         request(app).post("/addUsersToGroup").send({"users": [1], "group_id": "1234567"})
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
         });*/

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
                "teacher_id": "4", "is_master": "0",
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
                "school": "BGU",
                "city": "B7",
                "user_type": "0",
                "email": "shakedkr@post.bgu.ac.il",
                "password": "123456"
            })
                .expect(200)
                .end(done);
        });
    });

    describe("Testing group of user", function () {
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
            request(app).post("/getGroupByUser").send({"teacher_id": "9"})
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
                .end(done);
        });
    });


    describe("Testing adding task to group", function () {
        it('Test adding', function (done) {
            request(app).post("/addTaskToGroup").send({"group_id": "123456", "task_id": "3"})
                .expect(200)
                .end(done);
        });
    });

});