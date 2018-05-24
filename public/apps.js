$(document).ready(function() {

	$('.login-page').submit(function(event) {
		event.preventDefault();
		const loginData = {
			userName: $('.login-page [name="userName"]').val(),
			password: $('.login-page [name="password"]').val()
		}; //const loginData
		console.log(loginData);
		$.ajax('/login', {
			contentType: 'application/json',
			data: JSON.stringify(loginData),
			type: 'POST'}) 
		.then(function(res) {
			console.log(res);
		}) //.then function
		.fail(function() {
			alert('Username and password does not match. Please try again.');
		}); //.fail
	}); //$('#login-page form').submit(function(event)

	$('.sign-up').click(function() {
		$('.signup-page input').val('');
	}); //$('#sign-up').click(function()

	$('#submit-signup').click(function() {
		signUp();
	}); //$('.signup-page').submit(function() 

	$('#cancel-signup').click(function() {
	}); //$('#cancel-signup').click(function()
});

function signUp() {
	event.preventDefault();
	const userData = {
		firstName: $('.signup-page [name="firstName"]').val(),
		lastName: $('.signup-page [name="lastName"]').val(),
		userName: $('.signup-page [name="userName"]').val(),
		email: $('.signup-page [name="email"]').val(),
		password: $('.signup-page [name="password"]').val()
	}; //const userData
	$.ajax('/user', {
		contentType: 'application/json',
		data: JSON.stringify(userData),
		type: 'POST'}) 
	.then(function(res) {
		console.log(res);
	}); //.then function
} //signUp function