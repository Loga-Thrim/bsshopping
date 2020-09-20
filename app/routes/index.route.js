module.exports = function(express, app, path, session, body){
    var controller = require("./../controllers/index.controller");

    app.set('views', path.join(__dirname + "/../../views/pages"));
    app.set('view engine', 'ejs')
    app.use(session({secret: "dc7fea60"}))
    app.use(body.json());
    app.use(body.urlencoded());
    app.use("/css", express.static(path.join(__dirname + "/../../public/stylesheets")));
    app.use("/images", express.static(path.join(__dirname + "/../../public/images")));
    app.use("/socket", express.static(path.join(__dirname + "/../../node_modules/socket.io-client/dist")));
    app.use("/productImg", express.static(path.join(__dirname + "/../../public/images/product")))
    app.use("/bootstrap", express.static(path.join(__dirname + "/../../node_modules/bootstrap/dist/css")));
    app.use("/bootstrapJs", express.static(path.join(__dirname + "/../../node_modules/bootstrap/dist/js")))
    app.use("/angular", express.static(path.join(__dirname + "/../../node_modules/angular")));
    app.use("/sweetalert", express.static(path.join(__dirname + "/../../node_modules/sweetalert/dist")));
    app.get("/", controller.home);
    app.get("/loginPage", controller.templateLogin)
    app.get("/product", controller.products)
    app.get("/profile", controller.profiles)
    app.get("/logout", controller.logout)
    app.post("/login", controller.login)
    app.post("/register", controller.register)
    app.post("/changePassword", controller.changePassword)
    app.get("/bill/:id", controller.bill)
    app.get("/detailProduct/:id", controller.detailProduct)
    app.get("/bill", function(req, res){res.redirect("/product")})
    app.get("/detailProduct", function(req, res){res.redirect("/product")})
    app.post("/inputContact", controller.inputContact)
    app.post("/billConfirm/:name", controller.billConfirm)
    app.get("/contact", controller.contact)
    app.get("/news", controller.news)
    app.get("/login", function(req, res){res.redirect("/loginPage")})
    //app.get("/seller", controller.seller)

    a=0
    while(a<1000){
        a++
        app.use("/img"+a, express.static(path.join(__dirname + "/../../public/images/product/"+a+".jpg")))
    }
}
