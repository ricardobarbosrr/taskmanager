const axios = require('axios');

const API_URL = 'http://localhost:3001/api/tasks';

async function testServer() {
  try {
    // Testar GET
    console.log('Testando GET...');
    const getResponse = await axios.get(API_URL);
    console.log('GET OK:', getResponse.data);

    // Testar POST
    console.log('Testando POST...');
    const newTask = {
      id: Date.now(),
      title: 'Teste',
      description: 'Tarefa de teste',
      dueDate: '2025-04-09',
      dueTime: '15:00',
      status: 'pendente',
      createdAt: new Date().toISOString()
    };
    const postResponse = await axios.post(API_URL, newTask);
    console.log('POST OK:', postResponse.data);

    // Testar PUT
    console.log('Testando PUT...');
    const updatedTask = {
      ...newTask,
      title: 'Teste Atualizado'
    };
    const putResponse = await axios.put(`${API_URL}/${newTask.id}`, updatedTask);
    console.log('PUT OK:', putResponse.data);

    // Testar DELETE
    console.log('Testando DELETE...');
    await axios.delete(`${API_URL}/${newTask.id}`);
    console.log('DELETE OK');

  } catch (error) {
    console.error('Erro no teste:', error.response?.data || error.message);
  }
}

testServer();
