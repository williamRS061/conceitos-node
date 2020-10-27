const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const port = 3333;
const app = express();
const projects = [];

app.use(express.json());

/**
 * Tipos de parametros
 * Query params => filtros e paginação
 * Route params => identificar recursos (atualizar/deletar)
 * Request body => conteudo na hora de criar ou editar um recurso (JSON) 
 */

 /**
  * Middleware
  * Interceptador de requisições que pode interromper totalmente ou modificar os dados da requisição
  */

function logRequest(request, response, next) {
    const { method, url } = request;
    const label = `[${method}] ${url}`;
    console.time(label);
    next();
    console.timeEnd(label);
}

function validateUuid(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project id'});
    }

    return next();
}

app.use(logRequest);

/**
 * we can use validateUuid middleware here
 * app.use(/projects/:id, validateUuid);
 */

app.get('/projects', (request, response) => {
    const { title } = request.query;
    const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects
    return response.json(results);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
    const project = { id: uuid(), title, owner };
    projects.push(project);
    
    return response.json(project);
});

app.put('/projects/:id', validateUuid, (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex((project) => project.id === id);
    if (projectIndex < 0) {
        return response.status(400).json({ message: "User not found" });
    }

    const project = { id, title, owner };
    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', validateUuid, (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex((project) => project.id === id);
    if (projectIndex < 0) {
        return response.status(400).json({ message: "User not found" });
    }
    projects.splice(projectIndex, 1);
    return response.status(204).send();
})

app.listen(port, () => console.log(`🚀 Server started on port ${port} ❤`));
