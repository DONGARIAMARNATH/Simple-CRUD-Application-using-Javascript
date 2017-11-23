var root = 'https://jsonplaceholder.typicode.com';
var postsList;
var usersList;
var albumsList;
var itemsList;
var app;

$(function() { 
	getData();
});

function getData(){

  $(document).ajaxStop(function() {
    $(this).unbind("ajaxStop"); //prevent running again when other calls finish
    LoadItems();
	RunAll();
  });
  
  // Get Posts
  LoadPosts();
  
  // Get Albums
  LoadAlbums();
  
  // Get Users
  LoadUsers();
	
}

function RunAll(){
  app = new function() {
  this.el = document.getElementById('appItems');
  this.appItems = itemsList;
  this.Count = function(data) {
    var el   = document.getElementById('counter');
    var name = 'item';
    if (data) {
      if (data > 1) {
        name = 'appItems';
      }
      el.innerHTML = data + ' ' + name ;
    } else {
      el.innerHTML = 'No ' + name;
    }
  };
  
  this.FetchAll = function() {
    var data = '';
    if (this.appItems.length > 0) {
      for (i = 0; i < this.appItems.length; i++) {
        data += '<tr>';
        data += '<td>' + this.appItems[i].post.title + '</td>';
        data += '<td>' + this.appItems[i].album.title + '</td>';
        data += '<td>' + this.appItems[i].user.name + '</td>';
        data += '<td><button onclick="app.Edit(' + i + ')">Edit</button></td>';
        data += '<td><button onclick="app.Delete(' + i + ')">Delete</button></td>';
        data += '</tr>';
      }
    }
    this.Count(this.appItems.length);
    return this.el.innerHTML = data;
  };
  this.Edit = function (item) {
    var el = document.getElementById('edit-name');
    // Display value in the field
    el.value = this.appItems[item].post.title;
    // Display fields
    document.getElementById('spoiler').style.display = 'block';
    self = this;
    document.getElementById('saveEdit').onsubmit = function() {
      // Get value
      var editValue = el.value;
      if (editValue) {
        // Edit value
		self.appItems[item].post.title = editValue.trim();
        //self.appItems.splice(item, 1, item.trim());
        // Display the new list
        self.FetchAll();
        // Hide fields
        CloseInput();
      }
    }
  };
  this.Delete = function (item) {
    // Delete the current row
    this.appItems.splice(item, 1);
    // Display the new list
    this.FetchAll();
  };
  
}
app.FetchAll();
}


function CloseInput() {
  document.getElementById('spoiler').style.display = 'none';
}

function LoadPosts(){
	
	$.ajax({
	  url: root + '/posts',
	  method: 'GET'
	}).then(function(data) {
	  console.log(data);
	  postsList = data;
	});
}

function LoadAlbums(){
	
	$.ajax({
	  url: root + '/albums',
	  method: 'GET'
	}).then(function(data) {
	  console.log(data);
	  albumsList = data;
	});

}

function LoadUsers(){
	$.ajax({
	  url: root + '/users',
	  method: 'GET'
	}).then(function(data) {
	  console.log(data);
	  usersList = data;
	});	
	
}

function LoadItems(){
	
	itemsList = new Array();
	for(var i = 0; i < 30; i++){
		var item = new Object();
		item.post = postsList[i];
		item.album = albumsList[i];
		item.user = usersList[i % 10];
		itemsList[i] = item;
	}
	console.log(itemsList);
}
