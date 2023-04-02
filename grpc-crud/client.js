import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './data.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const movieData = grpcObject.data.MovieData;

const client = new movieData('localhost:50051', grpc.credentials.createInsecure());

function createMovie(name, release, rating) {
    const movie = {
        name: name,
        release: release,
        rating: rating,
    };

    client.CreateMovie(movie, (err, response) => {
        console.log(response);
        if (err) {
            console.error(err);
            return;
        }

        console.log(`Movie created`);
    });
}

function readAllMovies() {
    client.ReadAllMovies(null, (err, response) => {
        if (err) {
            console.error(err)
            return;
        }

        console.log(response)
    })
}

function readMovie(id) {
    client.ReadMovie({ id: id }, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(response);
    });
}

function updateMovie(id, name, release, rating) {
    const movie = {
        name: name,
        release: release,
        rating: rating,
        id: id
    };

    client.UpdateMovie(movie, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(`Updated movie with id ${response.id}`);
    });
}

function deleteMovie(id) {
    client.DeleteMovie({ id: id }, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(`Deleted movie with id ${id}`);
    });
}

export default{
  createMovie,
  readAllMovies,
  readMovie,
  updateMovie,
  deleteMovie
}

// Contoh penggunaan fungsi-fungsi CRUD
// createMovie('John Doe', 'Jl. Sudirman No. 123', 25, 'male');
// readUser(1);
// updateUser(1, 'Jane Doe', 'Jl. Gatot Subroto No. 456', 27, 'female');
// deleteMovie(1);
