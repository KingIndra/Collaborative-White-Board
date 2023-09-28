const { PeerServer } = require("peer");
const mysql = require('mysql');

const peerServer = PeerServer({ port: 9000, path: "/myapp" });

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "varun@mysql36",
	database : 'drfcollab'
})

connection.connect((err) => {
	if (err) {
		throw err
	}
	console.log("Connected!")
})

peerServer.on('connection', (client) => {
	const {id, token} = client

	const query = `
		select username from auth_user 
		where id = (
			select user_id from authtoken_token as t where t.key = "${token}"
		);
	`
	connection.query(query, function (error, results, fields) {
		if (error) {
			throw error
		}
		username = results[0]?.username
		if (!username) {
			client.socket.close()
		}
	})
})
