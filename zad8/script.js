document.addEventListener('DOMContentLoaded', () => {

    const themeStyle = document.getElementById('theme-style')
    const themeToggleBtn = document.getElementById('theme-toggle')

    themeToggleBtn.addEventListener('click', function () {
            if (themeStyle.getAttribute('href') === 'red.css') 
            {
                themeStyle.setAttribute('href', 'green.css')
                themeToggleBtn.textContent = 'Zmień motyw na czerwony'
            } else {
                themeStyle.setAttribute('href', 'red.css')
                themeToggleBtn.textContent = 'Zmień motyw na zielony'
            }
        })

    const toogleProjectsBtn = document.getElementById('toogle-projects')
    const projectsContent = document.getElementById('text-projects')

    toogleProjectsBtn.addEventListener('click', function() {
        if (projectsContent.style.display === 'none') {
            projectsContent.style.display = 'block'
            toogleProjectsBtn.textContent = 'Ukryj projekty'
        } else {
            projectsContent.style.display = 'none'
            toogleProjectsBtn.textContent = 'Pokaż projekty'
        }
    })

    const form = document.getElementById('contact-form')
    const successBox = document.getElementById('success-box')

    form.addEventListener('submit', function(event) {
        event.preventDefault()
        
        successBox.style.display = 'none'

        let isFormValid = true

        const imieInput = document.getElementById('imie')
        const nazwiskoInput = document.getElementById('nazwisko')
        const emailInput = document.getElementById('email')
        const wiadomoscInput = document.getElementById('wiadomosc')

        function clearError(inputElement) {
            inputElement.classList.remove('input-error')
            const errorDiv = document.getElementById('error-' + inputElement.id)
            errorDiv.textContent = ''
            errorDiv.classList.remove('visible')
        }

        function showError(inputElement, message) {
            inputElement.classList.add('input-error')
            const errorDiv = document.getElementById('error-' + inputElement.id)
            errorDiv.textContent = message
            errorDiv.classList.add('visible')
            isFormValid = false
        }

        [imieInput, nazwiskoInput, emailInput, wiadomoscInput].forEach(clearError)

        const zawieraCyfryRegex = /\d/ 
        const poprawnyEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        const imieWartosc = imieInput.value.trim()
        if (imieWartosc === '') {
            showError(imieInput, 'Pole Imię jest wymagane.')
        } else if (zawieraCyfryRegex.test(imieWartosc)) {
            showError(imieInput, 'Imię nie może zawierać cyfr.')
        }

        const nazwiskoWartosc = nazwiskoInput.value.trim()
        if (nazwiskoWartosc === '') {
            showError(nazwiskoInput, 'Pole Nazwisko jest wymagane.')
        } else if (zawieraCyfryRegex.test(nazwiskoWartosc)) {
            showError(nazwiskoInput, 'Nazwisko nie może zawierać cyfr.')
        }

        const emailWartosc = emailInput.value.trim()
        if (emailWartosc === '') {
            showError(emailInput, 'Pole E-mail jest wymagane.')
        } else if (!poprawnyEmailRegex.test(emailWartosc)) {
            showError(emailInput, 'Podaj poprawny format adresu e-mail.')
        }

        const wiadomoscWartosc = wiadomoscInput.value.trim()
        if (wiadomoscWartosc === '') {
            showError(wiadomoscInput, 'Pole Wiadomość nie może być puste.')
        }

        if (isFormValid) {
            const formData = {
                imie: imieWartosc,
                nazwisko: nazwiskoWartosc,
                email: emailWartosc,
                wiadomosc: wiadomoscWartosc
            }

            fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => response.json()).then(data => {
                successBox.textContent = data.message;
                successBox.style.display = 'block'
                form.reset()
            }).catch(error => {
                console.error("Bład wysyłania", error)
                const errorText = document.getElementById('error-wiadomosc')
                errorText.textContent = "Bład połączenia z serwerem"
                errorText.classList.add('visible')
            })
        }
    })

    fetch('data.json').then(response => {
        if (!response.ok) {
            throw new Error('Błąd (nie udało się podrać pliku')
        }
        return response.json()
    }).then(data => {
        const listaUmiejetnosci = document.getElementById('lista-umiejetnosci')
        data.umiejetnosci.forEach(umiejetnosc => {
            const li = document.createElement('li')
            li.textContent = umiejetnosc
            listaUmiejetnosci.appendChild(li)
        })

        const listaProjektow = document.getElementById('lista-projektow')
        data.projekty.forEach(projekt => {
            const li = document.createElement('li')
            li.textContent = projekt
            listaProjektow.appendChild(li)
        })
    }).catch(error => {
        console.error('Błąd:', error)
        document.getElementById('lista-umiejetnosci').innerHTML = '<li>Wystąpił błąd (sprawdź konsolę)</li>'
        document.getElementById('lista-projektow').innerHTML = '<li>Wystąpił błąd (sprawdź konsolę)</li>'
    })

    const itemInput = document.getElementById('item-input');
        const addBtn = document.getElementById('add-btn');
        const itemList = document.getElementById('item-list');
        const emptyMsg = document.getElementById('empty-msg');

        
        let items = JSON.parse(localStorage.getItem('mojeNotatki')) || [];

        function renderList() {
            itemList.innerHTML = '';

            if (items.length === 0) {
                emptyMsg.style.display = 'block';
            } else {
                emptyMsg.style.display = 'none';
            }

            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item;

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Usuń';
                deleteBtn.className = 'delete-btn';
                
                deleteBtn.onclick = function() {
                    items.splice(index, 1);
                    updateLocalStorageAndRender();
                };

                li.appendChild(deleteBtn);
                itemList.appendChild(li);
            });
        }

        function updateLocalStorageAndRender() {
            localStorage.setItem('mojeNotatki', JSON.stringify(items));
            renderList();
        }

        addBtn.addEventListener('click', function() {
            const newItemValue = itemInput.value.trim();

            if (newItemValue !== '') {
                items.push(newItemValue);
                itemInput.value = '';
                updateLocalStorageAndRender();
            } else {
                alert('Pole nie może być puste!');
            }
        });

        itemInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addBtn.click();
            }
        });

        renderList();

})
