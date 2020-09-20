const mongodb = require("mongodb").MongoClient;
const urlMongo = "mongodb+srv://gfdwizardking:godframedark8654@bsshopping-bqm8b.mongodb.net/test?retryWrites=true";
const passwordHash = require("password-hash");
const verifyPassword = require("./../../node_modules/password-hash/lib/password-hash.js");
const nodemailer = require("nodemailer")
const configMail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gfd7812548965@gmail.com', // your email
        pass: 'godframedark8654theframe' // your email password
    }
})
const optionMongo = {
    useNewUrlParser: true,
}

var connect = 0;
exports.home = function(req, res){
    req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
    if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
    res.render("index", {login: req.session.loginNav, nameUser: req.session.nameUser});
    delete req.session.loginNav;
}

exports.templateLogin = function(req, res, next){
    if (req.session.statusLogin == "success"){
        res.redirect("/");
        return next();
    }
    req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
    var contentRegisterStatus = "";
    var contentLoginStatus = "";
    if (req.session.statusRegister == "success"){
        contentRegisterStatus = "<script>swal('สมัครสมาชิกสำเร็จ', 'ยินดีต้อนรับสู่การเป็นสมาชิก BS shopping', 'success')</script>";
        delete req.session.statusRegister;
    } else if(req.session.statusRegister == "fail"){
        contentRegisterStatus = "<script>swal('สมัครสมาชิกล้มเหลว', 'มีอีเมลนี้แล้วในระบบ', 'warning')</script>";
        delete req.session.statusRegister;
    } else {contentRegisterComplete = "";} 

    if(req.session.statusLogin == "fail"){
        contentLoginStatus = "<script>swal('ล็อคอินล้มเหลว', 'กรุณาตรวจสอบอีเมล และรหัสผ่าน', 'warning')</script>";
        delete req.session.statusLogin;
    } else if(req.session.statusLogin == "success"){
        delete req.session.statusLogin;
        res.redirect("/")
        return next();
    } else{contentLoginStatus = "";}

    res.render("login", {login: req.session.loginNav, statusRegister: contentRegisterStatus,
    statusLogin: contentLoginStatus, nameUser: req.session.nameUser});
    delete req.session.loginNav;
}
exports.products = function(req, res){
    mongodb.connect(urlMongo, optionMongo, function(err, db){
        if (err) throw err
        dbcon = db.db("bsshopping")
        dbcon.collection("product").find().toArray(function(err, result){
            if (err) throw err
            req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
            if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
            let billing = ""
            if (req.session.billConfirm == "success"){
                billing = "<script>swal('สั่งซื้อสินค้าสำเร็จ !', 'ท่านจะได้รับสินค้าภายใน 5-10นาที หรือโทร 097-957-0661 หากต้องการสินค้าด่วน', 'success')</script>"
                delete req.session.billConfirm
            } else{billing = ""}
            res.render("product", {login: req.session.loginNav, nameUser: req.session.nameUser, billing: billing, product: result})
            delete req.session.loginNav
        })
    })
}

exports.bill = function(req, res){
    mongodb.connect(urlMongo, optionMongo, function(err, db){
        if (err) throw err
        dbcon = db.db("bsshopping")
        req.params.id = parseInt(req.params.id)
        dbcon.collection("product").find({_id: req.params.id}).toArray(function(err, result){
            if (err) throw err
            req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
            if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
            tell = req.session.tell
            facebook = req.session.facebook
            nickname = req.session.nickname
            result.forEach(function(snap){
                res.render("bill", {login: req.session.loginNav, nameUser: req.session.nameUser,
                bill: snap, tell: tell, facebook: facebook, nickname: nickname})
            })
        })
    })

    delete req.session.loginNav;
}

