var should = require('should');
var request  = require('supertest');

var Customer = require('../models/Customer');

var app = require('../app');



//Testing GET API Call
describe('GET /api/customer/', function () {
  it('respond with json',function (done) {
    request(app)
      .get('/api/customer/')
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


//Testing POST API Calol
var customer = new Customer();
customer.customer_name = "Andrew";
customer.customer_nic = "941256895V";
customer.customer_address = "Kandy";
customer.customer_email = "andrew.f@gmail.com";
customer.customer_contact = "0777568942";

describe('POST /api/customer/',function () {
  it('succefully added customer object',function (done) {
    request(app)
      .post('/api/customer/')
      .send(customer)
      .set('Accept','application/json')
      .expect('Content-Type', /json/)
      .end(function (err,res) {
        if(err)
          return done(err);
        done();
      });
  })
})


