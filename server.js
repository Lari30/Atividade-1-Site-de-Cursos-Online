// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const courses = require('./data/courses');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_USER = process.env.AUTH_USER || 'aluno';
const AUTH_PASS = process.env.AUTH_PASS || 'senha123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'nao-use-em-producao';

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  const nextUrl = encodeURIComponent(req.originalUrl || '/');
  return res.redirect('/login?next=' + nextUrl);
}

// Helpers acessíveis nas views
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.user;
  res.locals.user = req.session.user;
  next();
});

// Rotas
app.get('/', (req, res) => {
  res.render('index', { courses });
});

app.get('/login', (req, res) => {
  const { error, next: nextUrl } = req.query;
  res.render('login', { error, nextUrl });
});

app.post('/login', (req, res) => {
  const { username, password, next: nextUrl } = req.body;
  if (username === AUTH_USER && password === AUTH_PASS) {
    req.session.user = { username };
    return res.redirect(nextUrl || '/');
  }
  return res.redirect('/login?error=Credenciais%20inválidas');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/curso/:id', requireAuth, (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).send('Curso não encontrado');
  res.render('course', { course });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