exports.billConfirm = function(req, res, next){
    let name = req.params.name
    let num = req.body.num
    let send = req.body.send
    let tell = req.body.tell
    let nickname = req.body.user
    let facebook = req.body.facebook
    let mailContent = {
        from: "gfd7812548965@gmail.com",
        to: "gfd.wizard.king@gmail.com",
        subject: "มีการสั่งซื้อสินค้า",
        html: "ชื่อ: "+name+"<br>จำนวน: "+num+"<br>ชื่อผู้ซื้อ: "+nickname+"<br>ส่งที่: "+send+"<br>ติดต่อ: "+tell+"<br>Facebook: "+facebook
    }
    configMail.sendMail(mailContent, function(){
        req.session.billConfirm = "success"
        mongodb.connect(urlMongo, optionMongo, function(err, db){
            if (err) throw err
            dbcon = db.db("bsshopping")
            dbcon.collection("product").find({name:name}).toArray(function(err, result){
                if (err) throw err
                result.forEach(function(snap){
                    dbcon.collection("product").updateOne({name:name}, {$set:{inventories: snap.inventories-num}}, function(err, test){
                        if (err) throw err
                        res.redirect("/product")
                    })
                })
            })
        })
    })
}
exports.detailProduct = function(req, res){
    mongodb.connect(urlMongo, optionMongo, function(err, db){
        if (err) throw err
        dbcon = db.db("bsshopping")
        req.params.id = parseInt(req.params.id)
        dbcon.collection("product").find({_id: req.params.id}).toArray(function(err, result){
            if (err) throw err
            req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
            if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
            result.forEach(function(snap){
                res.render("detailProduct", {login: req.session.loginNav, nameUser: req.session.nameUser, detail: snap})
            })
        })
    })

    delete req.session.loginNav;
}

exports.profiles = function(req, res, next){
    req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
    if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
    if(req.session.statusLogin != "success"){
        res.redirect("/loginPage")
        return next()
    }
    var contentChangePassword = "";
    if(req.session.changePasswordStatus == "oldPassword"){
        contentChangePassword = "<script>swal('รหัสผ่านเดิมไม่ถูกต้อง', 'อีเมลและรหัสผ่านนี้ไม่ตรงกัน', 'warning')</script>"
        delete req.session.changePasswordStatus
    }
    var updateContact = ""
    if(req.session.updateContact == "success"){
        updateContact = "<script>swal('อัพเดทข้อมูลติดต่อสำเร็จ', 'ข้อมูลการติดต่อของคุณถูกแก้ไขแล้ว', 'success')</script>"
        delete req.session.updateContact
    }
    var seller = ""
    if(req.session.power){
        if(req.session.power == "seller"){
            seller = "<a href='/seller' class='btn btn-primary'>สำหรับผู้จำหน่ายสินค้า</a><br><br><br>"
        }
    }
    res.render("profile", {login: req.session.loginNav, nameUser: req.session.nameUser,
    changePasswordStatus: contentChangePassword, tell:req.session.tell,
    facebook:req.session.facebook, nickname: req.session.nickname, updateContact: updateContact,
    seller: seller});
}

//  Seller

exports.seller = function(req, res, next){
    if(req.session.statusLogin != "success"){
        res.redirect("/loginPage")
        return next()
    }
    req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
    if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
    res.render("seller", {login: req.session.loginNav, nameUser: req.session.nameUser});
    delete req.session.loginNav;
}

////////// Users
exports.login = function(req, res){
    dataLogin = {
        username: req.body.usernameLogin,
        password: req.body.passwordLogin
    }
    if(dataLogin == "" || dataLogin == ""){
        res.redirect("/loginPage");
    }
    mongodb.connect(urlMongo, optionMongo, function(err, db){
        if (err) throw err;
        dbcon = db.db("bsshopping").collection("users");
        dbcon.find({"username": dataLogin.username}).toArray(function(err, resultUsername){
            if (err) throw err;
            if(resultUsername == ""){
                req.session.statusLogin = "fail";
                res.redirect("/loginPage");
            }
            resultUsername.forEach(function(snapObj){
                var checkPassword = verifyPassword.verify(dataLogin.password, snapObj.password);
                if(checkPassword == true){
                    if(snapObj.power){
                        if(snapObj.power == "seller"){
                            req.session.power = "seller"
                        }
                    }
                    req.session.statusLogin = "success"
                    req.session.nameUser = dataLogin.username
                    req.session.facebook = snapObj.facebook
                    req.session.tell = snapObj.tell
                    req.session.nickname = snapObj.nickname
                    res.redirect("/loginPage");
                } else if(checkPassword == false){
                    req.session.statusLogin = "fail";
                    res.redirect("/loginPage");
                }
            })
            db.close()
        })
    })
}

