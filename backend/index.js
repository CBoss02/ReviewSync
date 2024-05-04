require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');


const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const companyRoutes = require('./routes/companyRoutes');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require("./routes/projectRoutes");

app.use('/api/companies', companyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the backend');
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*'
    },
});

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('setup', (document) => {
        socket.join(document);
        console.log(`Socket ${socket.id} joined document ${document}`);
    });

    socket.on('comment', (data) => {
        io.to(data.document).emit('comment', data);
        console.log(`Comment on document ${data.document}: ${data.comment}`);
    });

    socket.on('revision', (data) => {
        io.to(data.document).emit('revision', data);
        console.log(`Revision on document ${data.document}`);
    });

    socket.on('new-document', (data) => {
        io.emit('new-document', data);
        console.log(`New document created: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});
