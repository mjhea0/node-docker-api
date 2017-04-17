const chai = require('chai');
const request = require('request-promise');
const cheerio = require('cheerio');
const should = chai.should();

const BASE = 'http://web:3003';

describe('GET /', () => {
  it('should load properly', () => {
    const options = {
      method: 'GET',
      uri: BASE,
    };
    return request(options)
    .then((res) => {
      const $ = cheerio.load(res);
      $('h1').html().should.eql('Login');
    })
    .catch((err) => {
      console.log(err);
      should.not.exist(err);
    });
  });
});