exports.inputContact = function(req, res, next){
    if(req.session.statusLogin != "success"){
        res.redirect("/loginPage")
        return next()
    }
    var tell = req.body.tell
    var facebook = req.body.facebook
    var nickname = req.body.nickname
    if (tell != ""){
        if (tell.length != 10){
            res.redirect("/profile")
            return next()
        }
    }
    mongodb.connect(urlMongo, optionMongo, function(err, db){
        if (err) throw err
        dataCheck = {
            username: req.session.nameUser
        }
        updateContact = {
            $set:{facebook: facebook, tell:tell, nickname: nickname}
        }
        db.db("bsshopping").collection("users").updateOne(dataCheck, updateContact, function(err){
            if(err) throw err
            req.session.tell = tell
            req.session.facebook = facebook
            req.session.nickname = nickname
            req.session.updateContact = "success"
            res.redirect("/profile")
        })
    })
}
exports.changePassword = function(req, res, next){
    if(req.session.statusLogin != "success"){
        res.redirect("/loginPage")
        return next()
    }
    dataChangePassword = {
        email: req.session.nameUser,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    }
    mongodb.connect(urlMongo, optionMongo, function(err, db){
        if(err) throw err;
        dbcon = db.db("bsshopping");
        dbcon.collection("users").find({"username":dataChangePassword.email}).toArray(function(err, resultEmail){
            if (err) throw err;
            resultEmail.forEach(function(snap){
                var hashOldPassword = verifyPassword.verify(dataChangePassword.oldPassword, snap.password);
                if (hashOldPassword == true){
                    dbcon.collection("users").updateOne({"password": snap.password}, {$set: {"password": passwordHash.generate(dataChangePassword.newPassword)}}, function(err){
                        if (err) throw err;
                        req.session.changePasswordStatus = "success";
                        delete req.session.statusLogin;
                        delete req.session.nameUser;
                        res.redirect("/loginPage")
                    })
                } else if(hashOldPassword == false){
                    req.session.changePasswordStatus = "oldPassword";
                    res.redirect("/profile");
                }
            })
            db.close()
        })
    })
}
exports.logout = function(req, res, next){
    if(req.session.statusLogin != "success"){
        res.redirect("/loginPage")
        return next()
    }
    req.session.destroy()
    res.redirect("/");
} 

exports.register = function(req, res){
    dataRegister = {
        username: req.body.usernameRegister,
        password: passwordHash.generate(req.body.passwordRegister),
        tell: "",
        facebook: "",
        nickname: ""
    }
    if(dataRegister.username == "" || dataRegister.password == "" || dataRegister.email == ""){
        res.redirect("/loginPage");
    }
    mongodb.connect(urlMongo, optionMongo, function(err, db){
        if (err) throw err;
        dbcon = db.db("bsshopping");
        dbcon.collection("users").find({"username": dataRegister.username}).toArray(function(err, resultUsername){
            if (err) throw err;
            if (resultUsername == ""){
                dbcon.collection("users").insertOne(dataRegister, function(err){
                    if (err) throw err;
                    req.session.statusRegister = "success";
                    res.redirect("/loginPage");
                })
            } else{
                req.session.statusRegister = "fail";
                res.redirect("/loginPage");
            }
            db.close()
        })
    })
}

exports.contact = function(req, res){
    req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
    if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
    res.render("contact", {login: req.session.loginNav, nameUser: req.session.nameUser});
}

exports.news = function(req, res){
    req.session.loginNav = "<li><a href='/loginPage'>ระบบสมาชิก</a></li>";
    if (req.session.nameUser){ req.session.loginNav = "<li><a href='/profile'>ข้อมูลสมาชิก</a></li>" }
    res.render("news", {login: req.session.loginNav, nameUser: req.session.nameUser});
}