/*   Assignment: Vue Movie Tickets - Final Project
     JS of Vue Movie Tickets - Final Project
     Author: Audrey Harmon
     Date: December 4, 2022
*/

// creates component for movies array to be stored and added to the dom
Vue.component('movies', {
    // declares template for each movie to be displayed by in the dom

    // image src is binded by prop 

    // movie overview is displayed in card body by instance

    // buttons are created in card footer and on click methods for each ticket category
    // are called with the movie object being passed an arg
    template: `
        <div class="card" style="width: 18rem;">
            <img v-bind:src=image class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">{{title}}</h5>
                <br>
                <hr>
                <p class="card-text">{{description}}</p>
            </div>
            <hr>
            <div class="card-footer">
                    
                <button type="button" class="btn" @click="addAdultTicket(movieobj)">Adult Ticket </button>
                    
                </br>
                    
                <button type="button" class="btn" @click="addChildTicket(movieobj)">Child Ticket </button>
            </div>
        </div>
    
    `,
    // props for binding into the template are declared
    props: ['title', 'image', 'description', 'movieobj'],
    // methods for the component are declared
    methods: {
        // method for adding an adult ticket is declared and called within the button element of the template
        addAdultTicket(movie){
            // an event emitter is declared to send an event in to the Vue instance when the button is clicked
            this.$emit('addticket')  
        },
        addChildTicket(movie){
            this.$emit('addchildticket')
        }
    }
})  

// Vue instance declared
const app = new Vue({
    // linked to the dom by root element
    el: "#root",
    // data properties are declared within the instance
    data: {
        // empty movies array is declared to hold api movies 
        movies: [], 
        // number of movies to display is declared
        numOfMovies: 4,
        // cart items variable is declared with a value of 0 to start with
        cartItem: 0,
        // along with adult tickets and child tickets
        adultTickets: 0,
        childTickets: 0,
        // cart array is declared to hold movie objects that are added to the cart
        cart: [],     
        // price for adult tickets is declared
        adultPrice: 8.99,
        // price for child tickets is declared
        childPrice: 4.99
        
    },
    // computed values are stored here as functions with no parameters
    computed: {
        subtotal: function(){
            return this.adultTickets * this.adultPrice + this.childTickets * this.childPrice
        },
        adultSubtotal: function(){
            return this.adultTickets * this.adultPrice
        },
        childSubtotal: function(){
            return this.childTickets * this.childPrice
        }
    },
    // methods are declared
    methods: {
        // method for adding an adult ticket for the movie selected
        // takes the emitter from the component as an arg and the movie object
        addTicket(ev, movie){
            // increments the num of cart items by 1
            this.cartItem++
            // increments the num of adult tickets by 1
            this.adultTickets++
            // increments the num of adult tickets for the movie object specifically by one
            movie.adultTicket++
            // adds the price of one adult ticket on each click
            movie.subtotal += this.adultPrice
            // if the movie object is not already in the cart array
            if(!this.cart.includes(movie)){
                // the movie object is added
                this.cart.push(movie)
                // with one adult ticket being added after the initial click
                movie.adultTicket = 1
                // the child ticket quantity being set to 0 for the instance
                movie.childTicket = 0
                // and the adult subtotal set equal to the adult ticket price for one
                movie.adultTotal = this.adultPrice
                // the child subtotal equal to 0 
                movie.childTotal = 0
                // the subtotal for all tickets equal to one adult ticket
                movie.subtotal = this.adultPrice
            }
        },
        // method for adding a child ticket for the movie selected
        // takes the emitter from the component as an arg and the movie object
        addChildTicket(ev, movie){
            // increments the num of cart items by 1
            this.cartItem++
            // increments the num of child tickets by 1
            this.childTickets++
            // increments the num of child tickets for the movie object specifically by one
            movie.childTicket++
            // adds the price of one child ticket on each click
            movie.subtotal += this.childPrice
            // if the movie object is not already in the cart array
            if(!this.cart.includes(movie)){
                // the movie object is added
                this.cart.push(movie)
                // with one child ticket being added after the initial click
                movie.childTicket = 1
                // the adult ticket quantity being set to 0 for the instance
                movie.adultTotal = 0
                // and the adult subtotal set equal to the child ticket price for one
                movie.childTotal = this.childPrice
                // the subtotal for all tickets equal to one child ticket
                movie.subtotal = this.childPrice
            }
        },
        // method for removing adult ticket from movie object and cart
        removeAdult(movie){
            // decrements the cartItem
            this.cartItem--
            // decrements adultTickets
            this.adultTickets--
            // decrements adultTicket
            movie.adultTicket--
            // decreases the movie objects subtotal by the adult price of one ticket
            movie.subtotal -= this.adultPrice
        },
        // method for removing child ticket from movie object and cart
        removeChild(movie){
            // decrements the cartItem
            this.cartItem--
            // decrements childTickets
            this.childTickets--
            // decrements objects childTicket
            movie.childTicket--
            // decreases objects subtotal by the price of one child ticket
            movie.subtotal -= this.childPrice
        },
        // method for removing ticket object from cart
        removeTicket(ev, movie){
            // prevents negative num for cartItems being returned
            if(this.cartItem !== 0){
                this.cartItem--
            }
            // prevents negative num for adultTickets being returned
            if(this.adultTickets !== 0){
                this.adultTickets--
            }
            // prevents negative num for childTickets being returned
            if(this.childTickets !== 0){
                this.childTickets--
            }
            // resets movie objects subtotal to 0
            this.subtotal = 0
            // removes object from array entirely
            this.cart.pop(movie)
        },
        // function for declaring the movie objects subtotal
        calcObjTotal(movie){
            return (movie.adultTotal * movie.adultTicket) + (movie.childTotal * movie.childTicket)
        }
    },
    // makes the call to the api and retrieves data and stores it in an array the length of the numOfMovies declared in the instance
    mounted(){
        axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=344a400562bbf683b831534b49dcda8e&language=en-US&page=1')
            .then( (response) => (this.movies = response.data.results.slice(0, this.numOfMovies)))
    }
})