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
		$('.signup-page input').val('');
	}); //$('#cancel-signup').click(function()

	$('#submit-addproject').click(function() {
		addProject();
		getProjectList();
		$('.addproject-page input').val('');

	});
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

function addProject() {
	event.preventDefault();
	const projectData = {
		projectTitle: $('.addproject-page [name="projectTitle"]').val(),
		projectDueDate: $('.addproject-page [name="projectDueDate"]').val(),
		projectDetail: $('.addproject-page [name="projectDetail"]').val(),
		projectTask: $('.addproject-page [name="projectTask"]').val()
	};
	$.ajax('/project', {
		contentType: 'application/json',
		data: JSON.stringify(projectData),
		type: 'POST'})
	.then(function(res) {
		console.log(res);
	})
	.fail(function(err) {
		console.log(err);
	});
}

function getProjectList() {
	$.ajax({
		type: 'GET',
		url: '/project'
	})
	.then(function(projects) {
		console.log(projects);
		var $projects = $('ul#projectlist');
		$projects.empty();
		$.each(projects, function(index, project) {
			var $project = $('<li class="project"></li>').appendTo($projects);
			$('<span class="projectTitle">' + project.projectTitle + '</span>').appendTo($project);
		})
	})
}



