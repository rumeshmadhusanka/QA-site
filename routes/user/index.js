const fs = require("fs");
const router = require("express").Router();
const connection = require("../../db");
const path = require('path');
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../response_format.json"), 'utf8'));


//get user profile
router.get('/:user_id', (req, res) => {
    let id = req.params['user_id'];
    let data = {};

    connection.query("select user_id, username, firstname, lastname, phone, role, password, email from user where user_id = ?", id,
        (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {

                results = results[0];
                data['user_id'] = results['user_id'];
                data['firstname'] = results['firstname'];
                data['lastname'] = results['lastname'];
                data['username'] = results['username'];
                data['email'] = results['email'];
                data['phone'] = results['phone'];
                data['role'] = results['role'];
                json_response['data'].push(data);
                res.json(json_response);
            }
        });


});

//create user
router.post('/', (req, res) => {
    let request_body = req.body;
    console.log(request_body);
    connection.query("insert into user(username, firstname, lastname, phone, password, email) values (?,?,?,?,?,?)",
        [request_body['username'],request_body['firstname'], request_body['lastname'],request_body['phone'],
            request_body['password'], request_body['email']], (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {
                let affected_rows = results.affectedRows;
                json_response['message'] = 'Affected Rows: ' + affected_rows;
                res.json(json_response);
            }
        });

});

router.put('/:id', (req, res) => {
    let request_body = req.body;
    let id = req.params['id'];
    console.log(request_body);
    connection.query("update customer set first_name=?, last_name=?, email=?, contact_no=? ,password=? where id=?",
        [request_body['first_name'], request_body['last_name'], request_body['email'],
            request_body['contact_no'],
            request_body['password'], id], (error, results, fields) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {
                let affected_rows = results.affectedRows;
                json_response['message'] = 'Affected Rows: ' + affected_rows;
                res.json(json_response);
            }
        })
});

router.delete('/:id', (req, res) => {
    let id = req.params['id'];
    connection.query("delete from customer where id=?", [id], (error, results, fields) => {
        if (error) {
            console.error("error: ", error);
            json_response['success'] = false;
            json_response['message'] = error;
            res.json(json_response);
        } else {
            let affected_rows = results.affectedRows;
            json_response['message'] = 'Affected Rows: ' + affected_rows;
            res.json(json_response);
        }
    })
});
module.exports = router;

