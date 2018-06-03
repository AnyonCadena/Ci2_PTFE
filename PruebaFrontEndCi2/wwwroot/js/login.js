//var url_api = "https://drsgps.co/protectedapi"
//var url_autorizacion = "https://drsgps.co/identity";
//var url_local = "http://localhost:5003";

//var config = {
//    authority: url_autorizacion,
//    client_id: "js",
//    redirect_uri: url_local + "/callback.html",
//    response_type: "id_token token",
//    scope: "openid profile api1",
//    post_logout_redirect_uri: url_local + "/login.html",
//};

//var gestionAutenticacion = new Oidc.UserManager(config);

//$(function () {
//    gestionAutenticacion.getUser().then(function (user) {
//        if (user) {
//            window.location("index.html");
//        }
//    });
//});

//$("#iniciarSesion").click(function () {
//    iniciarSesion();
//});


//function iniciarSesion() {
//    gestionAutenticacion.signinRedirect();
//}

//function cerrarSesion() {
//    gestionAutenticacion.signoutRedirect();
//}