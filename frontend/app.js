const App = {
    data() {
        return {
            counter: 0,
            a: '',
            b: '',
            sign: '',
            finish: false,
            digit: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
            action: ['-', '+', '*', '/'],
            out: document.getElementsByTagName('p'),
        };
    },
    methods: {
        clearAll() {
            this.a = '';
            this.b = '';
            this.sign = '';
            this.finish = false;
            this.out[0].textContent = 0;
        },
        async getData(method, action, body) {
            const data = JSON.stringify(body);
            const res = await fetch(`http://127.0.0.1:8000/api/${action}`, {
                method,
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((data) => data.json());
            return res;
        },
        plusMinus() {
            const result = this.out[0].textContent;
            if (result.startsWith('-')) {
                this.out[0].textContent = result.split('-')[1];
                if (this.a === '' && this.b === '') {
                    return;
                } else if (this.a !== '' && this.b === '') {
                    this.a = `${+this.a * -1}`;
                } else if (this.a !== '' && this.b !== '') {
                    this.b = `${+this.b * -1}`;
                }
            } else {
                this.out[0].textContent = `-${result}`;
                if (this.a === '' && this.b === '') {
                    return;
                } else if (this.a !== '' && this.b === '') {
                    this.a = `${+this.a * -1}`;
                } else if (this.a !== '' && this.b !== '') {
                    this.b = `${+this.b * -1}`;
                }
            }
        },
        percent() {
            const result = this.out[0].textContent;
            if (this.a === '' && this.b === '') {
                this.out[0].textContent = `${+result / 100}`;
            } else if (this.a !== '' && this.b === '') {
                this.a = `${+this.a / 100}`;
                this.out[0].textContent = this.a;
            } else if (this.a !== '' && this.b !== '') {
                this.a = `${(+this.a / 100) * (100 - this.b)}`;
                this.b = 0;
                this.sign = '+';
            }
        },
        async handleClick(event) {
            if (!event.target.classList.contains('btn')) return;
            if (event.target.classList.contains('ac')) return;
            if (event.target.classList.contains('plusMinus')) return;
            if (event.target.classList.contains('percent')) return;

            this.out[0].textContent = '';
            const key = event.target.textContent;

            if (this.digit.includes(key)) {
                if (this.b === '' && this.sign === '') {
                    this.a += key;
                    this.out[0].textContent = this.a;
                } else if (this.a !== '' && this.b !== '' && this.finish) {
                    this.b = key;
                    this.finish = false;
                    this.out[0].textContent = this.b;
                } else {
                    this.b += key;
                    this.out[0].textContent = this.b;
                }
                return;
            }

            if (this.action.includes(key)) {
                this.sign = key;
                this.out[0].textContent = this.sign;
                return;
            }

            if (key === '=') {
                if (this.b === '') {
                    this.b = this.a;
                }
                const data = {
                    firstNumber: this.a,
                    secondNumber: this.b,
                };
                switch (this.sign) {
                    case '+': {
                        await this.getData('post', 'increment', data).then(
                            (data) => {
                                this.a = data.result;
                            }
                        );
                        break;
                    }
                    case '-': {
                        await this.getData('post', 'decrement', data).then(
                            (data) => {
                                this.a = data.result;
                            }
                        );
                        break;
                    }
                    case '*': {
                        await this.getData('post', 'multiply', data).then(
                            (data) => {
                                this.a = data.result;
                            }
                        );
                        break;
                    }
                    case '/': {
                        if (this.b === '0') {
                            this.out[0].textContent = 'Ошибка';
                            this.a = '';
                            this.b = '';
                            this.sign = '';
                            return;
                        }
                        await this.getData('post', 'divide', data).then(
                            (data) => {
                                this.a = data.result;
                            }
                        );
                        break;
                    }
                }
                this.finish = true;
                this.b = '';
                this.out[0].textContent = +this.a.toFixed(2);
            }
        },
    },
};

Vue.createApp(App).mount('#app');
