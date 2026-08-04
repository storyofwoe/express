document.getElementById('button1').addEventListener('click', async () => {
    try {
        const response = await fetch('https://legendary-space-spork-95956vj6q6v37v46-3000.app.github.dev/message');
        const message = await response.text();

        document.getElementById('result').textContent = message;
    } catch (error) {
        console.error('Error:', error);
    }
});