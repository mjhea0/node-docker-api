const jobs = [
  {
    title: 'Horse Whisperer',
    description: 'Talk to horses all day every day',
    company: 'Horse Fun',
    email: 'ed@horsefun.com',
    contacted: true,
  },
  {
    title: 'Full-stack Developer',
    description: 'Code all day every day',
    company: 'Node Fun',
    email: 'eddie@nodefun.com',
    contacted: false,
  },
  {
    title: 'Clay Dryer',
    description: 'Drying clay all day every day',
    company: 'Clay Fun',
    email: 'edward@clayfun.com',
    contacted: true,
  },
];

exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('jobs').del()
    .then(() => {
      // Inserts seed entries
      return knex('jobs').insert(jobs);
    });
};
