var request = require("supertest");
var expect = require('chai').expect;
var should = require('chai').should();
var rewire = require('rewire');
var app = rewire('../server_test');
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
                    JSON.stringify(res.body).should.be.equal('[{"T_id":1,"T_title":"מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים"}]');
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
                    console.log("{\"question\" : "+ strQ + ", \"answers\": [");
                    for (i = 0; i < questions["answers"].length; i++) {
                        strQ = JSON.stringify(questions["answers"][i]);
                        // console.log("Ans "+i+" - " + strQ);
                        if (i<questions["answers"].length-1) {
                            console.log(strQ + ", ");
                        } else {
                            console.log(strQ + "]}");
                        }
                    }
                    // qqq = questions;
                    done();
                });
            done();
        });

        it('Get Question For an Empty Task', function (done) {
            request(app).post("/getQuestion").send({"user_id": '1', "t_id": "1"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    console.log("returned status " + res.status)
                    res.status.should.be.equal(676);
                    done();
                });
            done();
        });
    });

    describe("Testing update answer", function () {
        this.timeout(7000);
        it('Testing update answer', function (done) {
            request(app).post("/updateAnswer").send({"ans_id": "1", "quest_id": "1", "stud_id": "2", "task_id": "1"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err)
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });
    });

    describe("Testing groups", function () {
        it('Testing insert student', function (done) {
            request(app).post("/insertStudentToGroup").send({"stud_id": "1", "group_id": "1111"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err)
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });


        it('Testing creation of group', function (done) {
            request(app).post("/createGroup").send({"group_id": "1234", "group_name": "בדיקות 2",
                "teacherID": "4", "is_master": "0", "group_code": "01234"})
                .end(function (err, res) {
                    if (err) {
                        console.log("ERR: " + err)
                        throw err;
                    }
                    else {
                        res.status.should.be.equal(200);
                    }
                    done();
                });
        });
    });

});
