// const axios = require('axios');
AOS.init({ once: true });
      
const windowHeight = document.documentElement.clientHeight,
      registeredNumber = document.getElementById("registered-number"),
      demandNumber = document.getElementById("demand-number");

const isOnScreen = (id, el, to, duration) => {
  if(el.getBoundingClientRect().top <= (windowHeight / 1.2)) {
    if(id == 'registered-number') registeredNumberFlag = 1;
    if(id == 'demand-number') demandNumberFlag = 1;
    animateValue(id, 0, to, duration);
  }
}

let registeredNumberFlag = 0, demandNumberFlag = 0;

window.onload = function() {
  AOS.refresh();

  isOnScreen("registered-number", registeredNumber, 135, 1000)
  isOnScreen("demand-number", demandNumber, 150, 1200)
}

window.addEventListener('scroll', () => {
  if(registeredNumberFlag == 0) isOnScreen("registered-number", registeredNumber, 135, 1000)
  if(demandNumberFlag == 0) isOnScreen("demand-number", demandNumber, 150, 1200)
})

function animateValue(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = `+${current}`;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

(function() {
  scrollTo();
})();

function scrollTo() {
  const links = document.querySelectorAll('.scroll');
  links.forEach(each => (each.onclick = scrollAnchors));
}

function scrollAnchors(e, respond = null) {
  const distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
  e.preventDefault();
  var targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
  const targetAnchor = document.querySelector(targetID);
  if (!targetAnchor) return;
  const originalTop = distanceToTop(targetAnchor);
  window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
  const checkIfDone = setInterval(function() {
    const atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
    if (distanceToTop(targetAnchor) === 0 || atBottom) {
      targetAnchor.tabIndex = '-1';
      targetAnchor.focus();
      window.history.pushState('', '', targetID);
      clearInterval(checkIfDone);
    }
  }, 100);
}

const inputs = document.querySelectorAll('input'),
      inputSubmit = document.getElementById('inputSubmit')


// Form validation
const formWaiting = () => {
  inputs.forEach(each => each.setAttribute('disabled', true))
  inputSubmit.setAttribute('disabled', true)
  inputSubmit.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ESPERE...`
}

const formActive = () => {
  inputs.forEach(each => each.removeAttribute('disabled'))
  inputSubmit.removeAttribute('disabled')
  inputSubmit.innerHTML = `REGISTRARME`
}

const firstname = document.getElementById('firstname'),
      lastname = document.getElementById('lastname'),
      email = document.getElementById('email'),
      phone = document.getElementById('phone'),
      dni = document.getElementById('dni'),
      age = document.getElementById('age'),
      cars = document.getElementById('cars')

const validateLength = (el, min, max) => {
  if(el.value.length > min && el.value.length < max) {
    if(el.classList.contains('is-invalid')) el.classList.remove('is-invalid')
    return true
  } else {
    if(!el.classList.contains('is-invalid')) el.classList.add('is-invalid')
    return false
  }
}

const validateEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const validateDNI = (el, length) => {
  if(el.value.length == length) {
    if(el.classList.contains('is-invalid')) el.classList.remove('is-invalid')
    return true
  }

  if(!el.classList.contains('is-invalid')) el.classList.add('is-invalid')
  return false
}

const validateForm = () => {
  if(
  validateLength(firstname, 2, 30) && 
  validateLength(lastname, 2, 30) && 
  validateEmail(email.value) && 
  validateDNI(dni, 8)
  ) return true;
  return false;
}

const successContainer = document.getElementById('success-container'),
      registerFormContainer = document.getElementById('register-form-container')

document.getElementById('register-form').onsubmit = function(e) {
  e.preventDefault()

  if(validateForm()) {
    formWaiting()

    let data = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value ,
        phone: phone.value,
        dni: dni.value,
        age: age.value,
        cars: cars.value 
    }

    console.log(data)

    axios.post('/send-form.php', data)
    .then(function (response) {
        console.log(response)
        formActive()

        if(response.data == 1) {
          successContainer.classList.add('is-visible')
          registerFormContainer.classList.remove('is-visible')
          inputs.forEach(each => each.value = '')
        } else {
          alert('Ocurrió un error, inténtelo nuevamente.')
        }
    })
    .catch(function (error) {
        console.log(error)
        formActive()
    })
  }
}

document.getElementById('back-form').addEventListener('click', function(e) {
  e.preventDefault()
  successContainer.classList.remove('is-visible')
  registerFormContainer.classList.add('is-visible')
})