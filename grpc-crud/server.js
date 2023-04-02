import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import mysql from "mysql";

const PROTO_PATH = "./data.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const movieData = grpcObject.data.MovieData;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "grpc",
});

connection.connect();

const server = new grpc.Server();

function createMovie(call, callback) {
  const movie = call.request;

  connection.query("INSERT INTO movies SET ?", movie, (err, result) => {
    if (err) throw err;

    movie.id = result.insertId;
    callback(null, "Movie created successfully");
  });
}

function readAllMovies(call, callback) {
  connection.query("SELECT * FROM movies", (err, results) => {
    if (err) throw err;

    const movie = results;

    callback(null, { movie: results });
  })
}

function readMovie(call, callback) {
  const id = call.request.id;

  connection.query("SELECT * FROM movies WHERE id = ?", id, (err, results) => {
    if (err) throw err;

    const movie = results[0];
    callback(null, movie);
  });
}

function updateMovie(call, callback) {
  const movie = call.request;

  connection.query(
    "UPDATE movies SET name = ?, release = ?, rating = ? WHERE id = ?",
    [movie.name, movie.release, movie.rating, movie.id],
    (err, result) => {
      if (err) throw err;

      callback(null, movie);
    }
  );
}

function deleteMovie(call, callback) {
  const id = call.request.id;

  connection.query("DELETE FROM movies WHERE id = ?", id, (err, result) => {
    if (err) throw err;

    callback(null, "Movie deleted successfully");
  });
}

function main() {
  server.addService(movieData.service, {
    CreateMovie: createMovie,
    ReadAllMovies: readAllMovies,
    ReadMovie: readMovie,
    UpdateMovie: updateMovie,
    DeleteMovie: deleteMovie,
  });


  server.bindAsync(
    "localhost:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("Server started on port 50051");
    }
  );

}

main();
