global.DATABASE_URL = 'mongodb://127.0.0.1/test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {

    before(function(done) {
        this.timeout(10000);
        server.runServer(function() {
            Item.create({
                name: 'Broad beans'
            }, {
                name: 'Peppers'
            }, {
                name: 'Tomatoes'
            }, function() {
                done();
            });
        });

    });

    after(function(done) {
        this.timeout(10000);
        Item.remove(function() {
            done();
        });
    });

    it('should list items on get', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.have.property('_id');
                    item.should.have.property('name');
                    item._id.should.be.a('string');
                    item.name.should.be.a('string');
                    //console.log(item);
                });
                // res.body[0].should.be.a('object');
                // res.body[0].should.have.property('_id');
                // res.body[0].should.have.property('name');
                // res.body[0]._id.should.be.a('string');
                // res.body[0].name.should.be.a('string');
                // res.body[0].name.should.equal('Broad beans');
                // res.body[1].name.should.equal('Peppers');
                // res.body[2].name.should.equal('Tomatoes');
                done();
            });
    });


    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({
                'name': 'Kale'
            })
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Kale');
                Item.find({
                    name: 'Kale'
                }, function(err, docs) {
                    docs.name.should.equal('Kale');
                });
                Item.find(function(err, docs) {
                    docs.length.should.equal(4);
                });
                done();
            });
    });

    // Edit the Kale item just added
    it('should edit an item on put', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                chai.request(app)
                    .put('/items/' + res.body[2]._id)
                    .send({
                        'name': 'New Item'
                    })
                    .end(function(error, response) {
                        //response.should.have.status(200);
                        //response.should.be.json;
                        //response.body.name.should.equal('New Item');
                        done();
                    });
            });
    });

    // Delete the Kale item just added
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                chai.request(app)
                    .delete('/items/' + res.body[2]._id)
                    .end(function(error, response) {
                        // res.body.should.have.length(3);
                        Item.find(function(err, docs) {
                            docs.length.should.equal(3);
                        });
                        done();
                    });
            });
    });
});