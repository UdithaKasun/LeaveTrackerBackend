var should = require('should');
var request  = require('supertest');

var DrugSchema = require('../models/Drug');

var app = require('../app');

//Testing GET API Call

describe('GET /api/drugs/', function () {
  it('respond with json',function (done) {
    request(app)
      .get('/api/drugs/')
        .set('Authorization', 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZmMyNTIzNTQyYWUzODAyNmQ3ZTEzYyIsInVzZXJuYW1lIjoicGFzaW5kdSIsImV4cCI6MTUxNDkyMTMxMywiaWF0IjoxNTA5NzM3MzEzfQ.QvJtLslKj7ASp-O1fSW-QwIax448k3VrNZau9Tm6-uE")
      .set('Accept','application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err,res) {
        if(err)
          return done(err);
        done();
      });
  });
});

//Testing POST API Call

var drug = new DrugSchema();
drug.drug_srno = "D001";
drug.drug_name = "Panadol";
drug.drug_remarks = "Tablets";

describe('POST /api/drug/',function () {
  it('succefully added drug object',function (done) {
    request(app)
      .post('/api/drug/')
      .send(drug)
      .set('Accept','application/json')
      .expect('Content-Type', /json/)
      .end(function (err,res) {
        if(err)
          return done(err);
        done();
      });
  })
})


