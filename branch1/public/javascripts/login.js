
const button = document.getElementById('registrati');
button.addEventListener('click', function(e) {
  console.log('button registrati was clicked');

  /*fetch('/registrati', {method: 'GET'})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });*/
});