// A

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended : false}));
mongoose.connect('mongodb://localhost/MyDatabase',
    {useNewUrlParser: true, useUnifiedTopology: true}
);

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.render('login_page');
});

const createNewAccountSchema = new mongoose.Schema({
    username : String,
    password : String
});
const loginSchema = new mongoose.Schema({
    user_id : String,
    connection_id : String,
    isLogin : Number
});
const createNewAccountTable = mongoose.model('registeredusers', createNewAccountSchema);
const loginTable = mongoose.model('sockettables', loginSchema);

app.post('/create_new_account', (req, res) => {
    const username = req.body.create_username;
    const password = req.body.create_password;
    const objNewAccount = new createNewAccountTable();
    objNewAccount.username = username;
    objNewAccount.password = password;
    objNewAccount.save();
    const objLoginTable = new loginTable();
    objLoginTable.user_id = objNewAccount._id;
    objLoginTable.connection_id = '000';
    objLoginTable.isLogin = 0;
    objLoginTable.save();
    res.redirect('/');
});

app.get('/create-account', (req, res) => {
    res.render('create_new_account');
});

// This function returns all registered users
const getRegistredUsers = async (loggedUserId) => {
    var registeredUsers = new Array();
    await createNewAccountTable.find({'_id' : {$ne : loggedUserId}}, (err, res) => {
        res.forEach((element, index) => {
            var tempArray = new Array();
            tempArray['user_id'] = element._id;
            tempArray['username'] = element.username;
            registeredUsers.push(tempArray);
        });
    });
    return registeredUsers;
}

app.post('/login', (request, response) => {
    var enteredUsername = request.body.username;
    var enteredPassword = request.body.password;
    createNewAccountTable.findOne(
        {username : enteredUsername, password : enteredPassword},
        (err, result) => {
            if (result) {
                io.once('connection', (socket) => {
                    console.log('socket Connected...');
                    console.log(socket.id);
                    loginTable.update(
                        {user_id : result._id},
                        {connection_id : socket.id, isLogin : 1},
                        (err, raw) => {
                            console.log(raw);
                        }
                    );
                    console.log('updated');
                });
                getRegistredUsers(result._id).then(data => {
                    response.render(
                        'chat_section',
                        {
                            messageSenderId : result._id,
                            messageSenderName : result.username,
                            registeredUsers : data
                        }
                    );
                })
            }
        }
    );
});

// Sending message
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('message', (msg) => {
        loginTable.findOne(
            {user_id : msg.messageReceiverId},
            (err, res) => {
                socket.broadcast.to(res.connection_id).emit('message', msg);
            }
        );
    });
});
