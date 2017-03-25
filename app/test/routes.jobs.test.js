process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../src/app');
const knex = require('../src/db/connection');
const queries = require('../src/db/queries');

chai.use(chaiHttp);

describe('Job API Routes', () => {
  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /', () => {
    it('should return all jobs', (done) => {
      chai.request(server)
      .get('/')
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
  describe('GET /:id', () => {
    it('should return a single job', () => {
      return queries.getAllJobs()
      .then((jobs) => {
        const job = jobs[0];
        chai.request(server)
        .get(`/${job.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.id.should.equal(job.id);
          res.body.data.should.have.property('title');
          res.body.data.title.should.equal(job.title);
          res.body.data.should.have.property('description');
          res.body.data.description.should.equal(job.description);
          res.body.data.should.have.property('company');
          res.body.data.company.should.equal(job.company);
          res.body.data.should.have.property('email');
          res.body.data.email.should.equal(job.email);
          res.body.data.should.have.property('contacted');
          res.body.data.contacted.should.equal(job.contacted);
        });
      });
    });
  });
  describe('POST /', () => {
    it('should create a new job', () => {
      return queries.getAllJobs()
      .then((jobsBefore) => {
        chai.request(server)
        .post('/')
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
          res.body.data.should.equal('Job Added!');
          return queries.getAllJobs()
          .then((jobsAfter) => {
            jobsAfter.length.should.equal(jobsBefore.length + 1);
            jobsAfter[jobsAfter.length - 1].title.should.equal(
              'Senior Solutions Architect');
          });
        });
      });
    });
    it('should NOT create a job missing a title', () => {
      return queries.getAllJobs()
      .then((jobsBefore) => {
        chai.request(server)
        .post('/')
        .send({
          description: 'Design solutions all day long',
          company: 'NodeGorge',
          email: 'manager@nodegorge.com',
          contacted: false,
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.type.should.equal('application/json');
          return queries.getAllJobs()
          .then((jobsAfter) => {
            jobsAfter.length.should.equal(jobsBefore.length);
            jobsAfter[jobsAfter.length - 1].description.should.not.equal(
              'Design solutions all day long');
          });
        });
      });
    });
  });
  describe('PUT /:id', () => {
    it('should update a job', () => {
      return queries.getAllJobs()
      .then((jobsBefore) => {
        const jobID = jobsBefore[0].id;
        chai.request(server)
        .put(`/${jobID}`)
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
          res.body.data.should.equal('Job Updated!');
          return queries.getSingleJob(jobID)
          .then((jobs) => {
            jobs[0].title.should.equal('subservient architect');
            jobs[0].description.should.equal('follow the lead architect');
            jobs[0].company.should.equal('Microsoft');
            jobs[0].email.should.equal('manager@example.com');
            jobs[0].contacted.should.equal(false);
          });
        });
      });
    });
  });
  describe('DELETE /:id', () => {
    it('should delete a job', () => {
      return queries.getAllJobs()
      .then((jobsBefore) => {
        const jobID = jobsBefore[0].id;
        chai.request(server)
        .delete(`/${jobID}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.data.should.equal('Job Removed!');
          return queries.getSingleJob(jobID)
          .then((jobs) => {
            jobs.length.should.equal(0);
          });
        });
      });
    });
  });
});
