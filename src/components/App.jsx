import '../css/App.css'
import Products from './Products'
import ShoppingCart from './ShoppingCart';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

let functions;
let dataClone = [];


const url = 'https://ajutprojekt-default-rtdb.europe-west1.firebasedatabase.app/products.json';

export default function App() {
    const [data, setData] = useState();
    const [amount, setAmount] = useState();
    const [loadingFinished, setLoadingFinished] = useState(false);
    const [navbarTotalCount, setNavbarTotalCount] = useState(0);

    useEffect(() => {
        async function getFireBase() {
            const response = await fetch(url);
            const data = await response.json();
            setAmount(Array(data.length).fill(0));
            setData(data);
            dataClone = structuredClone(data);
            setLoadingFinished(true);
        }

        getFireBase();
    }, [loadingFinished]);


    async function putFireBase() {
        alert('Purchase complete');

        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        await fetch(url, options);
    }

    // Reduces stock of a product by 1 while adding 1 in amount to keep count of products added
    function updateDataStock(object, index) {
        if (object.stock > 0) {
            object.stock -= 1;

            amount[index] += 1;
            setAmount([...amount]);

            setNavbarTotalCount(navbarTotalCount + 1);
        }
    }

    // Sets amount to 0's again, thus emptying the cart and restores stock that went to the cart
    //and restores stock to the same amount it was before they were added to cart
    function emptyCart() {
        let arrayLength = data.length;
        setData(structuredClone(dataClone));
        setAmount(Array(arrayLength).fill(0));
        setNavbarTotalCount(0);
    }

    // Empties 1 selected product from cart, restores its stock in Products page
    function remove1Product(index) {
        data[index].stock += 1;

        amount[index] -= 1;
        setData([...data]);
        setAmount([...amount]);

        setNavbarTotalCount(navbarTotalCount - 1);
    }


    functions = {
        putFireBase,
        setLoadingFinished,
        emptyCart,
        remove1Product
    }


    return (
        <>
            {loadingFinished ?
                <>

                    <Router>
                        <Navbar navbarTotalCount={navbarTotalCount} />
                        <Switch>
                            <Route exact path="/">
                                <Products data={data} updateDataStock={updateDataStock} amount={amount} />
                            </Route>
                            <Route path="/shoppingcart">
                                <ShoppingCart functions={functions} data={data} amount={amount} />
                            </Route>
                        </Switch>
                    </Router>
                </>
                :
                <h1>Loading product information</h1>
            }
        </>
    );
}