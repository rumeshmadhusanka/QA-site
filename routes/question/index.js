const fs = require("fs");
const router = require("express").Router();
const connection = require("../../db");
const path = require('path');
const Filter = require('bad-words');

let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../response_format.json"), 'utf8'));

//get all questions
router.get('/', (req, res) => {
    connection.query("select post_id, user_id, topic, content ,date,post.answerd from post",
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'All the posts';
                res.json(json_response);
            }
        });
});
//get by id
router.get('/:id', (req, res) => {
    let id = req.params['id'];
    connection.query("select post_id, user_id, topic, content ,date,answerd from post where post_id=?", [id],
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] = [];
                res.json(json_response);
            } else if (results.length === 0) {
                json_response['success'] = false;
                json_response['message'] = "No matching post found";
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'post by id';
                res.json(json_response);
            }
        });
});
//get answered questions

router.get('/answered', (req, res) => {
    connection.query(
        "select post_id, user_id, topic, content, date from post where post_id in (select post_id from answer) ",
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'All the posts';
                res.json(json_response);
            }
        });
});


//unanswered
router.get('/unanswered', (req, res) => {
    connection.query(
        "select post_id, user_id, topic, content, date from post where post_id not in (select post_id from answer) ",
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                json_response['data'] = [];
                res.json(json_response);
            } else {
                json_response['data'] = results;
                json_response['success'] = true;
                json_response['message'] = 'All the posts';
                res.json(json_response);
            }
        });
});

let filter = new Filter();
router.post('/', (req, res) => {
    let req_body = req.body;
    let cleaned = filter.clean(req_body['content']);
    if (cleaned === req_body['content']) {

        connection.query("insert into post(user_id, topic, content, date) values (?,?,?,?)",
            [req_body['user_id'], req_body['topic'], req_body['content'], req_body['date']],
            (error, results) => {
                if (error) {
                    console.error("error: ", error);
                    json_response['success'] = false;
                    json_response['message'] = error;
                    res.json(json_response);
                } else {
                    let affected_rows = results.affectedRows;
                    if (affected_rows === 0) {
                        console.log("affected rows 0");
                        json_response['message'] = 'Error';
                        json_response['data'] = [];
                        json_response['success'] = false;
                        res.json(json_response);
                    } else {
                        json_response['success'] = true;
                        json_response['message'] = 'Added ok';
                        json_response['data'] = [];
                        res.json(json_response);
                    }
                }
            })

    }else {
        json_response['message'] = 'BAD_WORDS';
        json_response['data'] = [];
        json_response['success'] = false;
        res.json(json_response);
    }
});


router.put('/:id', (req, res) => {
    let request_body = req.body;
    let id = req.params['id'];
    console.log(request_body);
    connection.query("update post set name=?, price=?, description=? where id=?",
        [request_body['name'], request_body['price'], request_body['description'], id],
        (error, results, fields) => {
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
    connection.query("delete from post where post_id=?", [id],
        (error, results) => {
            if (error) {
                console.error("error: ", error);
                json_response['success'] = false;
                json_response['message'] = error;
                res.json(json_response);
            } else {
                let affected_rows = results.affectedRows;
                if (affected_rows === 0) {
                    console.log("affected rows 0");
                    json_response['message'] = 'Error';
                    json_response['data'] = [];
                    json_response['success'] = false;
                    res.json(json_response);
                } else {
                    json_response['success'] = true;
                    json_response['message'] = 'Added ok';
                    json_response['data'] = [];
                    res.json(json_response);
                }
            }
        })
});
module.exports = router;