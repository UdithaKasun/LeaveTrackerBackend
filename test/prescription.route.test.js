var should = require('should');
var request  = require('supertest');

var PrescriptionSchema = require('../models/Prescription');

var app = require('../app');

//Testing GET API Call

describe('GET /api/prescription/', function () {
  it('respond with json',function (done) {
    request(app)
      .get('/api/prescription/')
        .set('Authorization', 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMDUyY2NmMjdjOWQ0YTgwYjlhOTUxNCIsInVzZXJuYW1lIjoic2hhbGl0aGEiLCJleHAiOjE1MTU1MDk3NzMsImlhdCI6MTUxMDMyNTc3M30.fsmalTXXwIwwKnoC2FLIs-5yjEwPcyUjdjLmIShnRa0")
      .set('Accept','application/json')
      .expect(200)
      .end(function (err,res) {
        if(err)
          return done(err);
        done();
      });
  });
});

//Testing POST API Call

var prescription = new PrescriptionSchema();
prescription.prescription_patient_name = "Kasun Perera";
prescription.prescription_patient_age = "22";
prescription.prescription_patient_gender = "Male";
prescription.prescription_patient_remark = "Test"

describe('POST /api/prescription/',function () {
  it('succefully added prescription object',function (done) {
    request(app)
      .post('/api/prescription/')
      .send(prescription)
      .set('Accept','application/json')
      .end(function (err,res) {
        if(err)
          return done(err);
        done();
      });
  })
})


