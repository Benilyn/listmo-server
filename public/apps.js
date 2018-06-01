let currentProject;
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

	$('#display-projects').click(function() {
		getProjectList();
	});

	$('#hide-projects').click(function() {
		$('ul#projectlist').empty();
	});

	$('ul#projectlist').on('click', 'li', function() {
		var projectInfo = $(this).data('projectInfo');
		getProjectInfo(projectInfo);
	});

	$('#add-project-task').on('click', function() {
		console.log(currentProject);
		$('#add-task-form').show();
	});

	$('#submit-addtask').click(function() {
		addTask(currentProject);
		$('#add-task-form input').val('');
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
	}; //const projectData
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
} //addProject function

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
			var $project = $('<li class="project"></li>').data('projectInfo', project).appendTo($projects);
			$('<span class="projectTitle"><a href=#>' + project.projectTitle + '</a></span>').appendTo($project);
		});
	});
}

function getProjectInfo(projectInfo) {
	$.ajax('/project/' + projectInfo.id, {
		type: 'GET',
		data: {projectInfo: projectInfo.id}
	})
	.then(function(result) {
		console.log(result);
		currentProject = result;
		$('#project-info .project-title').text(result.projectTitle);
		$('#project-info .project-duedate').text(result.projectDueDate);
		$('#project-info .project-detail').text(result.projectDetail);
	});
}

function addTask(currentProject) {
	console.log(currentProject);
	const taskData = {
		taskTitle: $('#add-task-form [name="taskTitle"]').val(),
		taskDueDate: $('#add-task-form [name="taskDueDate"]').val(),
		taskDetail: $('#add-task-form [name="taskDetail"]').val(),
		taskProject: currentProject.id
	}; //const projectData
	$.ajax('/task', {
		contentType: 'application/json',
		data: JSON.stringify(taskData),
		type: 'POST'})
	.then(function(res) {
		console.log(res);
	})
	.fail(function(err) {
		console.log(err);
	});
} //addProject function
