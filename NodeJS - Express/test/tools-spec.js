var request = require("supertest");
var expect = require('chai').expect;
var should = require('chai').should();
var rewire = require('rewire');
var app = rewire('../server_test');
var sinon = require("sinon");

describe("Testing Textrategia API",function(){


     it("Loads home page", function (done) {
         request(app).get("/").expect(200).end(done);
    });

    describe("Testing Login",function() {
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

    describe("Testing get Tasks",function() {
        it('Test get tasks', function (done) {
            request(app).get("/getListOfTasks").send({"user_id": '1'})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    res.status.should.be.equal(200);
                    console.log("BODY: " + JSON.stringify(res.body));
                    JSON.stringify(res.body).should.be.equal('[{"T_id":1,"T_title":"מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים"}]')
                    done();
                });
        });

        it('Test get tasks - fake deatils', function (done) {
            request(app).get("/getListOfTasks").send({"user_id": '8'})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    //console.log("BODY: " + JSON.stringify(res.body));
                    res.status.should.be.equal(204); /*no data*/
                    done();
                });
        });
    });

    describe("Testing Get question",function() {
        it('Get Question For a Task', function (done) {
            request(app).get("/getQuestion").send({"user_id": '1', "t_id": "1"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    res.status.should.be.equal(200);
                    console.log("BODY: " + JSON.stringify(res.body));
                    done();
                    //res.body.should.be.equal('[{"T_id":1,"T_title":"מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים"}]')
                });
        });

        it('Get Question For an Empty Task', function (done) {
            request(app).get("/getQuestion").send({"user_id": '1', "t_id": "5"})
                .end(function (err, res) {
                    if (err)
                        throw err;
                    res.status.should.be.equal(204);
                    console.log("BODY: " + JSON.stringify(res.body));
                    done();
                    //res.body.should.be.equal('[{"T_id":1,"T_title":"מטלת ניסוי","T_description":"מטלת ניסוי לבסיס הנתונים"}]')
                });
        });


    });

    describe ("Testing update answer", function () {
        // it('Testing success update', function (done) {
        //     request(app).post("/updateAnswer").send({"a_id ": "1" , "q_id" : "1" , "t_id " : "1" , "s_id" : "2"})
        //         .end(function (err,res) {
        //             if(err){
        //                 console.log("ERR: " + err)
        //                 throw err;
        //             }
        //
        //             res.status.should.be.equal(200);
        //             done();
        //
        //         });
        // });

    });




});
