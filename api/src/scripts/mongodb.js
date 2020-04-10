// Connect to database
  // mongo -u murilo -p 123 --authenticationDatabase heroes

// mostra os dbs
  //show dbs 

// altera para usar um database específico
  //use heroes

// mostra as tabelas (coleções)
  //show collections

// insert
db.heroes.insert({ name: 'Flash', power: 'Speeding', birthdate: '1998-01-01' })

// js insert
for (let i=0; i < 15000; i++){
  db.heroes.insert({
    name: `Clone-${i} do Flash`,
    power: 'Speeding',
    birthdate: '1998-01-01'
  });
}

// read
db.heroes.find()
db.heroes.findOne()
db.heroes.find().limit(1000).sort({ name: -1 });

// update
db.heroes.update({ _id: ObjectId("5e77d4913da5e3c98e1a5146") }, { name: 'Mulher Maravilha' });
db.heroes.update({ _id: ObjectId("5e77d3de3da5e3c98e1a2a36") }, { $set: { name: 'Mulher Maravilha' } });

// delete
db.heroes.remove({ _id: ObjectId("5e77d4913da5e3c98e1a5146") });
db.heroes.remove({});