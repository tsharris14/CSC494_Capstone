// daily_schedule_listeners.js

function getCurrentDate(){
	//Will need to handle when get to this page from calendar
	let today = new Date();
	let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let date = ("0" + today.getDate()).slice(-2);
	return today.getFullYear() + '-' + month + '-' + date;
}

function getUserEmail(){
	let url = window.location.href;
	let idx = url.indexOf("?user=");
	let email = "";
	if(idx !== -1){
		email = url.substr(idx + 6) + "@noctrl.edu";
	}
	return email;
}

// Once the page is loaded, get the user's classes, meetings, assignments, and to-do list
document.addEventListener('DOMContentLoaded', e => {
	Promise.all([
		// Get classes from database
		fetch('http://127.0.0.1:3000/classes', {
			method : 'POST',
			headers: {'Content-Type': 'application/json'},
			body : JSON.stringify({"email" : getUserEmail(), "mode" : 'g'})
			})
			.then(response => {
				if (!response.ok){
					throw new Error('HTTP error: ${response.status}');
				}
				return response.json();
			}),
		// Get meetings from database
		fetch('http://127.0.0.1:3000/meetings', {
			method : 'POST',
			headers: {'Content-Type': 'application/json'},
			body : JSON.stringify({"email" : getUserEmail(), "meetDate" : getCurrentDate(), "mode" : 'g'})
			})
			.then(response => {
				if (!response.ok){
					throw new Error('HTTP error: ${response.status}');
				}
				return response.json();
			}),
		// Get assignments from database
		fetch('http://127.0.0.1:3000/assignments', {
			method : 'POST',
			headers: {'Content-Type': 'application/json'},
			body : JSON.stringify({"email" : getUserEmail(), "dueDate" : getCurrentDate(), "mode" : 'g'})
			})
			.then(response => {
				if (!response.ok){
					throw new Error('HTTP error: ${response.status}');
				}
				return response.json();
			}),
		// Get to-do list from database
		fetch('http://127.0.0.1:3000/todo_lists', {
			method : 'POST',
			headers: {'Content-Type': 'application/json'},
			body : JSON.stringify({"email" : getUserEmail(), "listDate" : getCurrentDate(), "mode" : 'g'})
			})
			.then(response => {
				if (!response.ok){
					throw new Error('HTTP error: ${response.status}');
				}
				return response.json();
			})
	]).then(allResponses => {
		const classData = allResponses[0]; //Response from classes fetch
		const meetingData = allResponses[1]; //Response from meetings fetch
		const assignmentData = allResponses[2]; //Response from assignments fetch
		const todoData = allResponses[3]; //Response from to do lists fetch
		
		//If there are event or assignment data to display, make the tables visible
		if(classData.length > 0 || meetingData.length > 0){
			document.getElementById("eventlist").style.display = "block";
		}
		if(assignmentData.length > 0){
			document.getElementById("assignmentlist").style.display = "block";
		}
		
		// Handle class data
		console.log(classData);
		classData.forEach(rec => {
			console.log(rec);
			addEventTableRow("", rec.cid + rec.name, rec.startTime, rec.endTime, rec.building, rec.roomNum, 'c');
		});
			
		
		// Handle meeting data	
		console.log(meetingData);
		meetingData.forEach(rec => {
			console.log(rec);
			addEventTableRow(rec.mid, rec.title, rec.start, rec.end, rec.building, rec.roomNum, 'm');
		});
		
		// Handle assignment data
		console.log(assignmentData);
		assignmentData.forEach(rec => {
			console.log(rec);
			addAssignmentTableRow(rec.aid, rec.title, rec.dueTime, rec.cid);
		});
			
		// Handle to-do list data
		console.log(todoData);
		todoData.forEach(rec => {
			console.log(rec);
			//addAssignmentTableRow(rec.aid, rec.title, rec.dueTime, rec.cid);
		});
	})
	.catch(error => {
		console.log(error);
	});
	
});


document.getElementById("back-button").addEventListener('click', e => {
	let url = window.location.href;
	let idx = url.indexOf("?user=");
	let user = "";
	if(idx !== -1){
		user = url.substr(idx);
	}
	window.location.href = 'scheduler_landing.html' + user;
});

document.getElementById("logout").addEventListener('click', e => {
	let url = window.location.href;
	let idx = url.indexOf("?user=");
	let user = "";
	if(idx !== -1){
		user = url.substr(idx);
	}
	window.location.href = 'login.html';
});