process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/app');
const knex = require('../../src/model/connection');
const queries = require('../../src/model/queries');

describe('Locations API Routes', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /locations', () => {
    it('should return all locations', (done) => {
      chai.request(server)
      .get('/locations')
      .end((err, res) => {
        res.type.should.equal('application/json');
        res.body.status.should.equal('success');
        res.body.data.should.be.a('array');
        res.body.data.length.should.equal(3);
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('title');
        res.body.data[0].should.have.property('description');
        res.body.data[0].should.have.property('company');
        res.body.data[0].should.have.property('email');
        res.body.data[0].should.have.property('contacted');
        done();
      });
    });
  });
  describe('GET /locations/:id', () => {
    it('should return a single location', () => {
      return queries.getAllLocations()
      .then((locations) => {
        const location = locations[0];
        chai.request(server)
        .get(`/locations/${location.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.id.should.equal(location.id);
          res.body.data.should.have.property('title');
          res.body.data.title.should.equal(location.title);
          res.body.data.should.have.property('description');
          res.body.data.description.should.equal(location.description);
          res.body.data.should.have.property('company');
          res.body.data.company.should.equal(location.company);
          res.body.data.should.have.property('email');
          res.body.data.email.should.equal(location.email);
          res.body.data.should.have.property('contacted');
          res.body.data.contacted.should.equal(location.contacted);
        });
      });
    });
  });
  describe('POST /', () => {
    it('should create a new location', () => {
      return queries.getAllLocations()
      .then((locationsBefore) => {
        chai.request(server)
        .post('/locations')
        .send({
          title: 'Senior Solutions Architect',
          description: 'Design solutions all day long',
          company: 'NodeGorge',
          email: 'manager@nodegorge.com',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.data.should.equal('Location Added!');
          return queries.getAllLocations()
          .then((locationsAfter) => {
            locationsAfter.length.should.equal(locationsBefore.length + 1);
            locationsAfter[locationsAfter.length - 1].title.should.equal(
              'Senior Solutions Architect');
          });
        });
      });
    });
    it('should NOT create a location missing a title', () => {
      return queries.getAllLocations()
      .then((locationsBefore) => {
        chai.request(server)
        .post('/locations')
        .send({
          description: 'Design solutions all day long',
          company: 'NodeGorge',
          email: 'manager@nodegorge.com',
          contacted: false,
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.type.should.equal('application/json');
          res.body.status.should.equal('error');
          return queries.getAllLocations()
          .then((locationsAfter) => {
            locationsAfter.length.should.equal(locationsBefore.length);
            locationsAfter[locationsAfter.length - 1].description.should.not.equal(
              'Design solutions all day long');
          });
        });
      });
    });
  });
  describe('PUT /:id', () => {
    it('should update a location', () => {
      return queries.getAllLocations()
      .then((locationsBefore) => {
        const locationID = locationsBefore[0].id;
        chai.request(server)
        .put(`/locations/${locationID}`)
        .send({
          title: 'subservient architect',
          description: 'follow the lead architect',
          company: 'Microsoft',
          email: 'manager@example.com',
          contacted: false,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.data.should.equal('Location Updated!');
          return queries.getSingleLocation(locationID)
          .then((locations) => {
            locations[0].title.should.equal('subservient architect');
            locations[0].description.should.equal('follow the lead architect');
            locations[0].company.should.equal('Microsoft');
            locations[0].email.should.equal('manager@example.com');
            locations[0].contacted.should.equal(false);
          });
        });
      });
    });
  });
  describe('DELETE /:id', () => {
    it('should delete a location', () => {
      return queries.getAllLocations()
      .then((locationsBefore) => {
        const locationID = locationsBefore[0].id;
        chai.request(server)
        .delete(`/locations/${locationID}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.data.should.equal('Location Removed!');
          return queries.getSingleLocation(locationID)
          .then((locations) => {
            locations.length.should.equal(0);
          });
        });
      });
    });
  });

});
