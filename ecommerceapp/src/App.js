import logo from './logo.svg';
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './Components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Companysignup from './Components/Companysignup';
import Header from './Components/Header';
import Addproduct from './Components/Addproduct';
import Viewproduct from './Components/Viewproduct';
import Home from './Components/Home';
import Order from './Components/Order';
import Cart from './Components/Cart';

function App() {
  return (
    <div>
      <Header/>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/companysignup' element={<Companysignup/>} />
        <Route path='/addproduct' element={<Addproduct/>} />
        <Route path='/viewproduct' element={<Viewproduct/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/order' element={<Order/>} />
        <Route path='/cart' element={<Cart/>} />






      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
