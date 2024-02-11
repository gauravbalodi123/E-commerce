// console.log('connected');

const allLikeButton = document.querySelectorAll('.like-button');


async function likeButton(productid,btn) {

    // Send a POST request
    try {
        const response = await axios({
            method: 'post',
            url: `/product/${productid}/like`,
            headers: {
                // this is to confirm that the request being send is a axios req so that we can handle it differently in isLoggedin middleware.
                'X-Requested-With': 'XMLHttpRequest'
            }
        });


        // firstly btn is a span and has <icon> as childern i.e fas and far heart.
        if(btn.children[0].classList.contains('fas')){
            btn.children[0].classList.remove('fas');
            btn.children[0].classList.add('far');
        }
        else{
            btn.children[0].classList.remove('far');
            btn.children[0].classList.add('fas');
        }



        console.log(response);
    }


    catch(e){
        // used to redirect the browser using JS
        window.location.replace('/login');
      console.log(e.message);
    }

}



for (let btn of allLikeButton) {
    btn.addEventListener('click', () => {
        const productid = btn.getAttribute('product-id');
        likeButton(productid,btn);
    })
}

