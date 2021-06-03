export default class Form {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.message = {
            loading: 'Loading...',
            success: 'Thank you! We will contact you soon',
            failure: 'Something went wrong...'
        };
        this.path = 'assets/question.php';
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    }

    checkMailInput() {
        const mailInputs = document.querySelectorAll('[type="email"]');

        mailInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z 0-9 _ - @ \.]/g, '');
            });
        });
    }

    clearForm(item) {
        item.querySelectorAll('input').forEach(elem => {
            elem.value = '';
        });
    }

    initMask() {
        const setCursorPosition = (pos, elem) => {
            elem.focus();

            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();

                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };

        function createMask(event) {

            let matrix = '+1 (___) ___-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');

            if (def.length >= val.length) {
                val = def;
            }

            this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });

            if (event.type === 'blur') {
                if (this.value.length == def.length + 1) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }


        let inputs = document.querySelectorAll('[name="phone"]');

        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    submit() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.classList.add('status');
                form.parentNode.appendChild(statusMessage);
                statusMessage.textContent = `${this.message.loading}`;

                const formData = new FormData(form);

                this.postData(this.path, formData)
                    .then(res => {
                        console.log(res);
                        statusMessage.textContent = `${this.message.success}`;
                        statusMessage.classList.add('success');
                    })
                    .catch(() => {
                        statusMessage.textContent = `${this.message.failure}`;
                        statusMessage.classList.add('fail');
                    })
                    .finally(() => {
                        this.clearForm(form);
                        setTimeout(() => statusMessage.remove(), 6000);
                    });
            });
        });
    }

    init() {
        this.checkMailInput();
        this.initMask();
        this.submit();
    }
}