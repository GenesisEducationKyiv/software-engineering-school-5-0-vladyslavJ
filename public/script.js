const cityInput = document.getElementById('city');
const resultDiv = document.getElementById('result');

async function checkCityExists(city, retries = 5, delay = 200) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const res = await fetch(
				`/api/weather?city=${encodeURIComponent(city)}`
			);
			if (res.ok) {
				return true;
			} else if (res.status !== 200) {
				return false;
			}
			return null;
		} catch {
			if (attempt < retries) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			} else {
				return null;
			}
		}
	}
	return null;
}

cityInput.addEventListener('blur', async function () {
	const city = this.value.trim();
	resultDiv.textContent = '';
	resultDiv.className = '';
	if (!city) return;

	const exists = await checkCityExists(city);
	if (exists === false) {
		resultDiv.textContent =
			'City not found. Please enter a different name.';
		resultDiv.className = 'error';
	}
});

document
	.getElementById('subscribeForm')
	.addEventListener('submit', async function (e) {
		e.preventDefault();

		const email = this.email.value.trim();
		const city = this.city.value.trim();
		const frequency = this.frequency.value;

		resultDiv.textContent = '';
		resultDiv.className = '';

		const exists = await checkCityExists(city);
		if (exists === false) {
			resultDiv.textContent =
				'City not found. Please enter a different name.';
			resultDiv.className = 'error';
			return;
		}
		if (exists === null) {
			resultDiv.textContent =
				'Failed to verify city. Please try again later.';
			resultDiv.className = 'error';
			return;
		}

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
					'Subscription successful. Confirmation email sent.';
				resultDiv.className = 'success';
				this.reset();
			} else {
				resultDiv.textContent =
					data.message || 'An error occurred. Please try again.';
				resultDiv.className = 'error';
			}
		} catch (err) {
			resultDiv.textContent = 'Server connection error.';
			resultDiv.className = 'error';
		}
	});
