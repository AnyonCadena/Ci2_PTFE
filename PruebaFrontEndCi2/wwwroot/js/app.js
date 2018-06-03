//function log() {
//    document.getElementById('results').innerText = '';

//    Array.prototype.forEach.call(arguments, function (msg) {
//        if (msg instanceof Error) {
//            msg = "Error: " + msg.message;
//        }
//        else if (typeof msg !== 'string') {
//            msg = JSON.stringify(msg, null, 2);
//        }
//        document.getElementById('results').innerHTML += msg + '\r\n';
//    });
//}

//document.getElementById("login").addEventListener("click", login, false);
//document.getElementById("api").addEventListener("click", call_get_tareas, false);
//document.getElementById("logout").addEventListener("click", logout, false);

////var api_url = "http://localhost:5001";
//var api_url = "https://drsgps.co/protectedapi"

////var authority_url = "http://localhost:5000";
//var authority_url = "https://drsgps.co/identity";

//var this_url = "http://localhost:5003";
////var this_url = "https://drsgps.co/jsclient";

//var config = {
//    authority: authority_url,
//    client_id: "js",
//    redirect_uri: this_url + "/callback.html",
//    response_type: "id_token token",
//    scope: "openid profile api1",
//    post_logout_redirect_uri: this_url + "/index.html",
//};
//var mgr = new Oidc.UserManager(config);

//mgr.getUser().then(function (user) {
//    if (user) {
//        log("User logged in", user.profile);
//    }
//    else {
//        log("User not logged in");
//    }
//});

//function login() {
//    mgr.signinRedirect();
//}

//function logout() {
//    mgr.signoutRedirect();
//}

//function call_get_tareas(consulta) {
//    mgr.getUser().then(function (user) {
//        if (user) {
//            log("User logged in", user.profile);
//        }
//        else {
//            log("User not logged in, so it's not possible to call this api");
//            return;
//        }
//        var q = consulta || {};
//        var url = api_url + "/tareas/consultar?" + convert_to_url_paramas(q);
//        console.log(url);
//        var xhr = new XMLHttpRequest();
//        xhr.open("GET", url);
//        xhr.onload = function () {
//            log(xhr.status, JSON.parse(xhr.responseText));
//        }
//        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
//        xhr.send(null);
//    });
//}


//function call_post_tarea(tarea) {
//    mgr.getUser().then(function (user) {
//        var url = api_url + "/tareas/crear"
//        var xhr = new XMLHttpRequest();
//        xhr.open("POST", url);
//        xhr.setRequestHeader("Content-Type", "application/json");
//        xhr.onload = function () {
//            log(xhr.status, JSON.parse(xhr.responseText));
//        }
//        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
//        xhr.send(JSON.stringify(tarea));
//    });
//}

//function call_put_tarea(tarea) {
//    mgr.getUser().then(function (user) {
//        var url = api_url + "/tareas/actualizar"
//        var xhr = new XMLHttpRequest();
//        xhr.open("POST", url);
//        xhr.setRequestHeader("Content-Type", "application/json");
//        xhr.onload = function () {
//            log(xhr.status, JSON.parse(xhr.responseText));
//        }
//        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
//        xhr.send(JSON.stringify(tarea));
//    });
//}


//function call_delete_tarea(id) {
//    mgr.getUser().then(function (user) {
//        var url = api_url + "/tareas/borrar"
//        var xhr = new XMLHttpRequest();
//        xhr.open("POST", url);
//        xhr.setRequestHeader("Content-Type", "application/json");
//        xhr.onload = function () {
//            log(xhr.status, JSON.parse(xhr.responseText));
//        }
//        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
//        xhr.send(JSON.stringify({ id: id }));
//    });
//}

//function convert_to_url_paramas(data) {
//    var str = "";
//    for (var key in data) {
//        if (str != "") {
//            str += "&";
//        }
//        str += key + "=" + encodeURIComponent(data[key]);
//    }
//    return str;
//}