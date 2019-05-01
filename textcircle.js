Router.configure({
    layoutTemplate: 'maintemplate'
});


Router.route('/user');


Router.route('/messages', function(){
        if (!Meteor.user()) {
            this.render('login', {
                to: "main"
            });
    }else{
        this.render('message', {
            to: "main"
        });
    }
});


Router.route('/login', function(){
    this.render('login', {
        to: "main"
    });
});

Router.route('/register', function(){
    if (!Meteor.user()) {
        this.render('register', {
            to: "main"
        });
    }else{
        window.location.href = '/messages';
    }

});



Messages = new Mongo.Collection("messages");

if (Meteor.isClient){

    Template.message.helpers({
        messages: function(){
            return Messages.find({}, {sort: {time: -1}})
        }
    });
    Template.maintemplate.helpers({
        loggedIn: function(){
            if (Meteor.user()) {
                return true;
            }
        },
        user: function(){
            return Meteor.user().username;
        }
    });

    Template.maintemplate.events({
        'click #logout': function(e){
            Meteor.logout()
            e.preventDefault()
            window.location.href = 'login';
        }
    });

    Template.message.events({
        'click .send-button': function(e){
                var msg = document.getElementById('msg-input').value;
                var time = new Date();
                if (msg.trim().length > 0) {
                    Messages.insert({
                        userId: Meteor.userId(),
                        user: Meteor.user().username,
                        msg: msg,
                        from: Meteor.user().username,
                        time: time
                    })
                }
                console.log(user)
                document.getElementById('msg-input').value = '';
                return false;
            },
        'keypress input': function(e){
            if (e.which === 13) {
                var msg = e.target.value;
                var time = new Date();
                Messages.insert({
                    user: Meteor.user().username,
                    msg: msg,
                    time: time
                })
                e.target.value = '';
                return false;
            }

        }
    })
    Template.register.events({
        'click .register-button': function(){
            var username = document.getElementById('username').value;
            var email = document.getElementById('username').value;
            var password = document.getElementById('username').value;

            Accounts.createUser({
                username: username,
                email: email,
                password: password
            })
            return false
        }
    })
       Template.login.events({

        'click .login-button': function(){
                Meteor.loginWithPassword(email=this.logEmail, password=this.logPassword, function(error){
                    if (error) {
                        vm.error = true;
                    }else{
                        window.location.href='/profile'

                    }
                });

        }

    })
}

if (Meteor.isServer){
	Meteor.startup(function(){
		if (!Messages.findOne()) {
            Messages.insert({
                message: "Meteor server started."
            });
        }
	})
}
