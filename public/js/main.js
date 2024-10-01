function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const shortenBtn = document.getElementById('shortenBtn');
    const originalUrlInput = document.getElementById('originalUrl');
    const resultDiv = document.getElementById('result');

    shortenBtn.addEventListener('click', async () => {
        const originalUrl = originalUrlInput.value;
        if (!originalUrl || !isValidUrl(originalUrl)) {
            alert('Please enter a valid URL');
            return;
        }
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalUrl })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.shortUrl) {
                resultDiv.textContent = `Shortened URL: ${window.location.origin}${data.shortUrl}`;
                const link = document.createElement('a');
                link.href = `${window.location.origin}${data.shortUrl}`;
                link.textContent = `${window.location.origin}${data.shortUrl}`;
                link.target = '_blank';
                resultDiv.appendChild(document.createElement('br'));
                resultDiv.appendChild(link);
            } else {
                resultDiv.textContent = 'Error shortening the URL';
            }
        } catch (err) {
            console.error('Error shortening the URL: ', err);
            resultDiv.textContent = 'Error: ' + err.message;
        }
    });
});
