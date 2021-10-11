let UserList;
$(document).ready(function () {
  $.getJSON("../login.json", function (data) {
    UserList = data;
  }).fail(function () {
    alert("An error has occurred.");
  });
});

function checkLogin() {
  $.map(UserList, function (UserObj, Index) {
    if (UserObj.email == $('#mail').val() && UserObj.password == $('#password').val()) {
      location.href = "./pages/home.html";
      
      localStorage.setItem("name", UserObj.firstname);
      localStorage.setItem("lname", UserObj.lastname);
      localStorage.setItem("email", UserObj.email);
      localStorage.setItem("mobile", UserObj.mobile);
      localStorage.setItem("loginName", UserObj.loginName);

    }
  })
}