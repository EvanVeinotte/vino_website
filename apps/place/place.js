const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");

//for parsing the body's of requests
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(bodyParser.raw());

router.use(express.static(__dirname + '/react_apps/place'));

SECRET_KEY = process.env.SECRET_KEY;

WIDTH = 32;
HEIGHT = 32;

function loadMatrix(){
	board_matrix = JSON.parse(fs.readFileSync('place.json')).matrix;
}

function writeMatrix(){
	fs.writeFile('place.json', JSON.stringify({matrix: board_matrix}), (error) => {
		if(error) throw error;

		console.log('data written to file');

	});
}

function processPost(data){
	if(data.key === SECRET_KEY){
		board_matrix[data.x_coor][data.y_coor] = data.color;
	}else{
		console.log('key no work');
		return false;
	}
}

board_matrix = [];

for (let i=0; i<WIDTH; i++){
	board_matrix.push(new Array(HEIGHT).fill('#eeeeee'));
}

try{

	loadMatrix();

}catch(error){
	if(error){
		console.log(error);
	}
}


router.get('/', (req, res) => {
	res.sendFile(__dirname + '/react_apps/place/index.html');
});

router.get('/data/', (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.send(JSON.stringify({matrix: board_matrix}));
});

router.post('/data/', (req, res) => {
	let data = req.body;
	processPost(data);
	writeMatrix();
	res.end();
});

router.get('/info/', (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.sendFile(__dirname + '/pdfs/placePDF.pdf');
});

module.exports = router;