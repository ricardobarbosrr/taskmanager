const axios = require('axios');

const API_URL = 'http://localhost:3001/api/tasks';

async function testTaskService() {
  try {
    // Testar GET
    console.log('Testando GET...');
    const getResponse = await axios.get(API_URL);
    console.log('GET OK:', getResponse.data);

    // Testar POST
    console.log('Testando POST...');
    const newTask = {
      title: 'Teste POST',
      description: 'Tarefa de teste POST',
      dueDate: '2025-04-09',
      dueTime: '15:00',
      status: 'pendente',
      createdAt: new Date().toISOString()
    };
    const postResponse = await axios.post(API_URL, newTask);
    console.log('POST OK:', postResponse.data);

    // Testar PUT
    console.log('Testando PUT...');
    const taskId = postResponse.data.id;
    const updatedTask = {
      ...newTask,
      title: 'Teste PUT Atualizado'
    };
    const putResponse = await axios.put(`${API_URL}/${taskId}`, updatedTask);
    console.log('PUT OK:', putResponse.data);

    // Testar DELETE
    console.log('Testando DELETE...');
    await axios.delete(`${API_URL}/${taskId}`);
    console.log('DELETE OK');

  } catch (error) {
    console.error('Erro no teste:', error.response?.data || error.message);
  }
}

testTaskService();
