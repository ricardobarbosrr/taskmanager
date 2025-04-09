const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const TASKS_FILE = path.join(__dirname, './tasks.json');
console.log('Caminho do arquivo tasks.json:', TASKS_FILE);

// Criar arquivo tasks.json se não existir
async function ensureTasksFile() {
  try {
    // Garantir que o diretório existe
    await fs.ensureDir(path.dirname(TASKS_FILE));
    
    // Se o arquivo não existir, criar com array vazio
    if (!await fs.pathExists(TASKS_FILE)) {
      await fs.writeJSON(TASKS_FILE, [], { spaces: 2 });
      console.log('Arquivo tasks.json criado com sucesso');
    } else {
      // Verificar se o arquivo já existe e tem conteúdo válido
      const tasks = await fs.readJSON(TASKS_FILE);
      if (!Array.isArray(tasks)) {
        // Se não for um array, sobrescrever com array vazio
        await fs.writeJSON(TASKS_FILE, [], { spaces: 2 });
        console.log('Arquivo tasks.json corrompido, recriado com array vazio');
      }
    }
  } catch (error) {
    console.error('Erro ao garantir o arquivo tasks.json:', error);
    throw error;
  }
}

// Função para carregar tarefas
async function loadTasks() {
  try {
    const data = await fs.readJSON(TASKS_FILE);
    return data;
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    return [];
  }
}

// Função para gerar um novo ID
function generateId(tasks) {
  const lastTask = tasks[tasks.length - 1];
  return lastTask ? lastTask.id + 1 : 1;
}

// Função para salvar tarefas
async function saveTasks(tasks) {
  try {
    // Garantir que o diretório existe
    await fs.ensureDir(path.dirname(TASKS_FILE));
    
    // Verificar se o arquivo já existe
    const exists = await fs.pathExists(TASKS_FILE);
    
    // Se existe, fazer backup primeiro
    if (exists) {
      const backupFile = TASKS_FILE + '.backup';
      await fs.copyFile(TASKS_FILE, backupFile);
      console.log('Backup do arquivo tasks.json criado');
    }
    
    // Salvar o arquivo
    await fs.writeJSON(TASKS_FILE, tasks, { spaces: 2 });
    console.log('Tarefas salvas com sucesso:', tasks);
    return true;
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
    throw error;
  }
}

// Rota para carregar tarefas
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await loadTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar tarefas' });
  }
});

// Rota para adicionar tarefa
app.post('/api/tasks', async (req, res) => {
  try {
    console.log('Recebendo nova tarefa:', req.body);
    const tasks = await loadTasks();
    const newTask = {
      ...req.body,
      id: generateId(tasks),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    const saved = await saveTasks(tasks);
    console.log('Tarefas salvas:', tasks);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    res.status(500).json({ error: 'Erro ao adicionar tarefa' });
  }
});

// Rota para atualizar tarefa
app.put('/api/tasks/:id', async (req, res) => {
  try {
    console.log('Atualizando tarefa:', req.params.id, req.body);
    const tasks = await loadTasks();
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;

    const index = tasks.findIndex(task => task.id === taskId);
    if (index === -1) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    tasks[index] = updatedTask;
    const saved = await saveTasks(tasks);
    console.log('Tarefas atualizadas:', tasks);
    res.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Rota para excluir tarefa
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    console.log('Excluindo tarefa:', req.params.id);
    const tasks = await loadTasks();
    const taskId = parseInt(req.params.id);

    const filteredTasks = tasks.filter(task => task.id !== taskId);
    const saved = await saveTasks(filteredTasks);
    console.log('Tarefas após exclusão:', filteredTasks);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
});

// Iniciar o servidor
ensureTasksFile().then(() => {
  console.log('Arquivo tasks.json inicializado');
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
});
