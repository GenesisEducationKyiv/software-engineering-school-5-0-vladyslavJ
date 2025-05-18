document
	.getElementById('subscribeForm')
	.addEventListener('submit', async function (e) {
		e.preventDefault();

		const email = this.email.value.trim();
		const city = this.city.value.trim();
		const frequency = this.frequency.value;

		const resultDiv = document.getElementById('result');
		resultDiv.textContent = '';
		resultDiv.className = '';

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, city, frequency }),
			});

			const data = await res.json();

			if (res.ok) {
				resultDiv.textContent =
					data.message ||
					'Підписка оформлена. Перевірте пошту для підтвердження.';
				resultDiv.className = 'success';
				this.reset();
			} else {
				resultDiv.textContent =
					data.message || 'Сталася помилка. Спробуйте ще раз.';
				resultDiv.className = 'error';
			}
		} catch (err) {
			resultDiv.textContent = 'Помилка з’єднання з сервером.';
			resultDiv.className = 'error';
		}
	});
