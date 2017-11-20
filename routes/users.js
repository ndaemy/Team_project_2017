const express = require('express');
const User = require('../models/user')
const router = express.Router();
const catchErrors = require('../lib/async-error');

function needAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else{
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

function validateForm(form, options){
  var email = form.email || "";
  var name = form.name || "";
  mail = email.trim();
  name = name.trim();

  if(!email){
    return 'Email is required';
  }

  if(!name){
    return 'Name is required';
  }

  if(!form.password && options.needPassword){
    return 'Password is required';
  }

  if(form.password !== form.password_confirmation){
    return 'Password do not match';
  }

  if(form.password.length < 6){
    return 'Password must be at least 6 characters';
  }

  return null;
}

/* GET users listing. */
router.get('/', needAuth, catchErrors(async (req, res, next) => {
  const users = await User.find({});
  res.render('/', {users: users});
}))

router.get('/signup', (req, res, next) => {
  res.render('users/signup', {messages: req.flash()});
});

/*
이거는 그냥 단순히 edit를 눌렀을 때 users/edit로 render를 시켜주는 router인거임
router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {

}))
*/

/* 여기서 put 메소드는 뭐를 하는것일까?
edit를 하기위한 route인거 같다. edit.pug에서 form의 action:이 method put으로 가게 코딩되어있음
router.put('/:id', needAuth, catchErrors(async (req, res, next) => {

}))
*/

/*
사용자의 id를 get했을때 사용자의 id값을 찾고 맞다면 res.render로 어느 페이지로 갈지 설정해줌
router.get('/:id', catchErrors(async (req, res, next) => {

}))
*/

//signup ,, id만들기
router.post('/', catchErrors(async(req, res, next) => {
  var err = validateForm(req.body, {needPassword: true});
  if(err){
    req.flash('danger', err);
    return res.redirect('back');
  }
  var user = await User.findOne({email: req.body.email});
  console.log('USER???', user);
  if(user){
    req.flash('danger', 'Email address already exists.');
    return res.redirect('back');
  }
  user = new User({
    email: req.body.email,
    name: req.body.name,
  });
  user.password = await user.generateHash(req.body.password);
  await user.save();
  req.flash('success', 'Registered succesfully. Please sign in.');
  res.redirect('/');
}));

module.exports = router;
