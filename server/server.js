const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const date = require('date-and-time');
let task = [];

app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());

app.listen(port, () => {
    console.log('Escuchando puerto:', port);
});


app.post('/task/create', function(req, res) {
    let codeMsg = 200;
    let name;
    let dueDate = '';
    let objErrors = [];
    let validationError = { name: '', dueDate: '' };
    let objName = [];
    let objdueDate = [];
    let validation = { data: '', message: '', rule: '' };

    if (req.query["name"] === undefined) {
        codeMsg = 500;
        validation = { data: null, message: "Validation error: \"null\" Rule \"required(true)\" failed.", rule: 'required', args: [true] };
        objName.push(validation);

    } else {
        name = req.query["name"];
    }

    if (typeof name !== 'string' || name === '') {
        codeMsg = 500;
        validation = { data: null, message: "Validation error: \"null\" is not of type \"string\"", rule: 'string' };
        objName.push(validation);

    }
    if (req.query["dueDate"] === undefined) {
        codeMsg = 500;
        validation = { data: null, message: "Validation error: \"null\" Rule \"required(true)\" failed.", rule: 'required', args: [true] };
        objdueDate.push(validation);
    } else {
        dueDate = req.query["dueDate"];
    }
    if (!date.isValid(dueDate, 'YYYY-MM-DD')) {
        codeMsg = 500;
        validation = { data: null, message: "Validation error: \"null\" is not of type \"date\"", rule: 'date' };
        objdueDate.push(validation);
    }
    if (codeMsg === 500) {
        validationError = { name: objName, dueDate: objdueDate };
        objErrors = { validationError: validationError };

        res.status(500).json({ status: 500, errors: objErrors });
    } else {
        let size = task.length;
        let priority = req.query.priority;
        let objTask = { name, dueDate, priority, createdAt: date.format(new Date(), 'YYYY-MM-DD hh:mm:ss A [GMT]Z'), updatedAt: date.format(new Date(), 'YYYY-MM-DD hh:mm:ss A [GMT]Z'), id: size + 1 };
        task.push(objTask);
        res.status(200).json(
            objTask
        );
    }
});

app.get('/task', function(req, res) {
    res.status(200).json(
        task
    );
});

app.get('/task/destroy/:id', function(req, res) {
    // El parametro siempre es requerido porque de lo contrario no encontraria el metodo
    if (req.params.id === undefined) {
        return res.status(400).json({
            "status": 400,
            "validationErrors": "No id provided."
        });
    }

    let index = task.findIndex(objTask => objTask.id === idTask);
    if (index < 0) {
        return res.status(404).json({
            "status": 404,
            "validationErrors": "Error id is invalid"
        });

    }

    let idTask = parseInt(req.params.id);
    let result = task.find(objTask => objTask.id === idTask);

    task.splice(index, 1);

    res.status(200).json(
        result
    );
});

app.post('/task/update', function(req, res) {
    let body = req.body;
    let index = task.findIndex(objTask => objTask.id === body.id);
    let result = task.find(objTask => objTask.id === body.id);
    task[index].name = body.name;
    task[index].dueDate = body.dueDate;
    task[index].priority = body.priority;
    task[index].updatedAt = date.format(new Date(), 'YYYY-MM-DD hh:mm:ss A [GMT]Z');

    res.status(200).json(
        result
    );

});