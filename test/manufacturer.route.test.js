var should = require('should');
var request  = require('supertest');

var ManufacturerSchema = require('../models/Manufacturer');

var app = require('../app');

//Testing GET API Call
describe('GET /api/manufacturer/', function () {
    // var token = null;
    //
    // var user = {
    //         "username":"pasindu",
    //         "password":"abcd123"
    // };
    // before(function(done) {
    //     request(app)
    //         .post('/user/login/')
    //         .send({ user: user })
    //         .end(function(err, res) {
    //             token = res.body.token;
    //             done();
    //         });
    // });
// var tokan;
    // tokan = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZmMyNTIzNTQyYWUzODAyNmQ3ZTEzYyIsInVzZXJuYW1lIjoicGFzaW5kdSIsImV4cCI6MTUxNDkyMTMxMywiaWF0IjoxNTA5NzM3MzEzfQ.QvJtLslKj7ASp-O1fSW-QwIax448k3VrNZau9Tm6-uE";
  it('respond with json',function (done) {
    request(app)
      .get('/api/manufacturer/')
        // .set('Authorization', 'Bearer ' + token)
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

var manufacturer = new ManufacturerSchema();
manufacturer.manufacturer_name = "Asiri Medicals";
manufacturer.manufacturer_address = "Colombo";
manufacturer.manufacturer_contact = "01123658945";
manufacturer.manufacturer_email = "asiri@gmail.com";

describe('POST /api/manufacturer/',function () {
  it('succefully added manufacturer object',function (done) {
    request(app)
      .post('/api/manufacturer/')
      .send(manufacturer)
      .set('Accept','application/json')
      .expect('Content-Type', /json/)
      .end(function (err,res) {
        if(err)
          return done(err);
        done();
      });
  })
})


