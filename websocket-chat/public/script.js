var socket = io();

socket.emit("joining room", name);

$("form").submit(function (e) {
	// Prevent page reloading
	e.preventDefault();

	// AJAX
	socket.emit("chat message", name + ":  " + $("#m").val());
	$("#messages").append($('<li id="list">').text("You:  " + $("#m").val()));
	$("#m").val("");
	return false;
});

// fungsi mengirim pesan
socket.on("chat message", function (msg) {
	$("#messages").append($("<li>").text(msg));
});
