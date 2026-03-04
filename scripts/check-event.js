
require('dotenv').config();
const { Event } = require('../src/models');
const fs = require('fs');

async function checkEventStatus() {
  try {
    const idCode = 'c1a37f37-e582-4384-af0d-f18f9a97de84';
    
    // Busca ignorando paranoid para ver se existe e como está
    const event = await Event.findOne({ 
      where: { id_code: idCode },
      paranoid: false 
    });

    let output = '';
    if (!event) {
      output = 'Evento NÃO encontrado no banco (nem mesmo deletado).';
    } else {
      output = `Evento encontrado:\nID: ${event.id}\nStatus: ${event.status}\nDeleted At: ${event.deleted_at}`;
    }
    
    fs.writeFileSync('check-event-output.txt', output);
    process.exit(0);
  } catch (error) {
    fs.writeFileSync('check-event-output.txt', `Erro: ${error.message}`);
    process.exit(1);
  }
}

checkEventStatus();
