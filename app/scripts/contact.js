import './../scss/contact.scss';
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactform');
    if(app){
        form.addEventListener('submit', (e) => {
            alert('Success');
        })
    }
})