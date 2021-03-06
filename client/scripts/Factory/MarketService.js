marketApp.factory('MarketService', [function() {
  class utilities{
        constructor(){}
        static randomNumber (max,min){
          return ((Math.random() * (max - min ) + min).toFixed(2));
        }
    }
    const BALANCE = 100;
    const MAXPRICE = 9.99;
    const MINPRICE = 0.50;
    const MAXPRICECHANGE = 0.5;
    const MINPRICECHANGE = -0.5
    const MAXCOLLECTIBLES = 0.30;
    const MINCOLLECTIBLES = 0.1;

    class marketItem{
        constructor(name, price){
          this.name = name;
          this.price = price;
        }//ends contructor

        changePrice(){
          let price = parseFloat(this.price) + parseFloat(utilities.randomNumber(MAXPRICECHANGE,MINPRICECHANGE));

          if (price > 9.99){
            price = 9.99
          }
          else if (price < .50){
            price = .50
          }
          this.price = price.toFixed(2);
        }//ends changePrice
    }//ends marketItem

    class collectibles extends marketItem {

      constructor(name,price) {
        super(name,price);
      }

      changePrice(){
        let price = parseFloat(this.price) + parseFloat(utilities.randomNumber(MAXCOLLECTIBLES,MINCOLLECTIBLES));
        // console.log('Random number: ',parseFloat(utilities.randomNumber(MAXPRICECHANGE,MINPRICECHANGE)));
        if (price > 9.99){
          price = 9.99
        }
        this.price = price.toFixed(2);
      }//ends changePrice

    }

    class UserAcc {
        constructor(balance) {
            this.balance = balance;
            this.cart = [];
            // this.cartSummary = [];
        }

        IncBal(salePrice) {
            this.balance += salePrice;
        }

        DecBal(salePrice) {
            this.balance -= salePrice;
            // console.log(this.balance);
        }

        CountItem(foo) {
            let count = 0;
            for (index of this.cart) {
                if (index.name === foo) {
                    count++;
                }
            }
            return count;
        }

        PriceAvg(name) {
            let avg = 0;
            let total = 0;
            let count = this.CountItem(name);
            for (index of this.cart) {
                if (index.name === name) {
                    total = total + parseFloat(index.price);
                }
            }
            if(count == 0) {
              avg = 0;
            } else {
              avg = total / count;
            }
            return avg.toFixed(2);
        }
    } //end UserAcc Class

    //marketItems array of instantiated objects of class marketItem
    let marketItems = [];
    //market obect houses the array of marketItems is a portal
    let market = {};

    let cartSummary = [];

    //instantiate a user with a balance
    let user = new UserAcc(BALANCE);


    //list of items which will be instantiated as objects of class marketItem
    let listOfItems = ['toaster', 'lamp', 'clock', 'blueRay player','apples','oranges','bananas','grapes','comic books','stuffed animals','jewelry','wine'];
    let listOfElectronics = ['toaster', 'lamp', 'clock', 'blueRay player'];
    let listOfFruit = ['apples','oranges','bananas','grapes'];
    let listOfCollectibles = ['comic books','stuffed animals','jewelry','wine'];


    //for of loop which instantiates objects of class marketItem based on the listOfItems array
    for (index of listOfElectronics) {
      let newItem = new marketItem(index, utilities.randomNumber(MAXPRICE,MINPRICE));
      marketItems.push(newItem);
    }

    for (index of listOfFruit) {
      let newItem = new marketItem(index, utilities.randomNumber(MAXPRICE,MINPRICE));
      marketItems.push(newItem);

    }for (index of listOfCollectibles) {
      let newItem = new collectibles(index, utilities.randomNumber(MAXPRICE,MINPRICE));
      marketItems.push(newItem);
    }

    let InitializeCartSummary = () => {
      // console.log('in InitializeCartSummary');
      cartSummary = [];
      let summaryObject;

      for(let i = 0; i < listOfItems.length; i++) {
        let itemName = listOfItems[i];
        summaryObject = {};
        summaryObject.name = itemName;
        summaryObject.avgPrice = user.PriceAvg(itemName);
        summaryObject.count = user.CountItem(itemName);
        cartSummary.push(summaryObject);
      }
      // console.log('Just initialized cartSummary',cartSummary);
    }

    let UpdateCartSummary = (itemName) => {
      // console.log('in UpdateCartSummary');

      for(let i = 0; i < cartSummary.length; i++) {
        if(cartSummary[i].name === itemName) {
          cartSummary[i].avgPrice = user.PriceAvg(itemName);
          cartSummary[i].count = user.CountItem(itemName);
        }
      }
      // console.log('Just updated cartSummary',cartSummary);
    }

    //adding merketItems array into market object
    market.marketItems = marketItems;
    //builds the original summary array
    InitializeCartSummary();


    let sellItem = (item) => {
      //balance + item.price (from MArketItems)


      for (index of marketItems ) {
        if (index.name === item.name) {
      console.log('ITEM NAME:', item.name, 'ITEM PRICE', index.price);
        user.IncBal(parseFloat(index.price));
        }
        console.log('INCRES BALANCE:',user.balance);
      }

      //remove from cart first instance of that item
      let i = 0;
      let notFound = true;
      while (notFound === true && i < user.cart.length) {
        if(user.cart[i].name === item.name) {
          user.cart.splice(i,1);
          notFound = false;
        } else {
          i++;
        }
      }
      UpdateCartSummary(item.name);
    }// end sellItem function

    let buyItem = (item) => {
      //balance - item.price (from MArketItems)
      user.DecBal(item.price);
      // console.log('in buyItem balance is: ', user.balance);
      //add item to cart
      console.log("Cart in buyItem function:",user.cart);
      let itemToPush = angular.copy(item);
      user.cart.push(itemToPush);
      UpdateCartSummary(item.name);
      console.log('cartSummary:',cartSummary);
    }// end buyItem function

    return {
        user: user,
        market: market,
        sellItem: sellItem,
        buyItem: buyItem,
        cartSummary: cartSummary,
        UpdateCartSummary: UpdateCartSummary,

    }

}]);
